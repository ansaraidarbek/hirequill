"use client";

import { useState, useEffect } from "react";
import Icon from "@/components/ui/AppIcon";

interface HeroSectionProps {
    onGenerateClick: () => void;
}

const HeroSection = ({ onGenerateClick }: HeroSectionProps) => {
    const [isHydrated, setIsHydrated] = useState(false);
    const [generationCount, setGenerationCount] = useState(0);

    useEffect(() => {
        setIsHydrated(true);
        const baseCount = 147832;
        setGenerationCount(baseCount);

        const interval = setInterval(() => {
            setGenerationCount((prev) => prev + Math.floor(Math.random() * 3));
        }, 5000);

        return () => clearInterval(interval);
    }, []);

    return (
        <section
            className="relative bg-gradient-to-br from-primary/5 via-background to-secondary/5 overflow-hidden"
            id="main-landing-page"
        >
            <div className="absolute inset-0 opacity-10">
                <div className="absolute top-20 left-10 w-72 h-72 bg-primary rounded-full blur-3xl"></div>
                <div className="absolute bottom-20 right-10 w-96 h-96 bg-secondary rounded-full blur-3xl"></div>
            </div>

            <div className="container mx-auto px-4 lg:px-8 py-16 lg:py-24 relative z-10">
                <div className="grid lg:grid-cols-2 gap-12 items-center">
                    <div className="space-y-8">
                        <div className="inline-flex items-center space-x-2 px-4 py-2 bg-accent/10 rounded-full border border-accent/20">
                            <Icon
                                name="SparklesIcon"
                                size={16}
                                className="text-accent"
                                variant="solid"
                            />
                            <span className="text-sm font-medium text-accent font-body">
                                AI-Powered Cover Letters
                            </span>
                        </div>

                        <h1 className="text-4xl lg:text-6xl font-bold text-foreground leading-tight font-headline">
                            No more writing <br />
                            Let{" "}
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">
                                AI
                            </span>{" "}
                            Do It for You
                        </h1>

                        <p className="text-lg lg:text-xl text-muted-foreground font-body max-w-xl">
                            Generate personalized, professional cover letters in
                            10 seconds. Apply faster, smarter, without burning
                            out.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4">
                            <button
                                onClick={onGenerateClick}
                                className="px-8 py-4 bg-destructive text-destructive-foreground rounded-lg font-semibold text-lg hover:shadow-xl hover:scale-105 transition-all duration-200 font-cta flex items-center justify-center space-x-2"
                            >
                                <span>Login</span>
                                <Icon
                                    name="ArrowRightIcon"
                                    size={20}
                                    variant="solid"
                                />
                            </button>
                            <button
                                className="px-8 py-4 bg-card text-foreground border-2 border-border rounded-lg font-semibold text-lg hover:border-primary transition-all duration-200 font-cta"
                                onClick={() =>
                                    document
                                        .getElementById("how-it-works")
                                        ?.scrollIntoView({ behavior: "smooth" })
                                }
                            >
                                See How It Works
                            </button>
                        </div>

                        {isHydrated && (
                            <div className="flex items-center space-x-6 pt-4">
                                <div className="flex items-center space-x-2">
                                    <div className="w-2 h-2 bg-accent rounded-full animate-pulse"></div>
                                    <span className="text-sm text-muted-foreground font-body">
                                        <span className="font-semibold text-foreground">
                                            {generationCount.toLocaleString()}
                                        </span>{" "}
                                        letters generated
                                    </span>
                                </div>
                                <div className="h-4 w-px bg-border"></div>
                                <div className="flex items-center space-x-2">
                                    <Icon
                                        name="ClockIcon"
                                        size={16}
                                        className="text-muted-foreground"
                                    />
                                    <span className="text-sm text-muted-foreground font-body">
                                        <span className="font-semibold text-foreground">
                                            &lt;10s
                                        </span>{" "}
                                        average time
                                    </span>
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="lg:pl-8">
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
                                    <div className="border-2 border-dashed border-border rounded-lg p-8 text-center hover:border-primary transition-colors cursor-pointer bg-muted/30">
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
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-foreground mb-2 font-body">
                                        Company Name
                                    </label>
                                    <input
                                        type="text"
                                        placeholder="Company Name"
                                        className="w-full px-4 py-3 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-ring bg-background text-foreground font-body"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-foreground mb-2 font-body">
                                        Job Description
                                    </label>
                                    <input
                                        type="text"
                                        placeholder="Job Description"
                                        className="w-full px-4 py-3 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-ring bg-background text-foreground font-body"
                                    />
                                </div>

                                <button
                                    onClick={onGenerateClick}
                                    className="w-full px-6 py-4 bg-primary text-primary-foreground rounded-lg font-semibold hover:shadow-lg hover:scale-105 transition-all duration-200 font-cta flex items-center justify-center space-x-2"
                                >
                                    <Icon
                                        name="SparklesIcon"
                                        size={20}
                                        variant="solid"
                                    />
                                    <span>Generate Cover Letter</span>
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
                    </div>
                </div>
            </div>
        </section>
    );
};

export default HeroSection;
