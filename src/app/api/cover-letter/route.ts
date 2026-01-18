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

type CoverLetterRequest = z.infer<typeof CoverLetterRequestSchema>;

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

        // Data validation successful - log the received data
        console.log("✅ Cover letter request validated successfully:");
        console.log({
            userId,
            companyName: validatedData.companyName,
            positionTitle: validatedData.positionTitle,
            jobDescriptionLength: validatedData.jobDescription?.length || 0,
            fileName: validatedData.cvFileData.fileName,
            fileType: validatedData.cvFileData.fileType,
            fileSize: validatedData.cvFileData.base64.length,
        });

        // TODO: Implement actual cover letter generation logic here
        // For now, return success response confirming data was received

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
