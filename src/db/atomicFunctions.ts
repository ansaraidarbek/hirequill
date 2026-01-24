import { and, eq, lt, sql } from "drizzle-orm";
import { db } from "@/drizzle/db";
import { UserTable } from "@/drizzle/schema";

const FREE_TIER_LIMIT = 2;

export async function consumeFreeGeneration(userId: string) {
    const updated = await db
        .update(UserTable)
        .set({
            // reset monthly counter if month changed
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
        .returning({ ok: UserTable.id });

    return updated.length === 1;
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
