import { getSubscriptionByUserId } from "@/db/subscriptions/subscriptions";
import CreateCv from "@/features/create-cv";
import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import z from "zod";
import { env } from "@/data/env/server";
import OpenAI from "openai";
import pdfParse from "pdf-parse";
import mammoth from "mammoth";

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
    cvFileData: z.object({
        base64: z.string().min(1, "CV file data is required"),
        fileName: z.string().min(1, "File name is required"),
        fileType: z.enum(allowedTypes, "File type is required"),
    }),
});

export type CoverLetterRequest = z.infer<typeof CoverLetterRequestSchema>;

/**
 * Extracts text content from CV file based on file type
 */
async function extractTextFromCv(
    base64Data: string,
    fileType: string,
): Promise<string> {
    // Clean base64 data - remove data URL prefix if present and whitespace
    let cleanBase64 = base64Data.trim();

    // Remove data URL prefix if present (e.g., "data:application/pdf;base64,...")
    if (cleanBase64.includes(",")) {
        cleanBase64 = cleanBase64.split(",")[1];
    }

    // Remove any whitespace that might interfere with base64 decoding
    cleanBase64 = cleanBase64.replace(/\s/g, "");

    // Validate base64 string is not empty
    if (!cleanBase64 || cleanBase64.length === 0) {
        throw new Error(
            "Base64 data is empty. Please ensure the file was uploaded correctly.",
        );
    }

    // Decode base64 to buffer
    let buffer: Buffer;
    try {
        buffer = Buffer.from(cleanBase64, "base64");
    } catch (error) {
        console.error("Base64 decoding failed:", {
            base64Length: cleanBase64.length,
            firstChars: cleanBase64.substring(0, 50),
            error: error instanceof Error ? error.message : String(error),
        });
        throw new Error(
            "Invalid base64 data. Please ensure the file data is correctly encoded.",
        );
    }

    // Validate buffer is not empty
    if (!buffer || buffer.length === 0) {
        throw new Error("File data is empty. Please upload a valid file.");
    }

    try {
        // Handle plain text files
        if (fileType === "text/plain") {
            return buffer.toString("utf-8");
        }

        // Handle PDF files
        if (fileType === "application/pdf") {
            // Validate PDF header (PDF files start with %PDF)
            const pdfHeader = buffer.slice(0, 4).toString("ascii");
            if (pdfHeader !== "%PDF") {
                throw new Error(
                    "Invalid PDF file. The file does not appear to be a valid PDF document. Please ensure the file is not corrupted and is a valid PDF.",
                );
            }

            try {
                const pdfData = await pdfParse(buffer);
                const text = pdfData.text.trim();
                if (!text || text.length === 0) {
                    throw new Error(
                        "PDF file appears to be empty or contains no extractable text. The PDF might be image-based or encrypted.",
                    );
                }
                return text;
            } catch (pdfError) {
                // Check if it's a known PDF parsing error
                if (pdfError instanceof Error) {
                    const errorMessage = pdfError.message.toLowerCase();
                    if (
                        errorMessage.includes("invalid pdf") ||
                        errorMessage.includes("pdf structure") ||
                        errorMessage.includes("invalidpdfexception")
                    ) {
                        // Log additional debug info
                        console.error("PDF parsing failed:", {
                            bufferLength: buffer.length,
                            pdfHeader: buffer.slice(0, 10).toString("ascii"),
                            error: pdfError.message,
                        });
                        throw new Error(
                            "Unable to parse PDF file. The PDF may be corrupted, encrypted, or in an unsupported format. Please try converting it to a different PDF version or use a DOCX file instead.",
                        );
                    }
                    if (
                        errorMessage.includes("encrypted") ||
                        errorMessage.includes("password")
                    ) {
                        throw new Error(
                            "PDF file is password-protected. Please remove the password protection and try again.",
                        );
                    }
                }
                throw pdfError;
            }
        }

        // Handle DOCX files
        if (
            fileType ===
            "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
        ) {
            // Validate DOCX header (DOCX files are ZIP archives starting with PK)
            const docxHeader = buffer.slice(0, 2).toString("hex");
            if (docxHeader !== "504b") {
                throw new Error(
                    "Invalid DOCX file. The file does not appear to be a valid DOCX document. Please ensure the file is not corrupted.",
                );
            }

            try {
                const result = await mammoth.extractRawText({ buffer });
                const text = result.value.trim();
                if (!text || text.length === 0) {
                    throw new Error(
                        "DOCX file appears to be empty or contains no extractable text",
                    );
                }
                return text;
            } catch (docxError) {
                if (docxError instanceof Error) {
                    throw new Error(
                        `Unable to parse DOCX file: ${docxError.message}. Please ensure the file is a valid DOCX document.`,
                    );
                }
                throw docxError;
            }
        }

        // Handle DOC files (older Word format)
        if (fileType === "application/msword") {
            // DOC files are binary and require special parsing
            // For now, throw an error suggesting conversion to DOCX or PDF
            throw new Error(
                "DOC format is not directly supported. Please convert your CV to PDF or DOCX format.",
            );
        }

        // Handle RTF files
        if (fileType === "application/rtf") {
            // RTF files can contain text but are complex to parse
            // Attempt basic extraction by looking for readable text between RTF commands
            const text = buffer.toString("utf-8");
            // Remove RTF control words and extract readable text
            const readableText = text
                .replace(/\\[a-z]+\d*\s?/gi, " ") // Remove RTF commands
                .replace(/[{}]/g, " ") // Remove braces
                .replace(/[\x00-\x1F\x7F-\x9F]/g, " ") // Remove control chars
                .replace(/\s+/g, " ") // Normalize whitespace
                .trim();

            if (readableText.length > 100) {
                return readableText;
            }
            throw new Error(
                "Unable to extract readable text from RTF file. Please convert to PDF or DOCX format.",
            );
        }

        // Unknown file type
        throw new Error(`Unsupported file type: ${fileType}`);
    } catch (error) {
        console.error("Error extracting text from CV:", error);
        if (error instanceof Error) {
            throw error;
        }
        throw new Error(
            `Failed to extract text from ${fileType}. Please ensure the file is valid and contains readable content.`,
        );
    }
}

