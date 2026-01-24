"use client";

import { useState, useEffect, useRef } from "react";
import { jsPDF } from "jspdf";
import Icon from "@/components/ui/AppIcon";

interface CoverLetterDrawerProps {
    companyName: string;
    coverLetter: string;
    onClose: () => void;
}

const CoverLetterDrawer = ({
    coverLetter,
    companyName,
    onClose,
}: CoverLetterDrawerProps) => {
    const [editedText, setEditedText] = useState(coverLetter);
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    // Update edited text when coverLetter prop changes
    useEffect(() => {
        setEditedText(coverLetter);
    }, [coverLetter]);

    // Handle escape key to close drawer
    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === "Escape") {
                onClose();
            }
        };

        window.addEventListener("keydown", handleEscape);
        // Prevent body scroll when drawer is open
        document.body.style.overflow = "hidden";

        return () => {
            window.removeEventListener("keydown", handleEscape);
            document.body.style.overflow = "auto";
        };
    }, [onClose]);

    // Focus textarea when drawer opens
    useEffect(() => {
        if (textareaRef.current) {
            // Small delay to ensure drawer animation completes
            setTimeout(() => {
                textareaRef.current?.focus();
            }, 300);
        }
    }, [coverLetter]);

    const handleDownloadPDF = () => {
        const trimmed = editedText.trim();
        if (!trimmed) return;

        const doc = new jsPDF({
            orientation: "portrait",
            unit: "mm",
            format: "letter",
        });

        const pageW = doc.internal.pageSize.getWidth();
        const pageH = doc.internal.pageSize.getHeight();
        const margin = 12.7; // 0.5in
        const topOffset = 5;
        const maxWidth = pageW - 2 * margin;
        const contentHeight = pageH - margin - topOffset;
        const lineHeightFactor = 1.6;

        let fontSize = 12;
        const minFontSize = 8;
        let lines: string[] = [];

        doc.setFont("times", "normal");

        while (fontSize >= minFontSize) {
            doc.setFontSize(fontSize);
            const lineHeightMm = (fontSize / 72) * 25.4 * lineHeightFactor;
            const paragraphs = trimmed.split(/\n/);
            lines = paragraphs.flatMap((p) =>
                p ? (doc.splitTextToSize(p, maxWidth) as string[]) : [""],
            );
            const totalHeight = lines.length * lineHeightMm;
            if (totalHeight <= contentHeight) break;
            fontSize -= 1;
        }

        doc.setFontSize(fontSize);
        const lineHeightMm = (fontSize / 72) * 25.4 * lineHeightFactor;
        const bottomY = pageH - margin;
        let y = topOffset;

        for (const line of lines) {
            if (y > bottomY) break;
            doc.text(line, margin, y);
            y += lineHeightMm;
        }

        doc.save(companyName ?? "cover-letter.pdf");
    };

    return (
        <>
            {/* Backdrop */}
            <div
                className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[9998] transition-opacity"
                onClick={onClose}
                aria-hidden="true"
            />

            {/* Drawer */}
            <div
                className={`fixed top-0 right-0 h-full w-full max-w-2xl bg-card shadow-2xl z-[9999] transform transition-transform duration-300 ease-in-out flex flex-col translate-x-0`}
            >
                {/* Header */}
                <div className="sticky top-0 bg-card border-b border-border px-6 py-4 flex items-center justify-between z-10">
                    <h2 className="text-xl font-semibold text-foreground font-headline">
                        Your Cover Letter
                    </h2>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-muted rounded-lg transition-colors"
                        aria-label="Close drawer"
                    >
                        <Icon
                            name="XMarkIcon"
                            size={24}
                            className="text-foreground"
                            variant="solid"
                        />
                    </button>
                </div>

                {/* Content */}
                <div className="h-[calc(100vh-160px)] overflow-y-hidden p-6">
                    <textarea
                        ref={textareaRef}
                        value={editedText}
                        onChange={(e) => setEditedText(e.target.value)}
                        className="w-full h-full min-h-[400px] px-4 py-3 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-ring bg-background text-foreground font-body resize-none text-sm leading-relaxed whitespace-pre-wrap"
                        placeholder="Your cover letter will appear here..."
                        style={{ fontFamily: "'Times New Roman', serif" }}
                    />
                </div>

                {/* Footer with Download Button */}
                <div className="sticky bottom-0 bg-card border-t border-border px-6 py-4 flex items-center justify-end space-x-3">
                    <button
                        onClick={handleDownloadPDF}
                        className="px-6 py-3 bg-primary text-primary-foreground rounded-lg font-semibold hover:shadow-lg hover:scale-105 transition-all duration-200 font-cta flex items-center space-x-2"
                    >
                        <Icon
                            name="ArrowDownTrayIcon"
                            size={20}
                            variant="solid"
                        />
                        <span>Download PDF</span>
                    </button>
                </div>
            </div>
        </>
    );
};

export default CoverLetterDrawer;
