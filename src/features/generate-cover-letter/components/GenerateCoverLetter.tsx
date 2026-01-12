"use client";

import { useState } from "react";
import Icon from "@/components/ui/AppIcon";

const GenerateCoverLetter = () => {
    const [companyName, setCompanyName] = useState("");
    const [positionTitle, setPositionTitle] = useState("");
    const [jobDescription, setJobDescription] = useState("");
    const [cvFile, setCvFile] = useState<File | null>(null);
    const [isGenerating, setIsGenerating] = useState(false);
    const [error, setError] = useState<string | null>(null);

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
        if (!cvFile) return;
        
        const url = URL.createObjectURL(cvFile);
        const link = document.createElement("a");
        link.href = url;
        link.download = cvFile.name;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    };

    const handleRemoveFile = () => {
        setCvFile(null);
        setError(null);
        // Reset the file input
        const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
        if (fileInput) {
            fileInput.value = "";
        }
    };

    const handleGenerate = async () => {
        if (!companyName || !positionTitle || !cvFile) {
            setError("Please fill in all fields");
            return;
        }

        setIsGenerating(true);
        setError(null);

        try {
            // TODO: Implement actual API call to generate cover letter
            // For now, simulate API call
            await new Promise((resolve) => setTimeout(resolve, 2000));

            console.log("Generating cover letter with:", {
                companyName,
                positionTitle,
                jobDescription,
                cvFile: cvFile.name,
            });

            // TODO: Handle the generated cover letter (redirect, show modal, etc.)
            // For now, just log success
            console.log("Cover letter generated successfully!");
        } catch (err) {
            setError("Failed to generate cover letter. Please try again.");
            console.error("Error generating cover letter:", err);
        } finally {
            setIsGenerating(false);
        }
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

            <div className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-foreground mb-2 font-body">
                        Upload Your CV
                    </label>
                    {!cvFile ? (
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
                                    {cvFile.name}
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
                        value={companyName}
                        onChange={(e) => setCompanyName(e.target.value)}
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
                        value={positionTitle}
                        onChange={(e) => setPositionTitle(e.target.value)}
                        className="w-full px-4 py-3 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-ring bg-background text-foreground font-body"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-foreground mb-2 font-body">
                        Job Description <span className="text-muted-foreground font-normal">(Optional)</span>
                    </label>
                    <textarea
                        placeholder="Paste the job description here..."
                        value={jobDescription}
                        onChange={(e) => setJobDescription(e.target.value)}
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
                    disabled={!companyName || !positionTitle || !cvFile || isGenerating}
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