/**
 * Researches company information including values, vision, and culture
 */
async function researchCompany(
    companyName: string,
    positionTitle: string,
): Promise<string> {
    const client = new OpenAI({
        apiKey: env.OPENAI_API_KEY,
    });

    try {
        const researchPrompt = `Research the company "${companyName}" and provide a comprehensive analysis focusing on:

1. Company Values & Mission: What are their core values, mission statement, and what they stand for?
2. Company Vision & Culture: What is their vision for the future? What is their workplace culture like?
3. Industry Position: What industry are they in and what is their market position?
4. Recent News & Initiatives: Any recent significant news, projects, or initiatives that reflect their priorities?
5. Position Context: How does the "${positionTitle}" role fit into their organization and what might they value in this position?

Provide a concise but comprehensive summary (200-300 words) that will help write a highly personalized cover letter. Focus on actionable insights about what the company values and how a candidate could align with their mission.`;

        const researchCompletion = await client.chat.completions.create({
            model: "gpt-4o",
            messages: [
                {
                    role: "system",
                    content:
                        "You are a business research analyst. Provide accurate, insightful information about companies based on your knowledge. If information is not available, state that clearly and focus on what can be inferred from the company name and industry.",
                },
                {
                    role: "user",
                    content: researchPrompt,
                },
            ],
            temperature: 0.3,
            max_tokens: 800,
        });

        const companyInfo =
            researchCompletion.choices[0]?.message?.content?.trim() ||
            "Company information not available.";

        return companyInfo;
    } catch (error) {
        console.error("Error researching company:", error);
        // Return a fallback message if research fails
        return `Company: ${companyName}. Position: ${positionTitle}.`;
    }
}

/**
 * Generates a cover letter using OpenAI API with company research
 */
