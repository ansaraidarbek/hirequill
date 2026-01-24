import { and, eq, lt, sql } from "drizzle-orm";
import { db } from "@/drizzle/db";
import {
    UserTable,
    UserCompanyUsageWeekTable,
} from "@/drizzle/schema";
import { getWeekStartUTC } from "@/utils/getWeekStart";
import { revalidateUserCompanyUsageWeeklyCache } from "./cache/usagesWeekly";

const FREE_TIER_LIMIT = 2;
export async function consumeFreeGeneration(
    userId: string,
): Promise<{ consumed: boolean; left: number }> {
    const result = await db
        .update(UserTable)
        .set({
            totalFreeGenerationsThisMonth: sql`
        CASE
          WHEN ${UserTable.freeGenerationsMonth} = date_trunc('month', now())::date
          THEN ${UserTable.totalFreeGenerationsThisMonth} + 1
          ELSE 1
        END
      `,
            freeGenerationsMonth: sql`date_trunc('month', now())::date`,
            totalGenerationsAllTime: sql`${UserTable.totalGenerationsAllTime} + 1`,
        })
        .where(
            and(
                eq(UserTable.id, userId),
                sql`
          CASE
            WHEN ${UserTable.freeGenerationsMonth} = date_trunc('month', now())::date
            THEN ${UserTable.totalFreeGenerationsThisMonth}
            ELSE 0
          END < ${FREE_TIER_LIMIT}
        `,
            ),
        )
        .returning({
            usedThisMonth: UserTable.totalFreeGenerationsThisMonth,
        });

    // ❌ limit reached → no rows updated
    if (result.length === 0) {
        return {
            consumed: false,
            left: 0,
        };
    }

    const used = result[0].usedThisMonth;

    return {
        consumed: true,
        left: Math.max(FREE_TIER_LIMIT - used, 0),
    };
}

export async function refundFreeGeneration(userId: string) {
    await db
        .update(UserTable)
        .set({
            totalFreeGenerationsThisMonth: sql`
        GREATEST(${UserTable.totalFreeGenerationsThisMonth} - 1, 0)
      `,
            totalGenerationsAllTime: sql`
        GREATEST(${UserTable.totalGenerationsAllTime} - 1, 0)
      `,
        })
        .where(eq(UserTable.id, userId));
}

export async function consumePaidGeneration(
    userId: string,
    companyKey: string,
): Promise<{ consumed: boolean }> {
    const weekStart = getWeekStartUTC();
    const result = await db
        .insert(UserCompanyUsageWeekTable)
        .values({
            userId,
            weekStart,
            companyKey,
            count: 1,
        })
        .onConflictDoUpdate({
            target: [
                UserCompanyUsageWeekTable.userId,
                UserCompanyUsageWeekTable.weekStart,
                UserCompanyUsageWeekTable.companyKey,
            ],
            set: {
                count: sql`${UserCompanyUsageWeekTable.count} + 1`,
            },
        })
        .returning({ count: UserCompanyUsageWeekTable.count });

    if (result?.[0]) {
        await db
            .update(UserTable)
            .set({
                totalGenerationsAllTime: sql`${UserTable.totalGenerationsAllTime} + 1`,
            })
            .where(eq(UserTable.id, userId));
        revalidateUserCompanyUsageWeeklyCache(userId);
    }
    return {
        consumed: Boolean(result?.[0]),
    };
}

export async function refundPaidGeneration(
    userId: string,
    companyKey: string,
): Promise<void> {
    const weekStart = getWeekStartUTC();
    await db
        .update(UserCompanyUsageWeekTable)
        .set({
            count: sql`GREATEST(${UserCompanyUsageWeekTable.count} - 1, 0)`,
        })
        .where(
            and(
                eq(UserCompanyUsageWeekTable.userId, userId),
                eq(UserCompanyUsageWeekTable.weekStart, weekStart),
                eq(UserCompanyUsageWeekTable.companyKey, companyKey),
            ),
        );
    await db
        .update(UserTable)
        .set({
            totalGenerationsAllTime: sql`GREATEST(${UserTable.totalGenerationsAllTime} - 1, 0)`,
        })
        .where(eq(UserTable.id, userId));
    revalidateUserCompanyUsageWeeklyCache(userId);
}
