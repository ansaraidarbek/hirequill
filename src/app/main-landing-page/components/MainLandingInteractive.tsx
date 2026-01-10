"use client";

import { useState, useEffect } from "react";
import HeroSection from "./HeroSection";
import HowItWorksSection from "./HowItWorksSection";
import PricingSection from "./PricingSection";
import SocialProofSection from "./SocialProofSection";
import FAQSection from "./FAQSection";
import CTASection from "./CTASection";

const MainLandingInteractive = () => {
    const [isHydrated, setIsHydrated] = useState(false);

    useEffect(() => {
        setIsHydrated(true);
    }, []);

    const handleGenerateClick = () => {
        if (!isHydrated) return;
        console.log("Generate cover letter clicked");
    };

    const scrollToSection = (sectionId: string) => {
        if (!isHydrated) return;
        const element = document.getElementById(sectionId);
        if (element) {
            element.scrollIntoView({ behavior: "smooth", block: "start" });
        }
    };

    if (!isHydrated) {
        return (
            <div className="min-h-screen bg-background">
                <div className="container mx-auto px-4 py-20 text-center">
                    <div className="animate-pulse space-y-4">
                        <div className="h-12 bg-muted rounded w-3/4 mx-auto"></div>
                        <div className="h-6 bg-muted rounded w-1/2 mx-auto"></div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background">
            <HeroSection onGenerateClick={handleGenerateClick} />
            <HowItWorksSection />
            <PricingSection />
            <SocialProofSection />
            <FAQSection />
            <CTASection />
        </div>
    );
};

export default MainLandingInteractive;
