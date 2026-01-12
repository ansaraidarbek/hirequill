"use client";

import HeroSection from "./HeroSection";
import HowItWorksSection from "./HowItWorksSection";
import PricingSection from "./PricingSection";
import SocialProofSection from "./SocialProofSection";
import FAQSection from "./FAQSection";
import CTASection from "./CTASection";

interface MainLandingInteractiveProps {
    onLoginClick: () => void;
}

const MainLandingInteractive = ({ onLoginClick }: MainLandingInteractiveProps) => {
    return (
        <div className="min-h-screen bg-background">
            <HeroSection onLoginClick={onLoginClick} />
            <HowItWorksSection />
            <PricingSection />
            <SocialProofSection />
            <FAQSection />
            <CTASection />
        </div>
    );
};

export default MainLandingInteractive;
