import type { Metadata } from "next";
import PageClient from "./components/PageClient";
import { auth } from "@clerk/nextjs/server";
import { prepareData } from "@/components/utils/prepareInformation";

export const metadata: Metadata = {
    title: "Never Write a Cover Letter Again — Let AI Do It for You",
    description:
        "Generate personalized, professional cover letters in 10 seconds with AI-powered automation. Apply faster, smarter, without burning out. Start your free trial today.",
    openGraph: {
        title: "Never Write a Cover Letter Again — Let AI Do It for You",
        description:
            "Generate personalized, professional cover letters in 10 seconds with AI-powered automation. Apply faster, smarter, without burning out.",
        type: "website",
        url: "/",
    },
    twitter: {
        card: "summary_large_image",
        title: "Never Write a Cover Letter Again — Let AI Do It for You",
        description:
            "Generate personalized, professional cover letters in 10 seconds with AI-powered automation.",
    },
    alternates: {
        canonical: "/",
    },
};

export default async function Home() {
    const { userId } = await auth();

    // Fetch limitations if user is authenticated
    const initialData = userId
        ? await prepareData(userId)
        : {
              totalGenerations: 0,
              limitations: { exist: false, amount: 0 },
              cvInformation: null,
              currentPlan: null,
          };
    
    // Structured data for SEO
    const structuredData = {
        "@context": "https://schema.org",
        "@type": "SoftwareApplication",
        name: "HireQuill AI",
        applicationCategory: "BusinessApplication",
        operatingSystem: "Web",
        offers: {
            "@type": "Offer",
            price: "0",
            priceCurrency: "USD",
        },
        aggregateRating: {
            "@type": "AggregateRating",
            ratingValue: "4.8",
            ratingCount: "147832",
        },
        description:
            "AI-powered cover letter generator that creates personalized, professional cover letters in 10 seconds.",
        featureList: [
            "AI-powered cover letter generation",
            "10-second generation time",
            "Personalized content",
            "Professional formatting",
        ],
    };

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify(structuredData),
                }}
            />
            <PageClient initialData={initialData} />
        </>
    );
}
