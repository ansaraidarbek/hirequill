"use client";

import Icon from "@/components/ui/AppIcon";
import { SignedOut } from "@clerk/nextjs";
import GenerateCoverLetter from "@/features/generate-cover-letter";
import { Limitations } from "@/db/types/limitationType";
import { CoverLetterInformation } from "@/components/utils/prepareInformation";
import { CVType } from "@/db/types/cvType";

interface HeroSectionProps {
    onLoginClick: () => void;
    limitations: Limitations;
    totalGenerations: number;
    information: CoverLetterInformation;
    setInformation: React.Dispatch<
        React.SetStateAction<CoverLetterInformation>
    >;
    cvInformation: CVType | null;
}

const HeroSection = ({
    onLoginClick,
    limitations,
    totalGenerations,
    information,
    setInformation,
    cvInformation,
}: HeroSectionProps) => {
    const finalGenerations = Number(totalGenerations) + 147832;
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
                            <SignedOut>
                                <button
                                    onClick={onLoginClick}
                                    className="px-8 py-4 bg-destructive text-destructive-foreground rounded-lg font-semibold text-lg hover:shadow-xl hover:scale-105 transition-all duration-200 font-cta flex items-center justify-center space-x-2"
                                >
                                    <span>Login</span>
                                    <Icon
                                        name="ArrowRightIcon"
                                        size={20}
                                        variant="solid"
                                    />
                                </button>
                            </SignedOut>
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

                        <div className="flex items-center space-x-6 pt-4">
                            <div className="flex items-center space-x-2">
                                <div className="w-2 h-2 bg-accent rounded-full animate-pulse"></div>
                                <span className="text-sm text-muted-foreground font-body">
                                    <span className="font-semibold text-foreground">
                                        {finalGenerations.toLocaleString()}
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
                    </div>

                    <div className="lg:pl-8">
                        <GenerateCoverLetter
                            onLoginClick={onLoginClick}
                            limitations={limitations}
                            information={information}
                            setInformation={setInformation}
                            cvInformation={cvInformation}
                        />
                    </div>
                </div>
            </div>
        </section>
    );
};

export default HeroSection;
