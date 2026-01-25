// generateCoverLetterForFreeTierUser
// generateCoverLetterForMonthlyTierUser
// generateCoverLetterForLifetimeTierUser
import {
    generateCoverLetterFromData,
} from "@/features/utils/generate-cover-letter";
import { CoverLetterRequest } from "@/features/utils/helpers";
import { MESSAGE_TYPE } from "./types/messageType";
import {
    consumeFreeGeneration,
    refundFreeGeneration,
    consumePaidGeneration,
    refundPaidGeneration,
} from "./atomicFunctions";
import { UserTable } from "@/drizzle/schema/user";
import { sql } from "drizzle-orm/sql/sql";
import { db } from "@/drizzle/db";
import { getSubscriptionByUserId } from "./subscriptions/subscriptions";
import { getUser } from "./users/user";
import { getMonthStartUTC } from "@/utils/getMonthStart";
import { Limitations } from "./types/limitationType";
import { FREE_TIER_LIMIT } from "./constants";
import { insertCV } from "./cvs/cvs";
import { resolveCompanyKey } from "@/features/utils/resolve-company-names";
import { UserCompanyUsageWeekTable } from "@/drizzle/schema/usagesWeekly";
import { and, eq } from "drizzle-orm";
import { getWeekStartUTC } from "@/utils/getWeekStart";
import { getOpenAIClient } from "@/lib/openai-client";

export async function generateCoverLetterForFreeTierUser(
    userId: string,
    validatedData: CoverLetterRequest,
): Promise<MESSAGE_TYPE> {
    let consumed = false;

    try {
        // 1) Reserve quota atomically
        const data = await consumeFreeGeneration(userId);
        consumed = data.consumed;

        if (!consumed) {
            return {
                coverLetter: "",
                message:
                    "You have reached the maximum number of cover letters for the free tier",
                limitations: {
                    exist: true,
                    amount: 0,
                },
            };
        }

        // 2) Generate (may throw)
        const coverLetter = await generateCoverLetterFromData(validatedData);

        return {
            coverLetter,
            message: "Cover letter generated successfully",
            limitations: { exist: true, amount: data?.left ?? 0},
        };
    } catch (error) {
        console.error("generateCoverLetterForFreeTierUser error:", error);

        // 3) Refund only if we consumed
        if (consumed) {
            try {
                await refundFreeGeneration(userId);
            } catch (refundError) {
                console.error("refundGeneration error:", refundError);
                // we still return the original error to user; refund failure is internal
            }
        }

        return {
            coverLetter: "",
            message: "Error generating cover letter",
            limitations: null,
        };
    }
}

export async function getThisWeeksUserCompanies(
    userId: string,
): Promise<string[]> {
    const weekStart = getWeekStartUTC();
    const rows = await db
        .select({ companyKey: UserCompanyUsageWeekTable.companyKey })
        .from(UserCompanyUsageWeekTable)
        .where(
            and(
                eq(UserCompanyUsageWeekTable.userId, userId),
                eq(UserCompanyUsageWeekTable.weekStart, weekStart),
            ),
        );
    return rows.map((r) => r.companyKey);
}

export async function insertUserCSV(
    userId: string,
    validatedData: CoverLetterRequest,
): Promise<void> {
    const { base64, fileName, fileType } = validatedData.cvFileData;
    await insertCV({
        userId,
        filename: fileName,
        plainText: base64,
        fileType: fileType,
        storagePath: null,
    });
}

export async function generateCoverLetterForPaidUser(
    userId: string,
    validatedData: CoverLetterRequest,
    _isAnalytic?: boolean,
): Promise<MESSAGE_TYPE> {
    let consumed = false;
    let companyKey = validatedData.companyName;

    try {
        if (!validatedData.cvFileData?.id) {
            await insertUserCSV(userId, validatedData);
        }

        const weeklyCompanies = await getThisWeeksUserCompanies(userId);

        const resolved = await resolveCompanyKey({
            currentCompanyName: companyKey,
            weeklyCompanyKeys: weeklyCompanies,
            client: getOpenAIClient(),
            model: "gpt-5-nano",
        });
        companyKey = resolved.companyKey;

        const { consumed: didConsume } = await consumePaidGeneration(userId, companyKey);
        consumed = didConsume;

        if (!consumed) {
            return {
              coverLetter: "",
              message: "Unable to record usage",
              limitations: null,
            };
          }

        const coverLetter = await generateCoverLetterFromData({
            ...validatedData,
            companyName: companyKey,
        });

        return {
            coverLetter,
            message: "Cover letter generated successfully",
            limitations: { exist: false, amount: 0 },
        };
    } catch (error) {
        console.error("generateCoverLetterForPaidUser error:", error);

        if (consumed) {
            try {
                await refundPaidGeneration(userId, companyKey);
            } catch (refundError) {
                console.error("refundPaidGeneration error:", refundError);
            }
        }

        return {
            coverLetter: "",
            message: "Error generating cover letter",
            limitations: null,
        };
    }
}

export async function getTotalUsersGenerationsCount(): Promise<number> {
    const result = await db
        .select({
            total: sql<number>`COALESCE(SUM(${UserTable.totalGenerationsAllTime}), 0)`,
        })
        .from(UserTable);

    return result[0]?.total ?? 0;
}

export async function getUserLimitations(userId: string): Promise<Limitations> {
    try {
        // Get user and subscription
        const [user, subscription] = await Promise.all([
            getUser(userId),
            getSubscriptionByUserId(userId),
        ]);

        // If user has a paid subscription (monthly or forever), no limitations
        if (
            subscription &&
            (subscription.plan === "monthly" || subscription.plan === "forever")
        ) {
            return {
                exist: false,
                amount: 0,
            };
        }

        // For free tier users, check monthly limit
        const currentMonthStart = getMonthStartUTC();
        // Handle both Date objects and string dates from database
        const userMonthStart = user.freeGenerationsMonth
            ? typeof user.freeGenerationsMonth === "string"
                ? user.freeGenerationsMonth.slice(0, 10)
                : new Date(user.freeGenerationsMonth).toISOString().slice(0, 10)
            : null;

        // If the month is different from today's month, return full limit
        if (userMonthStart !== currentMonthStart) {
            return {
                exist: true,
                amount: FREE_TIER_LIMIT,
            };
        }

        // Calculate remaining generations
        const used = user.totalFreeGenerationsThisMonth || 0;
        const remaining = Math.max(0, FREE_TIER_LIMIT - used);

        return {
            exist: true,
            amount: remaining,
        };
    } catch (error) {
        console.error("Error calculating user limitations:", error);
        // Return default limitations on error
        return {
            exist: true,
            amount: 0,
        };
    }
}
