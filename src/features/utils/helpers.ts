import z from "zod";

export const allowedTypes = [
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
export const CoverLetterRequestSchema = z.object({
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