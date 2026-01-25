import { and, eq, lt, sql } from "drizzle-orm";
import { db } from "@/drizzle/db";
import { UserTable, UserCompanyUsageWeekTable } from "@/drizzle/schema";
import { getWeekStartUTC } from "@/utils/getWeekStart";
import { revalidateUserCompanyUsageWeeklyCache } from "./cache/usagesWeekly";
import { revalidateUserCache } from "./cache/user";

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
    revalidateUserCache(userId);

    return {
        consumed: true,
        left: Math.max(FREE_TIER_LIMIT - used, 0),
    };
}

export async function refundFreeGeneration(
    userId: string,
): Promise<{ refunded: boolean }> {
    const result = await db
        .update(UserTable)
        .set({
            totalFreeGenerationsThisMonth: sql`
        GREATEST(${UserTable.totalFreeGenerationsThisMonth} - 1, 0)
      `,
            totalGenerationsAllTime: sql`
        GREATEST(${UserTable.totalGenerationsAllTime} - 1, 0)
      `,
        })
        .where(
            and(
                eq(UserTable.id, userId),
                sql`${UserTable.totalFreeGenerationsThisMonth} > 0`,
            ),
        )
        .returning({ id: UserTable.id });

    const refunded = Boolean(result[0]);

    if (refunded) {
        revalidateUserCache(userId);
    }

    return { refunded };
}

export async function consumePaidGeneration(
    userId: string,
    companyKey: string,
): Promise<{ consumed: boolean }> {
    const weekStart = getWeekStartUTC();

    const consumed = await db.transaction(async (tx) => {
        // 1) Upsert weekly usage (always returns a row if insert/update succeeded)
        const usage = await tx
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

        if (!usage[0]) return false;

        // 2) Keep all-time counter consistent in the same transaction
        const updatedUser = await tx
            .update(UserTable)
            .set({
                totalGenerationsAllTime: sql`${UserTable.totalGenerationsAllTime} + 1`,
            })
            .where(eq(UserTable.id, userId))
            .returning({ id: UserTable.id });

        return Boolean(updatedUser[0]);
    });

    if (consumed) {
        revalidateUserCompanyUsageWeeklyCache(userId);
        revalidateUserCache(userId);
    }

    return { consumed };
}

export async function refundPaidGeneration(
    userId: string,
    companyKey: string,
): Promise<{ refunded: boolean }> {
    const weekStart = getWeekStartUTC();

    const refunded = await db.transaction(async (tx) => {
        // Only refund if there is something to refund (count > 0)
        const usage = await tx
            .update(UserCompanyUsageWeekTable)
            .set({
                count: sql`GREATEST(${UserCompanyUsageWeekTable.count} - 1, 0)`,
            })
            .where(
                and(
                    eq(UserCompanyUsageWeekTable.userId, userId),
                    eq(UserCompanyUsageWeekTable.weekStart, weekStart),
                    eq(UserCompanyUsageWeekTable.companyKey, companyKey),
                    sql`${UserCompanyUsageWeekTable.count} > 0`,
                ),
            )
            .returning({ count: UserCompanyUsageWeekTable.count });

        // No matching row or already zero → do NOT decrement totals
        if (!usage[0]) return false;

        const updatedUser = await tx
            .update(UserTable)
            .set({
                totalGenerationsAllTime: sql`GREATEST(${UserTable.totalGenerationsAllTime} - 1, 0)`,
            })
            .where(eq(UserTable.id, userId))
            .returning({ id: UserTable.id });

        return Boolean(updatedUser[0]);
    });

    if (refunded) {
        // run after commit
        revalidateUserCompanyUsageWeeklyCache(userId);
        revalidateUserCache(userId);
    }

    return { refunded };
}
