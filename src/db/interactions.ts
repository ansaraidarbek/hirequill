// generateCoverLetterForFreeTierUser
// generateCoverLetterForMonthlyTierUser
// generateCoverLetterForLifetimeTierUser
import { generateCoverLetterFromData } from "@/features/utils/generate-cover-letter";
import { CoverLetterRequest } from "@/features/utils/helpers";
import { MESSAGE_TYPE } from "./types/messageType";
import {
    consumeFreeGeneration,
    refundFreeGeneration,
    consumePaidGeneration,
    refundPaidGeneration,
    consumeForeverGeneration,
    refundForeverGeneration,
} from "./atomicFunctions";
import { UserTable } from "@/drizzle/schema/user";
import { sql } from "drizzle-orm/sql/sql";
import { db } from "@/drizzle/db";
import { getSubscriptionByUserId } from "./subscriptions/subscriptions";
import { getUser } from "./users/user";
import { getMonthStartUTC } from "@/utils/getMonthStart";
import { Limitations } from "./types/limitationType";
import { FREE_TIER_LIMIT } from "./constants";
import { getCVByUserId, insertCV } from "./cvs/cvs";
import { resolveCompanyKey } from "@/features/utils/resolve-company-names";
import { UserCompanyUsageWeekTable } from "@/drizzle/schema/usagesWeekly";
import { and, eq } from "drizzle-orm";
import { getWeekStartUTC } from "@/utils/getWeekStart";
import { getOpenAIClient } from "@/lib/openai-client";
import { CVType } from "./types/cvType";

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
            limitations: { exist: true, amount: data?.left ?? 0 },
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

export async function generateCoverLetterForPaidUser(
    userId: string,
    validatedData: CoverLetterRequest,
): Promise<MESSAGE_TYPE> {
    let consumed = false;
    let companyKey = validatedData.companyName;

    try {
        if (!validatedData.cvFileData?.id) {
            console.log("Inserting user CV into database");
            await insertUserCSV(userId, validatedData);
        }

        const weeklyCompanies = await getThisWeeksUserCompanies(userId);
        console.log("Weekly companies used:", weeklyCompanies);

        // Calculate total weekly generations
        const totalWeeklyGenerations = weeklyCompanies.reduce(
            (sum, company) => sum + company.generations,
            0,
        );

        const resolved = await resolveCompanyKey({
            currentCompanyName: companyKey,
            weeklyCompanyKeys: weeklyCompanies.map((c) => c.companyKey),
            client: getOpenAIClient(),
            model: "gpt-5-nano",
        });
        companyKey = resolved.companyKey;
        console.log("Resolved company key:", companyKey);

        // Find the current generation count for this company
        const companyUsage = weeklyCompanies.find(
            (c) => c.companyKey === companyKey,
        );
        const companyGenerations = companyUsage?.generations ?? 0;

        // Throttle check: Apply delay if user exceeds limits
        // Check if current count is >= threshold (meaning next generation will exceed it)
        const shouldThrottle =
            companyGenerations >= 4 || totalWeeklyGenerations >= 200;

        if (shouldThrottle) {
            // Calculate delay based on how much over the limit
            // Base delay of 5 seconds, plus additional time based on excess
            const baseDelay = 5000; // 5 seconds
            const companyExcess = Math.max(0, companyGenerations - 4);
            const weeklyExcess = Math.max(0, totalWeeklyGenerations - 200);
            const excessDelay =
                companyExcess * 2000 + weeklyExcess * 100; // 2s per company excess, 100ms per weekly excess
            const totalDelay = baseDelay + excessDelay;

            console.log(
                `Throttling request: companyGenerations=${companyGenerations}, totalWeeklyGenerations=${totalWeeklyGenerations}, delay=${totalDelay}ms`,
            );

            // Artificially delay the response
            await new Promise((resolve) => setTimeout(resolve, totalDelay));
        }

        const { consumed: didConsume } = await consumePaidGeneration(
            userId,
            companyKey,
        );
        consumed = didConsume;

        if (!consumed) {
            return {
                coverLetter: "",
                message: "Unable to record usage",
                limitations: null,
            };
        }
        console.log(
            "Generating cover letter with resolved company key:",
            companyKey,
        );
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

export async function generateCoverLetterForForeverUser(
    userId: string,
    validatedData: CoverLetterRequest,
): Promise<MESSAGE_TYPE> {
    let consumed = false;
    let companyKey = validatedData.companyName;

    try {
        if (!validatedData.cvFileData?.id) {
            await insertUserCSV(userId, validatedData);
        }

        const { consumed: didConsume } = await consumeForeverGeneration(
            userId,
        );
        consumed = didConsume;

        if (!consumed) {
            return {
                coverLetter: "",
                message: "Unable to record usage",
                limitations: null,
            };
        }
        console.log(
            "Generating cover letter with resolved company key:",
            companyKey,
        );
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
        console.error("generateCoverLetterForForeverUser error:", error);

        if (consumed) {
            try {
                await refundForeverGeneration(userId);
            } catch (refundError) {
                console.error("refundForeverGeneration error:", refundError);
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
): Promise<Array<{ companyKey: string; generations: number }>> {
    const weekStart = getWeekStartUTC();
    const rows = await db
        .select({
            companyKey: UserCompanyUsageWeekTable.companyKey,
            generations: UserCompanyUsageWeekTable.count,
        })
        .from(UserCompanyUsageWeekTable)
        .where(
            and(
                eq(UserCompanyUsageWeekTable.userId, userId),
                eq(UserCompanyUsageWeekTable.weekStart, weekStart),
            ),
        );
    return rows.map((r) => ({
        companyKey: r.companyKey,
        generations: r.generations,
    }));
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

export async function getCurrentCvInformation(
    userId: string,
): Promise<CVType | null> {
    const cv = await getCVByUserId(userId);
    if (!cv) {
        return null;
    }
    return {
        id: cv.id,
        base64: cv.plainText,
        fileName: cv.filename,
        fileType: cv.fileType,
    };
}
