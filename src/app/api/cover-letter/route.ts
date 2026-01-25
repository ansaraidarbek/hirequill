import { getSubscriptionByUserId } from "@/db/subscriptions/subscriptions";
import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import {
    CoverLetterRequest,
    CoverLetterRequestSchema,
} from "@/features/utils/helpers";
import {
    generateCoverLetterForForeverUser,
    generateCoverLetterForFreeTierUser,
    generateCoverLetterForPaidUser,
} from "@/db/interactions";

export async function POST(req: NextRequest) {
    try {
        // Verify authentication
        const { userId } = await auth();
        if (!userId) {
            return NextResponse.json(
                { message: "Unauthorized - Authentication required" },
                { status: 401 },
            );
        }

        // Parse and validate request body
        const body = await req.json();

        // Validate the request data
        const validationResult = CoverLetterRequestSchema.safeParse(body);

        if (!validationResult.success) {
            const errors = validationResult.error.issues.map((err) => ({
                field: err.path.join("."),
                message: err.message,
            }));

            return NextResponse.json(
                {
                    message: "Validation failed",
                    errors,
                },
                { status: 400 },
            );
        }

        const validatedData: CoverLetterRequest = validationResult.data;

        let message = "no plan found";
        let coverLetter = null;
        let limitations = null;
        // check from the database whether current user has subscription
        // if save his CV to database
        const subscription = await getSubscriptionByUserId(userId);
        if (subscription) {
            switch (subscription.plan) {
                case "monthly":
                    {
                        const result = await generateCoverLetterForPaidUser(
                            userId,
                            validatedData,
                        );
                        coverLetter = result.coverLetter;
                        message = result.message;
                        limitations = result.limitations;
                    }
                    break;
                case "forever":
                    {
                        const result = await generateCoverLetterForForeverUser(
                            userId,
                            validatedData,
                        );
                        coverLetter = result.coverLetter;
                        message = result.message;
                        limitations = result.limitations;
                    }
                    break;
                default:
                    {
                        const result = await generateCoverLetterForFreeTierUser(
                            userId,
                            validatedData,
                        );
                        coverLetter = result.coverLetter;
                        message = result.message;
                        limitations = result.limitations;
                    }
                    break;
            }
        }

        return NextResponse.json(
            {
                message: message,
                data: {
                    coverLetter,
                    limitations,
                    companyName: validatedData.companyName,
                },
            },
            { status: 200 },
        );
    } catch (error) {
        console.error("❌ Error processing cover letter request:", error);

        // Handle JSON parsing errors
        if (error instanceof SyntaxError) {
            return NextResponse.json(
                {
                    message: "Invalid JSON in request body",
                    error: "Request body must be valid JSON",
                },
                { status: 400 },
            );
        }

        // Handle other errors
        return NextResponse.json(
            {
                message: "Internal server error",
                error:
                    error instanceof Error
                        ? error.message
                        : "Unknown error occurred",
            },
            { status: 500 },
        );
    }
}
