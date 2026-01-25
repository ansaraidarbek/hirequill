"use client";

import { useState, useEffect, useCallback } from "react";
import Icon from "@/components/ui/AppIcon";
import { useAuth } from "@clerk/nextjs";
import { Limitations } from "@/db/types/limitationType";
import { useSignInModal } from "@/hooks/useSignIn";
import { CoverLetterInformation } from "@/components/utils/prepareInformation";
import { CVType } from "@/db/types/cvType";
const SESSION_STORAGE_KEY = "coverLetterFormData";

interface StoredFormData {
    companyName: string;
    positionTitle: string;
    jobDescription: string;
    cvFileData?: CVType;
    shouldGenerate: boolean;
}

// Helper function to convert File to base64
const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = (error) => reject(error);
    });
};

// Helper function to convert base64 to File
const base64ToFile = (
    base64: string,
    fileName: string,
    fileType: string,
): File => {
    const arr = base64.split(",");
    const mime = arr[0].match(/:(.*?);/)?.[1] || fileType;
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], fileName, { type: mime });
};
const InitialData: StoredFormData = {
    companyName: "",
    positionTitle: "",
    jobDescription: "",
    cvFileData: undefined,
    shouldGenerate: false,
};
// Get data from sessionStorage and delete it
const getFromSessionStorage = (): StoredFormData => {
    if (typeof window === "undefined") return structuredClone(InitialData);

    const stored = sessionStorage.getItem(SESSION_STORAGE_KEY);
    if (!stored) return structuredClone(InitialData);

    try {
        const data = JSON.parse(stored);
        return data;
    } catch {
        return structuredClone(InitialData);
    }
};

const isToGenerate = (data: StoredFormData): boolean => {
    return Boolean(
        data &&
        data.companyName &&
        data.positionTitle &&
        data.cvFileData &&
        data.shouldGenerate,
    );
};

const isDataProvided = (data: StoredFormData): boolean => {
    return Boolean(
        data && data.companyName && data.positionTitle && data.cvFileData,
    );
};

// Save data to sessionStorage
const saveToSessionStorage = (data: StoredFormData) => {
    if (typeof window === "undefined") return;
    sessionStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(data));
};

interface GenerateCoverLetterProps {
    onLoginClick: () => void;
    limitations: Limitations;
    information: CoverLetterInformation;
    setInformation: React.Dispatch<
        React.SetStateAction<CoverLetterInformation>
    >;
    cvInformation: CVType | null;
}

