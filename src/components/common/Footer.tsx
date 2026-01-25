"use client";

import Link from "next/link";
import Icon from "@/components/ui/AppIcon";

interface FooterProps {
    className?: string;
}

const Footer = ({ className = "" }: FooterProps) => {
    const currentYear = new Date().getFullYear();

    const footerLinks = {
        product: [
            { label: "Home", href: "main-landing-page" },
            { label: "How It Works", href: "how-it-works" },
            { label: "Pricing", href: "pricing" },
        ],
        legal: [
            { label: "Privacy Policy", href: "/privacy-policy" },
            { label: "Terms of Service", href: "/terms-of-service" },
        ],
        social: [
            { label: "Twitter", href: "#", icon: "ChatBubbleLeftRightIcon" },
            { label: "LinkedIn", href: "#", icon: "BriefcaseIcon" },
            { label: "GitHub", href: "#", icon: "CodeBracketIcon" },
        ],
    };

    return (
        <footer
            className={`w-full bg-surface-dark text-surface-dark-foreground ${className}`}
        >
            <div className="container mx-auto px-4 lg:px-8 py-12">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
                    <div className="col-span-1 md:col-span-2">
                        <Link
                            onClick={(e) => {
                                e.preventDefault();
                                document
                                    .getElementById(footerLinks.product[0].href)
                                    ?.scrollIntoView({
                                        behavior: "smooth",
                                    });
                            }}
                            href="#"
                            className="flex items-center space-x-2 mb-4"
                        >
                            <svg
                                width="40"
                                height="40"
                                viewBox="0 0 40 40"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <rect
                                    width="40"
                                    height="40"
                                    rx="8"
                                    fill="url(#gradient-footer)"
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
                                        id="gradient-footer"
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
                            <span className="text-xl font-bold font-headline">
                                HireQuill AI
                            </span>
                        </Link>
                        <p className="text-sm text-gray-400 max-w-md font-body">
                            Never write a cover letter again. Generate
                            personalized, professional cover letters in 10
                            seconds with AI-powered automation.
                        </p>
                    </div>

                    <div>
                        <h3 className="text-sm font-semibold mb-4 font-headline">
                            Product
                        </h3>
                        <ul className="space-y-2">
                            {footerLinks.product.map((link) => (
                                <li key={link.href}>
                                    <Link
                                        href={"#"}
                                        onClick={(e) => {
                                            e.preventDefault();
                                            document
                                                .getElementById(link.href)
                                                ?.scrollIntoView({
                                                    behavior: "smooth",
                                                });
                                        }}
                                        className="text-sm text-gray-400 hover:text-white transition-colors font-body"
                                    >
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div>
                        <h3 className="text-sm font-semibold mb-4 font-headline">
                            Legal
                        </h3>
                        <ul className="space-y-2">
                            {footerLinks.legal.map((link) => (
                                <li key={link.href}>
                                    <Link
                                        href={link.href}
                                        className="text-sm text-gray-400 hover:text-white transition-colors font-body"
                                    >
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                <div className="border-t border-gray-700 pt-8 flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
                    <p className="text-sm text-gray-400 font-body">
                        © {currentYear} HireQuill AI. All rights reserved.
                    </p>

                    <div className="flex items-center space-x-6">
                        {footerLinks.social.map((social) => (
                            <a
                                key={social.label}
                                href={social.href}
                                className="text-gray-400 hover:text-white transition-colors"
                                aria-label={social.label}
                            >
                                <Icon name={social.icon as any} size={20} />
                            </a>
                        ))}
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
