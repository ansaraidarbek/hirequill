// generateCoverLetterForFreeTierUser
// generateCoverLetterForMonthlyTierUser
// generateCoverLetterForLifetimeTierUser
import { generateCoverLetterFromData } from "@/features/utils/generate-cover-letter";
import { CoverLetterRequest } from "@/features/utils/helpers";
import { MESSAGE_TYPE } from "./types/messageType";
import { consumeFreeGeneration, refundFreeGeneration } from "./atomicFunctions";

export async function generateCoverLetterForFreeTierUser(
    userId: string,
    validatedData: CoverLetterRequest,
): Promise<MESSAGE_TYPE> {
    let consumed = false;

    try {
        // 1) Reserve quota atomically
        consumed = await consumeFreeGeneration(userId);

        if (!consumed) {
            return {
                coverLetter: "",
                message:
                    "You have reached the maximum number of cover letters for the free tier",
            };
        }

        // 2) Generate (may throw)
        const coverLetter = await generateCoverLetterFromData(validatedData);

        return { coverLetter, message: "Cover letter generated successfully" };
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

        return { coverLetter: "", message: "Error generating cover letter" };
    }
}
