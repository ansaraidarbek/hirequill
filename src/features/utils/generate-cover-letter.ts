import { OpenAI } from "openai";
import { getOpenAIClient } from "@/lib/openai-client";
import pdfParse from "pdf-parse";
import mammoth from "mammoth";
import { CoverLetterRequest } from "./helpers";

export const generateCoverLetterFromData = async (data: CoverLetterRequest) => {
    const cvText = await extractTextFromCv(
        data.cvFileData.base64,
        data.cvFileData.fileType,
    );
    // Generate cover letter using AI
    const coverLetter = await generateCoverLetter({
        cvText,
        companyName: data.companyName,
        positionTitle: data.positionTitle,
        jobDescription: data.jobDescription,
    });

    return coverLetter;
};

const RESEARCH_MODEL = "gpt-5.2";
const COVER_LETTER_MODEL = "gpt-5.2";

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
    const client = getOpenAIClient();

    try {
        const researchPrompt = `Research the company "${companyName}" and provide a comprehensive analysis focusing on:

1. Company Values & Mission: What are their core values, mission statement, and what they stand for?
2. Company Vision & Culture: What is their vision for the future? What is their workplace culture like?
3. Industry Position: What industry are they in and what is their market position?
4. Recent News & Initiatives: Any recent significant news, projects, or initiatives that reflect their priorities?
5. Compare the company's vision positions against their real world results, and keep the most reliable analysis.
6. Position Context: How does the "${positionTitle}" role fit into their organization and what might they value in this position?

Provide a concise but comprehensive summary (200-300 words) that will help write a highly personalized cover letter. Focus on actionable insights about what the company values and how a candidate could align with their mission.`;
        const researchCompletion = await client.chat.completions.create({
            model: RESEARCH_MODEL,
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
            // max_tokens: 800,
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

    const client = getOpenAIClient();

    try {
        // Step 1: Research the company
        const companyInfo = await researchCompany(companyName, positionTitle);

        // Step 2: Generate the cover letter with company insights
        const systemPrompt = `
    You are ghostwriting a cover letter that must read as if the candidate typed it themselves in one focused sitting.

    VOICE AND TONE:
    - First person only. This is "I" writing about "my" work.
    - Write like a smart person talking to a peer, not like a document.
    - Confident but not boastful. Matter-of-fact about accomplishments.
    - Vary your sentence rhythm. Mix short punchy sentences with longer explanatory ones.
    - Sound like someone who actually does this work, not someone describing it from outside.

    STRICTLY FORBIDDEN (these scream "AI wrote this"):
    - Em-dashes (—) or en-dashes (–). Use commas, periods, or rewrite the sentence instead.
    - Semicolons in casual contexts. One per letter maximum, if any.
    - Parenthetical asides like "(e.g., X, Y, and Z)" more than once.
    - Stacking three or more items with "and" repeatedly.
    - Phrases: "at the intersection of," "first-class," "non-trivial," "leverage," "drive impact," "passionate about," "excited to," "thrilled," "I believe that," "in a way that," "this directly supports," "this implies," "this means."
    - Starting multiple sentences the same way.
    - Colon-heavy constructions like "X: Y, Z, and W."
    - Gerund chains like "defining, building, and shipping."
    - Overly parallel structure across paragraphs.
    - Any phrase that sounds like a mission statement or marketing copy.

    WHAT HUMAN COVER LETTERS ACTUALLY DO:
    - Get to the point. The first sentence says why you're writing.
    - Talk about work concretely. Name the project, what you built, what happened.
    - Let accomplishments speak. Don't oversell with adjectives.
    - Use simple transitions: "I also," "Another area," "Before that," "On the industry side."
    - End sentences with the important part, not with qualifiers.
    - Sometimes just state a fact without explaining its implications.
    - Use contractions naturally: "I'm," "don't," "didn't," "won't."

    STRUCTURE:
    - Opening: One to two sentences. Why this role, why this company. Be specific, not flattering.
    - Body (two paragraphs): Each covers a domain of work you owned. Concrete details from the CV. Connect to what the company needs, but don't belabor the connection.
    - Closing: Brief. You want to talk. Say so and stop.
    - Sign with the candidate's name.

    CONTENT RULES:
    - Group CV items into two or three areas of ownership, not a list of papers or features.
    - Use metrics and specifics from the CV only. Never invent.
    - If you mention a publication or project, say what it was about in plain language.
    - The reader should finish thinking "this person has done the work" not "this person knows the right words."

    LENGTH:
    - 300 to 400 words. Shorter is better if you've made the point.
    - If a sentence doesn't add information, cut it.

    FORMAT:
    - Plain text. No markdown, no bullet points, no headers.
    - Start with "Dear Hiring Manager," or "Dear Hiring Team,"
    - End with "Sincerely," then a blank line, then the candidate's name.

    BEFORE SUBMITTING, CHECK:
    1. Read it aloud. Does it sound like a person or a template?
    2. Are there any em-dashes? Remove them.
    3. Is any sentence doing two jobs? Split it or pick one.
    4. Could a skeptical reader tell what you actually did? If not, be more concrete.
    5. Delete any sentence that's just "connecting" ideas without adding facts.
    `;

        const userPrompt = `
Write a first-person cover letter for:

Company: ${companyName}
Position: ${positionTitle}

${
    jobDescription
        ? `Job Description:
${jobDescription}
`
        : ""
}

Company Context:
${companyInfo}

Candidate CV:
${cvText}

Selection rules:
- Identify 2–3 PRODUCT DOMAINS I owned
- Each domain must cover multiple related features
- Emphasize breadth, execution density, and autonomy
- Use features ONLY as supporting evidence

Depth requirements (for each domain):
- What part of the product this domain represents
- Why this work is non-trivial in real SaaS/startup conditions
- What technical and ownership maturity it implies
- Measurable impact (from CV only)
- Why this matters for ${companyName}

Constraints:
- First person only
- No feature-centric framing
- No generic praise
- Every paragraph must reveal something non-obvious about my impact

Structure:
1) Opening: why this role/company
2) Body: domain → implication → metrics → company value
3) Closing: confident call to action

Start with "Dear Hiring Manager," or "Dear Hiring Team,".
`;
        const completion = await client.chat.completions.create({
            model: COVER_LETTER_MODEL,
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
            // max_tokens: 2000,
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