async function generateCoverLetter(params: {
    cvText: string;
    companyName: string;
    positionTitle: string;
    jobDescription?: string;
}): Promise<string> {
    const { cvText, companyName, positionTitle, jobDescription } = params;

    const client = new OpenAI({
        apiKey: env.OPENAI_API_KEY,
    });

    try {
        // Step 1: Research the company
        const companyInfo = await researchCompany(companyName, positionTitle);

        // Step 2: Generate the cover letter with company insights
        const systemPrompt = `You are an elite cover letter writer and career strategist. Your cover letters are:
1. Extracting and prioritizing the most relevant evidence from the candidate’s CV
- Cohesive: each paragraph builds naturally on the previous
- Self-proofing: every claim is supported by concrete CV evidence
- Outstanding: they stand out through specificity and authenticity
- Perfect: grammatically flawless, professionally polished

Your writing process:
1. Analyze the company's values, vision, and culture from the research provided
2. Identify 3-4 key alignment points between the candidate's CV and what the company values
3. For each alignment point, select the STRONGEST, MOST SPECIFIC evidence from the CV
4. Structure paragraphs to: (a) acknowledge company values, (b) present matching evidence, (c) demonstrate impact
5. Ensure logical flow: each paragraph should connect to the next, creating a coherent narrative
6. Use concrete data: numbers, timeframes, scope, outcomes - never vague statements

Critical rules:
- NEVER invent or exaggerate experience or metrics
- NEVER summarize the entire CV - be selective and strategic
- NEVER repeat the job description verbatim
- ALWAYS connect CV evidence to company values explicitly
- ALWAYS use specific examples over generic descriptions
- ALWAYS maintain professional but warm, confident tone

Format: Plain text, 3-4 paragraphs, no headers/footers/markdown. End with a confident call to action.`;

        const userPrompt = `Write an outstanding cover letter for:

Company: ${companyName}
Position: ${positionTitle}

${jobDescription ? `Job Description:\n${jobDescription}\n` : ""}

Company Research & Insights:
${companyInfo}

Candidate's CV/Resume:
${cvText}

Instructions:
${jobDescription 
    ? `- Analyze the job description for required skills and implied values
- Cross-reference with company values from the research
- Identify where CV evidence aligns with BOTH job requirements AND company culture`
    : `- Since no job description is provided, focus PRIMARILY on company values, vision, and culture from the research
- Identify the most relevant CV experiences that align with what ${companyName} values
- Emphasize how the candidate's background fits their mission and culture
- Infer likely requirements for the "${positionTitle}" role based on industry standards and company context`}

- Create a logical narrative: opening (why this company/role), body (2-3 evidence-based paragraphs), closing (call to action)
- Each paragraph must be self-contained yet flow seamlessly to the next
- Every claim must be backed by specific CV evidence - make it self-proofing
- Use the company's language and values naturally throughout
- Demonstrate deep understanding of what ${companyName} stands for
- Show how the candidate's unique background contributes to their mission

Make this letter feel like it was written by someone who deeply understands ${companyName} and has carefully studied the candidate's background.`;

        const completion = await client.chat.completions.create({
            model: "gpt-4o",
            messages: [
                {
                    role: "system",
                    content: systemPrompt,
                },
                {
                    role: "user",
                    content: userPrompt,
                },
            ],
            temperature: 0.7,
            max_tokens: 2000,
        });

        const coverLetter = completion.choices[0]?.message?.content?.trim();

        if (!coverLetter) {
            throw new Error("Empty cover letter generated");
        }

        return coverLetter;
    } catch (error) {
        console.error("Error generating cover letter:", error);

        if (error instanceof OpenAI.APIError) {
            const requestId =
                "requestID" in error ? error.requestID : "unknown";
            throw new Error(
                `OpenAI API error: ${error.status} - ${error.message}. Request ID: ${requestId}`,
            );
        }

        throw error instanceof Error
            ? error
            : new Error("Failed to generate cover letter");
    }
}

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
            // Extract text from CV file
            const cvText = await extractTextFromCv(
                validatedData.cvFileData.base64,
                validatedData.cvFileData.fileType,
            );

            // Generate cover letter using AI
            const coverLetter = await generateCoverLetter({
                cvText,
                companyName: validatedData.companyName,
                positionTitle: validatedData.positionTitle,
                jobDescription: validatedData.jobDescription,
            });

            console.log("Generated Cover Letter:", coverLetter);
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
