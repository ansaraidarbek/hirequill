import { db } from "@/drizzle/db";
import { UserCompanyUsageWeekTable } from "@/drizzle/schema/usagesWeekly";
import { revalidateUserCompanyUsageWeeklyCache } from "../cache/usagesWeekly";
import { and, eq } from "drizzle-orm";

export async function upsertUserCompanyUsageWeek(
    row: typeof UserCompanyUsageWeekTable.$inferInsert,
) {
    await db
        .insert(UserCompanyUsageWeekTable)
        .values(row)
        .onConflictDoUpdate({
            target: [
                UserCompanyUsageWeekTable.userId,
                UserCompanyUsageWeekTable.weekStart,
                UserCompanyUsageWeekTable.companyKey,
            ],
            set: row,
        });

    revalidateUserCompanyUsageWeeklyCache(row.userId);
}

export async function updateUserCompanyUsageWeek(
    userId: string,
    weekStart: string, // date as "YYYY-MM-DD"
    companyKey: string,
    patch: Partial<typeof UserCompanyUsageWeekTable.$inferInsert>,
) {
    await db
        .update(UserCompanyUsageWeekTable)
        .set(patch)
        .where(
            and(
                eq(UserCompanyUsageWeekTable.userId, userId),
                eq(UserCompanyUsageWeekTable.weekStart, weekStart),
                eq(UserCompanyUsageWeekTable.companyKey, companyKey),
            ),
        );

    revalidateUserCompanyUsageWeeklyCache(userId);
}
