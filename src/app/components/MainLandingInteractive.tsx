"use client";

import HeroSection from "./HeroSection";
import HowItWorksSection from "./HowItWorksSection";
import PricingSection from "./PricingSection";
import SocialProofSection from "./SocialProofSection";
import FAQSection from "./FAQSection";
import CTASection from "./CTASection";
import { Limitations } from "@/db/types/limitationType";
import { useState } from "react";
import CoverLetterDrawer from "@/features/generate-cover-letter/components/__CoverLetterDrawer";
import { CoverLetterInformation } from "@/components/utils/prepareInformation";

interface MainLandingInteractiveProps {
    onLoginClick: () => void;
    limitations: Limitations;
    totalGenerations: number;
}

const MainLandingInteractive = ({
    onLoginClick,
    limitations,
    totalGenerations,
}: MainLandingInteractiveProps) => {
    const [information, setInformation] = useState<CoverLetterInformation>({
        isDrawerOpen: false,
        coverLetter: ``,
        companyName: ``,
    });
    return (
        <div className="min-h-screen bg-background">
            <HeroSection
                onLoginClick={onLoginClick}
                limitations={limitations}
                totalGenerations={totalGenerations}
                information={information}
                setInformation={setInformation}
            />
            <HowItWorksSection />
            <PricingSection />
            <SocialProofSection />
            <FAQSection />
            <CTASection />
            {/* Cover Letter Drawer */}
            {Boolean(information?.coverLetter) && information.isDrawerOpen && (
                <CoverLetterDrawer
                    companyName={information.companyName}
                    coverLetter={information.coverLetter}
                    onClose={() =>
                        setInformation((prev) => ({
                            ...prev,
                            isDrawerOpen: false,
                        }))
                    }
                />
            )}
        </div>
    );
};

export default MainLandingInteractive;
