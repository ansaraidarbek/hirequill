import React from "react";
import type { Metadata, Viewport } from "next";
import "../styles/index.css";
import { ClerkProvider } from "@/services/clerk/components/ClerkProvider";

export const viewport: Viewport = {
    width: "device-width",
    initialScale: 1,
    maximumScale: 5,
    userScalable: true,
    themeColor: [
        { media: "(prefers-color-scheme: light)", color: "#ffffff" },
        { media: "(prefers-color-scheme: dark)", color: "#000000" },
    ],
};

export const metadata: Metadata = {
    metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://hirequill.ai"),
    title: {
        default: "HireQuill AI - AI-Powered Cover Letter Generator | Never Write a Cover Letter Again",
        template: "%s | HireQuill AI",
    },
    description:
        "Generate personalized, professional cover letters in 10 seconds with AI-powered automation. Apply faster, smarter, without burning out. Start your free trial today.",
    keywords: [
        "cover letter generator",
        "AI cover letter",
        "cover letter AI",
        "automated cover letters",
        "job application tool",
        "resume cover letter",
        "professional cover letter",
        "cover letter builder",
        "AI writing assistant",
        "job search tool",
    ],
    authors: [{ name: "HireQuill AI" }],
    creator: "HireQuill AI",
    publisher: "HireQuill AI",
    formatDetection: {
        email: false,
        address: false,
        telephone: false,
    },
    icons: {
        icon: [{ url: "/favicon.ico", type: "image/x-icon" }],
        apple: [{ url: "/favicon.ico", sizes: "180x180", type: "image/x-icon" }],
    },
    manifest: "/manifest.json",
    openGraph: {
        type: "website",
        locale: "en_US",
        url: "/",
        siteName: "HireQuill AI",
        title: "HireQuill AI - AI-Powered Cover Letter Generator",
        description:
            "Generate personalized, professional cover letters in 10 seconds with AI-powered automation. Apply faster, smarter, without burning out.",
        images: [
            {
                url: "/og-image.png",
                width: 1200,
                height: 630,
                alt: "HireQuill AI - AI-Powered Cover Letter Generator",
            },
        ],
    },
    twitter: {
        card: "summary_large_image",
        title: "HireQuill AI - AI-Powered Cover Letter Generator",
        description:
            "Generate personalized, professional cover letters in 10 seconds with AI-powered automation.",
        images: ["/og-image.png"],
        creator: "@hirequillai",
    },
    robots: {
        index: true,
        follow: true,
        googleBot: {
            index: true,
            follow: true,
            "max-video-preview": -1,
            "max-image-preview": "large",
            "max-snippet": -1,
        },
    },
    verification: {
        // Add your verification codes here when available
        // google: "your-google-verification-code",
        // yandex: "your-yandex-verification-code",
        // bing: "your-bing-verification-code",
    },
    alternates: {
        canonical: "/",
    },
    category: "technology",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <ClerkProvider>
            <html lang="en" suppressHydrationWarning>
                <body className="antialiased">
                    {children}

                    <script
                        type="module"
                        async
                        src="https://static.rocket.new/rocket-web.js?_cfg=https%3A%2F%2Fhirequill2264back.builtwithrocket.new&_be=https%3A%2F%2Fapplication.rocket.new&_v=0.1.12"
                    />
                    <script
                        type="module"
                        defer
                        src="https://static.rocket.new/rocket-shot.js?v=0.0.2"
                    />
                </body>
            </html>
        </ClerkProvider>
    );
}
