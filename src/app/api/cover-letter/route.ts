import { getSubscriptionByUserId } from "@/db/subscriptions/subscriptions";
import CreateCv from "@/features/create-cv";
import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import z from "zod";

const allowedTypes = [
    // PDF (most common)
    "application/pdf",
  
    // Word
    "application/msword", // .doc
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document", // .docx
  
    // Plain text (very AI-friendly)
    "text/plain",
  
    // Rich Text (older CVs)
    "application/rtf",
  ] as const;

// Validation schema for the request body
const CoverLetterRequestSchema = z.object({
    companyName: z.string().min(1, "Company name is required"),
    positionTitle: z.string().min(1, "Position title is required"),
    jobDescription: z.string().optional(),
    cvFileData: z
        .object({
            base64: z.string().min(1, "CV file data is required"),
            fileName: z.string().min(1, "File name is required"),
            fileType: z.enum(allowedTypes, "File type is required"),
        })
});

export type CoverLetterRequest = z.infer<typeof CoverLetterRequestSchema>;

export async function POST(req: NextRequest) {
    try {
        // Verify authentication
        const { userId } = await auth();
        if (!userId) {
            return NextResponse.json(
                { message: "Unauthorized - Authentication required" },
                { status: 401 }
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
                { status: 400 }
            );
        }

        const validatedData: CoverLetterRequest = validationResult.data;

        // check from the database whether current user has subscription 
        // if save his CV to database
        const subscription = await getSubscriptionByUserId(userId);
        if (subscription && (subscription?.plan === 'monthly' || subscription?.plan === 'forever')) {
            CreateCv({user: {id: userId}, subscription, data: validatedData});
        }

        return NextResponse.json(
            {
                message: "Cover letter generation request received and validated",
                data: {
                    companyName: validatedData.companyName,
                    positionTitle: validatedData.positionTitle,
                    hasJobDescription: Boolean(validatedData.jobDescription),
                    fileName: validatedData.cvFileData.fileName,
                },
            },
            { status: 200 }
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
                { status: 400 }
            );
        }

        // Handle other errors
        return NextResponse.json(
            {
                message: "Internal server error",
                error:
                    error instanceof Error ? error.message : "Unknown error occurred",
            },
            { status: 500 }
        );
    }
}
