import { getSubscriptionByUserId } from "@/db/subscriptions/subscriptions";
import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import { generateCoverLetterFromData } from "@/features/utils/generate-cover-letter";
import { CoverLetterRequest, CoverLetterRequestSchema } from "@/features/utils/helpers";


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

        // check from the database whether current user has subscription
        // if save his CV to database
        const subscription = await getSubscriptionByUserId(userId);
        if (
            subscription &&
            (subscription?.plan === "monthly" ||
                subscription?.plan === "forever")
        ) {
            // CreateCv({ userId, subscription, data: validatedData });
            console.log("User subscription verified:", subscription);
        } else {
            const coverLetter = await generateCoverLetterFromData(validatedData);

            return NextResponse.json(
                {
                    message: "Cover letter generated successfully",
                    data: {
                        data: coverLetter,
                        message: "Cover letter generated successfully",
                    },
                },
                { status: 200 },
            );
        }

        return NextResponse.json(
            {
                message: "Cover letter generated successfully",
                data: {
                    data: null,
                    message:
                        "You need to unsubscribe to generate cover letters :)",
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
