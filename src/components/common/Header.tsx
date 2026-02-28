"use client";

import { useState } from "react";
import Link from "next/link";
import Icon from "@/components/ui/AppIcon";
import AuthButton from "./AuthButton";

interface HeaderProps {
    className?: string;
    onLoginClick: () => void;
    currentPlan?: "monthly" | "forever" | "free" | null;
}

const Header = ({
    className = "",
    onLoginClick,
    currentPlan = null,
}: HeaderProps) => {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isPortalLoading, setIsPortalLoading] = useState(false);

    const navigationItems = [
        {
            label: "Generate",
            href: "#main-landing-page",
            scrollTo: "main-landing-page",
        },
        {
            label: "How It Works",
            href: "#how-it-works",
            scrollTo: "how-it-works",
        },
        { label: "Pricing", href: "#pricing", scrollTo: "pricing" },
        {
            label: "Testimonials",
            href: "#testimonials",
            scrollTo: "testimonials",
        },
        { label: "FAQ", href: "#faq", scrollTo: "faq" },
    ];

    const toggleMobileMenu = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen);
    };

    const handleManageSubscription = async () => {
        setIsPortalLoading(true);
        try {
            // Server identifies the user, looks up providerSubscriptionId,
            // fetches Lemon Squeezy subscription, and returns the portal URL.
            const response = await fetch("/api/customer-portal");

            const { portalUrl, message } = (await response.json()) as {
                portalUrl?: string;
                message?: string;
            };

            if (!response.ok || !portalUrl) {
                throw new Error(message || "Unable to load customer portal");
            }

            window.location.assign(portalUrl);
        } catch (error) {
            console.error("Failed to open customer portal", error);
            alert(
                "We couldn't open the subscription portal. Please try again in a moment.",
            );
        } finally {
            setIsPortalLoading(false);
        }
    };

    return (
        <header
            className={`w-full bg-card shadow-md sticky top-0 z-50 ${className}`}
        >
            <div className="container mx-auto px-4 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    <Link
                        onClick={(e) => {
                            e.preventDefault();
                            document
                                .getElementById(navigationItems[0].scrollTo)
                                ?.scrollIntoView({
                                    behavior: "smooth",
                                });
                        }}
                        href="#"
                        className="flex items-center space-x-2 hover:opacity-80 transition-opacity"
                    >
                        <svg
                            width="40"
                            height="40"
                            viewBox="0 0 40 40"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                            className="flex-shrink-0"
                        >
                            <rect
                                width="40"
                                height="40"
                                rx="8"
                                fill="url(#gradient)"
                            />
                            <path
                                d="M12 20C12 15.5817 15.5817 12 20 12C24.4183 12 28 15.5817 28 20C28 24.4183 24.4183 28 20 28"
                                stroke="white"
                                strokeWidth="2.5"
                                strokeLinecap="round"
                            />
                            <path
                                d="M16 20L18.5 22.5L24 17"
                                stroke="white"
                                strokeWidth="2.5"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                            <defs>
                                <linearGradient
                                    id="gradient"
                                    x1="0"
                                    y1="0"
                                    x2="40"
                                    y2="40"
                                    gradientUnits="userSpaceOnUse"
                                >
                                    <stop stopColor="#2563EB" />
                                    <stop offset="1" stopColor="#7C3AED" />
                                </linearGradient>
                            </defs>
                        </svg>
                        <span className="text-xl font-bold font-headline text-foreground">
                            HireQuill
                        </span>
                    </Link>

                    <nav className="hidden md:flex items-center space-x-8">
                        {navigationItems.map((item) => (
                            <Link
                                key={item.href}
                                href={"#"}
                                className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors font-body"
                                onClick={(e) => {
                                    e.preventDefault();
                                    document
                                        .getElementById(item.scrollTo)
                                        ?.scrollIntoView({
                                            behavior: "smooth",
                                        });
                                }}
                            >
                                {item.label}
                            </Link>
                        ))}
                    </nav>

                    <div className="hidden md:flex items-center space-x-4">
                        {currentPlan === "monthly" && (
                            <button
                                type="button"
                                onClick={handleManageSubscription}
                                disabled={isPortalLoading}
                                className="px-6 py-2.5 text-sm font-semibold text-primary border border-primary rounded-md hover:bg-primary/10 transition-all duration-200 font-cta disabled:opacity-60 disabled:cursor-not-allowed"
                            >
                                {isPortalLoading
                                    ? "Opening Portal..."
                                    : "Manage Subscription"}
                            </button>
                        )}
                        <AuthButton onLoginClick={onLoginClick} />
                    </div>

                    <button
                        onClick={toggleMobileMenu}
                        className="md:hidden p-2 rounded-md hover:bg-muted transition-colors"
                        aria-label="Toggle mobile menu"
                    >
                        <Icon
                            name={isMobileMenuOpen ? "XMarkIcon" : "Bars3Icon"}
                            size={24}
                            className="text-foreground"
                        />
                    </button>
                </div>
            </div>

            {isMobileMenuOpen && (
                <div className="md:hidden bg-card border-t border-border animate-slide-in-right">
                    <nav className="container mx-auto px-4 py-4 space-y-3">
                        {navigationItems.map((item) => (
                            <Link
                                key={item.href}
                                href={item.href}
                                onClick={() => setIsMobileMenuOpen(false)}
                                className="block py-2 text-sm font-medium text-muted-foreground hover:text-primary transition-colors font-body"
                            >
                                {item.label}
                            </Link>
                        ))}
                        <div className="pt-4 border-t border-border">
                            {currentPlan === "monthly" && (
                                <button
                                    type="button"
                                    onClick={() => {
                                        handleManageSubscription();
                                        setIsMobileMenuOpen(false);
                                    }}
                                    disabled={isPortalLoading}
                                    className="mb-3 block w-full px-6 py-3 text-center text-sm font-semibold text-primary border border-primary rounded-md hover:bg-primary/10 transition-all duration-200 font-cta disabled:opacity-60 disabled:cursor-not-allowed"
                                >
                                    {isPortalLoading
                                        ? "Opening Portal..."
                                        : "Manage Subscription"}
                                </button>
                            )}
                            <AuthButton
                                onLoginClick={onLoginClick}
                                className="block w-full px-6 py-3 text-center"
                                onMobileClick={() => setIsMobileMenuOpen(false)}
                            />
                        </div>
                    </nav>
                </div>
            )}
        </header>
    );
};

export default Header;
