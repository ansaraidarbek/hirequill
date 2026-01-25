"use client";

import { useState } from "react";
import Icon from "@/components/ui/AppIcon";
import { SignedOut, SignedIn } from "@/services/clerk/components/SignInStatus";

interface PricingTier {
    id: string;
    name: string;
    price: number;
    period: string;
    description: string;
    features: string[];
    cta: string;
    popular: boolean;
    limit: string;
    onClick: () => void;
}

type PricingSectionProps = {
    onLoginClick: () => void;
};

const PricingSection = ({ onLoginClick }: PricingSectionProps) => {
    const [billingCycle] = useState<"monthly" | "annual">("monthly");
    const [isLoading, setIsLoading] = useState(false);

    const handleSubscribe = () => {
        setIsLoading(true);
        window.location.href = "/api/checkout"; // navigation, not fetch => no CORS
    };

    const pricingTiers: PricingTier[] = [
        {
            id: "free",
            name: "Free Trial",
            price: 0,
            period: "forever",
            description: "Perfect for testing the waters",
            features: [
                "2 cover letters per month",
                "Advanced AI generation",
                "PDF download",
                "Email support",
            ],
            cta: "Login",
            popular: false,
            limit: "2 letters/month",
            onClick: onLoginClick,
        },
        {
            id: "monthly",
            name: "Monthly Plan",
            price: 19,
            period: "month",
            description: "For active job seekers",
            features: [
                "Unlimited cover letters",
                "Advanced AI generation",
                "Priority processing",
                "Multiple file formats",
                "Priority email support",
            ],
            cta: "Get Started Now",
            popular: true,
            limit: "Unlimited",
            onClick: handleSubscribe,
        },
    ];

    return (
        <section
            id="pricing"
            className="py-20 lg:py-32 bg-gradient-to-br from-background via-primary/5 to-background"
        >
            <div className="container mx-auto px-4 lg:px-8">
                <div className="text-center mb-16">
                    <div className="inline-flex items-center space-x-2 px-4 py-2 bg-primary/10 rounded-full border border-primary/20 mb-6">
                        <Icon
                            name="CheckCircleIcon"
                            size={16}
                            className="text-primary"
                            variant="solid"
                        />
                        <span className="text-sm font-medium text-primary font-body">
                            Most users finish their job search in one month
                        </span>
                    </div>

                    <h2 className="text-3xl lg:text-5xl font-bold text-foreground mb-4 font-headline">
                        Choose Your Plan
                    </h2>
                    <p className="text-lg text-muted-foreground max-w-2xl mx-auto font-body">
                        Login, upgrade when you need unlimited access. No hidden
                        fees, cancel anytime.
                    </p>
                </div>

                <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
                    {pricingTiers.map((tier) => (
                        <div
                            key={tier.id}
                            className={`relative bg-card rounded-2xl shadow-xl border-2 p-8 lg:p-10 transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 ${
                                tier.popular
                                    ? "border-primary"
                                    : "border-border"
                            }`}
                        >
                            {tier.popular && (
                                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                                    <div className="px-6 py-2 bg-gradient-to-r from-primary to-secondary rounded-full shadow-lg">
                                        <span className="text-sm font-semibold text-white font-cta">
                                            Most Popular
                                        </span>
                                    </div>
                                </div>
                            )}

                            <div className="text-center mb-8">
                                <h3 className="text-2xl font-bold text-foreground mb-2 font-headline">
                                    {tier.name}
                                </h3>
                                <p className="text-sm text-muted-foreground font-body">
                                    {tier.description}
                                </p>
                            </div>

                            <div className="text-center mb-8">
                                <div className="flex items-baseline justify-center space-x-2">
                                    <span className="text-5xl font-bold text-foreground font-headline">
                                        ${tier.price}
                                    </span>
                                    <span className="text-lg text-muted-foreground font-body">
                                        /{tier.period}
                                    </span>
                                </div>
                                <div className="mt-3 inline-flex items-center space-x-2 px-4 py-2 bg-muted rounded-full">
                                    <Icon
                                        name="DocumentTextIcon"
                                        size={16}
                                        className="text-muted-foreground"
                                    />
                                    <span className="text-sm font-medium text-muted-foreground font-body">
                                        {tier.limit}
                                    </span>
                                </div>
                            </div>

                            <ul className="space-y-4 mb-8">
                                {tier.features.map((feature, index) => (
                                    <li
                                        key={index}
                                        className="flex items-start space-x-3"
                                    >
                                        <Icon
                                            name="CheckCircleIcon"
                                            size={20}
                                            className="text-accent flex-shrink-0 mt-0.5"
                                            variant="solid"
                                        />
                                        <span className="text-sm text-foreground font-body">
                                            {feature}
                                        </span>
                                    </li>
                                ))}
                            </ul>

                            <CheckButton isLogin={tier.id === "free"}>
                                <button
                                    onClick={tier.onClick}
                                    className={`w-full px-6 py-4 rounded-lg font-semibold text-lg transition-all duration-200 font-cta ${
                                        tier.popular
                                            ? "bg-destructive text-destructive-foreground hover:shadow-xl hover:scale-105"
                                            : "bg-card text-foreground border-2 border-border hover:border-primary"
                                    }`}
                                >
                                    {tier.cta}
                                </button>
                                {tier.id === "free" && (
                                    <p className="text-xs text-center text-muted-foreground mt-4 font-body">
                                        No credit card required
                                    </p>
                                )}
                            </CheckButton>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

const CheckButton = ({
    isLogin,
    children,
}: {
    isLogin: boolean;
    children: React.ReactNode;
}) => {
    return isLogin ? <SignedOut>{children}</SignedOut> : children;
};

export default PricingSection;