const GenerateCoverLetter = ({
    onLoginClick,
    limitations,
    information,
    setInformation,
    cvInformation,
}: GenerateCoverLetterProps) => {
    console.log("cvInformation in HeroSection:", cvInformation);
    const [data, setData] = useState<StoredFormData>({
        ...InitialData,
        cvFileData: cvInformation || undefined,
    });
    const [anotherData, setAnotherData] = useState<StoredFormData>({
        ...InitialData,
        cvFileData: cvInformation || undefined,
    });
    console.log("GenerateCoverLetter data state:", data);
    console.log("GenerateCoverLetter data state:", anotherData);
    const [isGenerating, setIsGenerating] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const { isSignedIn } = useAuth();
    const [localLimitations, setLocalLimitations] =
        useState<Limitations>(limitations);
    const { isOpen: isSignInOpen } = useSignInModal();

    const setCvFile = useCallback((file: File | null) => {
        //conveert file to base64 and store in data state
        if (file) {
            fileToBase64(file)
                .then((base64) => {
                    setData((prev) => ({
                        ...prev,
                        cvFileData: {
                            base64,
                            fileName: file.name,
                            fileType: file.type,
                        },
                    }));
                })
                .catch((err) => {
                    console.error("Error converting file to base64:", err);
                    setError("Failed to read file. Please try again.");
                });
        }
    }, []);

    // Extract generation logic to be reusable
    const performGeneration = useCallback(async (formData: StoredFormData) => {
        setIsGenerating(true);
        setError(null);

        try {
            // Prepare data without shouldGenerate flag
            const { shouldGenerate, ...dataToSend } = formData;

            const response = await fetch("/api/cover-letter", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(dataToSend),
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(
                    errorData.message ||
                        `Server error: ${response.status} ${response.statusText}`,
                );
            }

            const result = await response.json();
            const generatedCoverLetter = result?.data.coverLetter;
            const forCompany = result?.data.companyName;
            setLocalLimitations(
                result?.data.limitations?.exist
                    ? result.data.limitations
                    : { exist: false, amount: 0 },
            );
            // Open drawer when cover letter is generated
            if (generatedCoverLetter) {
                setInformation({
                    isDrawerOpen: true,
                    coverLetter: generatedCoverLetter,
                    companyName: forCompany,
                });
            }
        } catch (err) {
            const errorMessage =
                err instanceof Error
                    ? err.message
                    : "Failed to generate cover letter. Please try again.";
            setError(errorMessage);
            console.error("Error generating cover letter:", err);
        } finally {
            setIsGenerating(false);
            sessionStorage.removeItem(SESSION_STORAGE_KEY);
        }
    }, []);

    useEffect(() => {
        if (isSignInOpen) {
            return;
        }
        const stored = getFromSessionStorage(); // now runs only on client
        if (isToGenerate(stored) && isSignedIn) {
            // Only auto-generate if user is signed in
            setData(stored);
            performGeneration(stored);
        }
    }, [isSignedIn, performGeneration]);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            // Validate file size (5MB max)
            if (file.size > 5 * 1024 * 1024) {
                setError("File size must be less than 5MB");
                return;
            }
            // Validate file type
            const validTypes = [
                "application/pdf",
                "application/msword",
                "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
            ];
            if (!validTypes.includes(file.type)) {
                setError("Please upload a PDF, DOC, or DOCX file");
                return;
            }
            setCvFile(file);
            setError(null);
        }
    };

    const handleDownloadFile = () => {
        if (!data.cvFileData) return;

        const url = URL.createObjectURL(
            base64ToFile(
                data.cvFileData.base64,
                data.cvFileData.fileName,
                data.cvFileData.fileType,
            ),
        );
        const link = document.createElement("a");
        link.href = url;
        link.download = data.cvFileData.fileName;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    };

    const handleRemoveFile = () => {
        setData((prev) => ({
            ...prev,
            cvFileData: undefined,
        }));
        setError(null);
        // Reset the file input
        const fileInput = document.querySelector(
            'input[type="file"]',
        ) as HTMLInputElement;
        if (fileInput) {
            fileInput.value = "";
        }
    };

    const handleGenerate = async () => {
        // Check if user is authenticated
        if (!isSignedIn) {
            // Save current data to sessionStorage with shouldGenerate flag
            try {
                saveToSessionStorage({
                    ...data,
                    shouldGenerate: true,
                });
            } catch (err) {
                console.error("Error saving to sessionStorage:", err);
                setError("Failed to save data. Please try again.");
                return;
            }

            // Open login modal
            onLoginClick();
            return;
        }

        // User is authenticated, proceed with generation using current data
        await performGeneration(data);
    };

    return (
        <div className="bg-card rounded-2xl shadow-2xl border border-border p-8 space-y-6">
            <div className="flex items-center justify-between">
                <h3 className="text-xl font-semibold text-foreground font-headline">
                    Generate Your Cover Letter
                </h3>
                <Icon
                    name="DocumentTextIcon"
                    size={24}
                    className="text-primary"
                    variant="solid"
                />
            </div>
            {Boolean(localLimitations?.exist) && (
                <>
                    {localLimitations?.amount <= 0 ? (
                        <div className="px-4 py-3 bg-error/10 border border-error/20 rounded-lg">
                            <p className="text-sm text-error font-body">
                                You have reached your limit of{" "}
                                {localLimitations.amount} generations. Please
                                upgrade to a paid plan to continue generating
                                cover letters.
                            </p>
                        </div>
                    ) : localLimitations.amount === 1 ? (
                        <div className="px-4 py-3 bg-warning/10 border border-warning/20 rounded-lg">
                            <p className="text-sm text-warning font-body">
                                You have {localLimitations.amount} generations
                                left.
                            </p>
                        </div>
                    ) : null}
                </>
            )}

            <div className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-foreground mb-2 font-body">
                        Upload Your CV
                    </label>
                    {!data.cvFileData ? (
                        // Step 1: Upload file if none is uploaded
                        <label className="block border-2 border-dashed border-border rounded-lg p-8 text-center hover:border-primary transition-colors cursor-pointer bg-muted/30">
                            <input
                                type="file"
                                accept=".pdf,.doc,.docx"
                                onChange={handleFileChange}
                                className="hidden"
                            />
                            <Icon
                                name="CloudArrowUpIcon"
                                size={48}
                                className="mx-auto text-muted-foreground mb-3"
                            />
                            <p className="text-sm text-muted-foreground font-body">
                                Drag & drop your CV here or{" "}
                                <span className="text-primary font-semibold">
                                    browse
                                </span>
                            </p>
                            <p className="text-xs text-muted-foreground mt-2 font-body">
                                PDF, DOC, DOCX (Max 5MB)
                            </p>
                        </label>
                    ) : (
                        // Step 2: Show file name with download and close icons
                        <div className="border-2 border-border rounded-lg p-4 bg-muted/30 flex items-center justify-between">
                            <div className="flex items-center space-x-3 flex-1 min-w-0">
                                <Icon
                                    name="DocumentTextIcon"
                                    size={24}
                                    className="text-primary flex-shrink-0"
                                    variant="solid"
                                />
                                <span className="text-sm text-foreground font-semibold font-body truncate">
                                    {data.cvFileData.fileName}
                                </span>
                            </div>
                            <div className="flex items-center space-x-2 flex-shrink-0">
                                <button
                                    onClick={handleDownloadFile}
                                    className="p-2 hover:bg-primary/10 rounded-lg transition-colors"
                                    title="Download file"
                                >
                                    <Icon
                                        name="ArrowDownTrayIcon"
                                        size={20}
                                        className="text-primary"
                                        variant="solid"
                                    />
                                </button>
                                <button
                                    onClick={handleRemoveFile}
                                    className="p-2 hover:bg-destructive/10 rounded-lg transition-colors"
                                    title="Remove file"
                                >
                                    <Icon
                                        name="XMarkIcon"
                                        size={20}
                                        className="text-destructive"
                                        variant="solid"
                                    />
                                </button>
                            </div>
                        </div>
                    )}
                </div>

                <div>
                    <label className="block text-sm font-medium text-foreground mb-2 font-body">
                        Company Name
                    </label>
                    <input
                        type="text"
                        placeholder="Company Name"
                        value={data.companyName}
                        onChange={(e) =>
                            setData((prev) => ({
                                ...prev,
                                companyName: e.target.value,
                            }))
                        }
                        className="w-full px-4 py-3 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-ring bg-background text-foreground font-body"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-foreground mb-2 font-body">
                        Position Title
                    </label>
                    <input
                        type="text"
                        placeholder="Position Title"
                        value={data.positionTitle}
                        onChange={(e) =>
                            setData((prev) => ({
                                ...prev,
                                positionTitle: e.target.value,
                            }))
                        }
                        className="w-full px-4 py-3 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-ring bg-background text-foreground font-body"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-foreground mb-2 font-body">
                        Job Description{" "}
                        <span className="text-muted-foreground font-normal">
                            (Optional)
                        </span>
                    </label>
                    <textarea
                        placeholder="Paste the job description here..."
                        value={data.jobDescription}
                        onChange={(e) =>
                            setData((prev) => ({
                                ...prev,
                                jobDescription: e.target.value,
                            }))
                        }
                        rows={3}
                        className="w-full px-4 py-3 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-ring bg-background text-foreground font-body resize-y"
                    />
                </div>

                {error && (
                    <div className="px-4 py-3 bg-error/10 border border-error/20 rounded-lg">
                        <p className="text-sm text-error font-body">{error}</p>
                    </div>
                )}

                <button
                    onClick={handleGenerate}
                    disabled={
                        (localLimitations.exist &&
                            localLimitations.amount <= 0) ||
                        !isDataProvided(data) ||
                        isGenerating
                    }
                    className="w-full px-6 py-4 bg-primary text-primary-foreground rounded-lg font-semibold hover:shadow-lg hover:scale-105 transition-all duration-200 font-cta flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                >
                    {isGenerating ? (
                        <>
                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            <span>Generating...</span>
                        </>
                    ) : (
                        <>
                            <Icon
                                name="SparklesIcon"
                                size={20}
                                variant="solid"
                            />
                            <span>Generate Cover Letter</span>
                        </>
                    )}
                </button>

                {information.coverLetter && (
                    <button
                        type="button"
                        onClick={() =>
                            setInformation((prev) => ({
                                ...prev,
                                isDrawerOpen: true,
                            }))
                        }
                        className="w-full px-6 py-3 border-2 border-primary text-primary rounded-lg font-semibold hover:bg-primary/10 transition-all duration-200 font-cta flex items-center justify-center space-x-2"
                    >
                        <Icon
                            name="DocumentTextIcon"
                            size={20}
                            variant="solid"
                        />
                        <span>View cover letter</span>
                    </button>
                )}
            </div>

            <div className="flex items-center justify-center space-x-2 pt-2">
                <Icon
                    name="LockClosedIcon"
                    size={16}
                    className="text-muted-foreground"
                />
                <span className="text-xs text-muted-foreground font-body">
                    Your data is encrypted and secure
                </span>
            </div>
        </div>
    );
};

export default GenerateCoverLetter;
