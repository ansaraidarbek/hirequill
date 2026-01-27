"use client";

import { useState, useEffect } from "react";
import Icon from "@/components/ui/AppIcon";
import TermsSection from "./TermsSection";

interface TableOfContentsItem {
    id: string;
    title: string;
    subsections?: { id: string; title: string }[];
}

const TermsContent = () => {
    const [isHydrated, setIsHydrated] = useState(false);
    const [activeSection, setActiveSection] = useState("acceptance");
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    useEffect(() => {
        setIsHydrated(true);
    }, []);

    const lastUpdated = "January 27, 2026";

    const tableOfContents: TableOfContentsItem[] = [
        { id: "acceptance", title: "1. Acceptance of Terms" },
        { id: "service-description", title: "2. Service Description" },
        { id: "user-accounts", title: "3. User Accounts & Authentication" },
        { id: "plans-billing-refunds", title: "4. Plans, Billing & Refunds" },
        { id: "usage-limitations", title: "5. Usage Limits & Fair Use" },
        { id: "uploads-data", title: "6. Uploads, Data Storage & Processing" },
        { id: "user-responsibilities", title: "7. User Responsibilities" },
        { id: "intellectual-property", title: "8. Intellectual Property" },
        { id: "availability-changes", title: "9. Availability & Changes" },
        { id: "termination", title: "10. Suspension & Termination" },
        { id: "disclaimers-liability", title: "11. Disclaimers & Liability" },
        { id: "dispute-resolution", title: "12. Dispute Resolution" },
        { id: "contact", title: "13. Contact" },
    ];

    const termsData = [
        {
            id: "acceptance",
            title: "1. Acceptance of Terms",
            content:
                `By accessing or using HireQuill (the "Service"), you agree to these Terms of Service ("Terms"). ` +
                `If you do not agree, do not use the Service.\n\n` +
                `You must be at least 18 years old (or the age of majority in your jurisdiction) and capable of forming a binding contract to use the Service.`,
        },
        {
            id: "service-description",
            title: "2. Service Description",
            content:
                `HireQuill helps job seekers generate cover letters using AI.\n\n` +
                `Typical flow:\n` +
                `• You sign in\n` +
                `• You provide a CV/resume file and a target company name and position title (and optionally a job description)\n` +
                `• The Service generates a cover letter and returns it to you\n\n` +
                `AI output may contain mistakes, omissions, or text that is not suitable for your situation. You are responsible for reviewing, editing, and validating any generated content before using it in applications.`,
        },
        {
            id: "user-accounts",
            title: "3. User Accounts & Authentication",
            content:
                `Authentication is provided by Clerk. We do not store your password.\n\n` +
                `When you create an account or sign in, we store only the following user profile information in our database:\n` +
                `• Full name\n` +
                `• Email address\n` +
                `• Profile image URL\n\n` +
                `You are responsible for maintaining the confidentiality of your account access and for all activity that occurs under your account.`,
        },
        {
            id: "plans-billing-refunds",
            title: "4. Plans, Billing & Refunds",
            content:
                `We offer two user types:\n\n` +
                `**Free Users**\n` +
                `• Up to 2 cover letter generations per calendar month\n\n` +
                `**Paid Users**\n` +
                `• Unlimited generations, subject to reasonable use limits and throttling described in Section 5\n` +
                `• Paid status lasts for one (1) month from the date of payment\n\n` +
                `**Refund Policy (Paid Users)**\n` +
                `If you generate no more than 2 cover letters during your paid period, you are eligible to request a refund for that paid period.\n\n` +
                `We may deny refunds for fraud, abuse, chargeback abuse, or attempts to circumvent usage limits.`,
        },
        {
            id: "usage-limitations",
            title: "5. Usage Limits & Fair Use",
            content:
                `We are built for individual job seekers. To protect the Service and other users, we apply fair use limits.\n\n` +
                `**Free plan limit**\n` +
                `• 2 generations per calendar month\n\n` +
                `**Paid plan fair use & throttling**\n` +
                `Paid users can generate an unlimited number of cover letters under reasonable constraints. We may throttle (slow down) requests when usage patterns indicate unusually heavy use, including:\n` +
                `• More than 4 cover letters generated for the same company, and/or\n` +
                `• More than 200 cover letters generated in a single week\n\n` +
                `**Prohibited behavior**\n` +
                `You agree not to:\n` +
                `• Use bots, automation, scraping, or scripted requests to generate content at scale\n` +
                `• Attempt to bypass limits or throttling\n` +
                `• Resell, redistribute, or offer generated cover letters as a commercial service\n` +
                `• Interfere with the Service, security, or other users\n\n` +
                `We may suspend or terminate accounts that violate these rules.`,
        },
        {
            id: "uploads-data",
            title: "6. Uploads, Data Storage & Processing",
            content:
                `**What you submit**\n` +
                `To generate a cover letter, you may submit:\n` +
                `• A CV/resume file\n` +
                `• Company name\n` +
                `• Position title\n` +
                `• Optional job description\n\n` +
                `**Where data is stored**\n` +
                `We use Supabase to store application data.\n\n` +
                `**CV file storage**\n` +
                `• Free users: We do not store your CV file in our database.\n` +
                `• Paid users: We store your CV file in Supabase in Base64 form so we can provide the Service.\n\n` +
                `**Processing**\n` +
                `Your inputs are processed to generate a cover letter. You understand that submitting personal information (including employment history) is voluntary and done at your discretion.\n\n` +
                `**Deletion**\n` +
                `If you delete your account (or request deletion), we will remove personal data from our systems within a reasonable timeframe, except where retention is required for legal, security, or billing compliance.`,
        },
        {
            id: "user-responsibilities",
            title: "7. User Responsibilities",
            content:
                `You agree that:\n` +
                `• You have the rights necessary to upload and use the CV/resume and any content you submit\n` +
                `• You will not submit unlawful, infringing, or confidential third-party content without permission\n` +
                `• You will review and verify generated cover letters before use\n` +
                `• You are responsible for any job application outcomes and communications\n\n` +
                `We are not a recruiter, employer, or employment agency, and we do not guarantee interviews, offers, or hiring outcomes.`,
        },
        {
            id: "intellectual-property",
            title: "8. Intellectual Property",
            content:
                `**Your content**\n` +
                `You keep ownership of your uploaded CV/resume and the content you provide.\n\n` +
                `**Generated output**\n` +
                `As between you and HireQuill, you may use generated cover letters for your personal job search. You are responsible for ensuring the output is suitable, accurate, and does not violate any third-party rights.\n\n` +
                `**Our service**\n` +
                `HireQuill, its branding, UI, software, and underlying systems are owned by us and protected by applicable intellectual property laws.`,
        },
        {
            id: "availability-changes",
            title: "9. Availability & Changes",
            content:
                `We aim to keep the Service available, but it may occasionally be interrupted due to maintenance, updates, outages, or third-party dependencies.\n\n` +
                `We may change, add, or remove features at any time. If we make material changes to these Terms, we will update the "Last Updated" date and may provide additional notice within the Service.`,
        },
        {
            id: "termination",
            title: "10. Suspension & Termination",
            content:
                `You may stop using the Service at any time.\n\n` +
                `We may suspend or terminate access if we reasonably believe you:\n` +
                `• Violated these Terms\n` +
                `• Abused free/paid limits or throttling\n` +
                `• Used automation or attempted to bypass restrictions\n` +
                `• Engaged in fraud or unlawful activity\n\n` +
                `Upon termination, your right to use the Service ends immediately.`,
        },
        {
            id: "disclaimers-liability",
            title: "11. Disclaimers & Liability",
            content:
                `**No warranty**\n` +
                `The Service is provided "as is" and "as available" without warranties of any kind.\n\n` +
                `**AI limitations**\n` +
                `We do not guarantee that generated cover letters will be accurate, complete, unique, or fit for your purpose.\n\n` +
                `**Limitation of liability**\n` +
                `To the maximum extent permitted by law, HireQuill will not be liable for indirect, incidental, special, consequential, or punitive damages, or for loss of data, profits, or business opportunities.\n\n` +
                `If we are found liable for any claim, our total liability will not exceed the amount you paid us for the paid period giving rise to the claim.`,
        },
        {
            id: "dispute-resolution",
            title: "12. Dispute Resolution",
            content:
                `Please contact us first so we can try to resolve issues informally.\n\n` +
                `If a dispute cannot be resolved informally, it will be resolved in the courts of the jurisdiction where HireQuill is established, unless applicable law requires otherwise.`,
        },
        {
            id: "contact",
            title: "13. Contact",
            content:
                `If you have questions about these Terms, contact us:\n\n` +
                `**Email:** support@hirequill.dev`,
        },
    ];

    const scrollToSection = (sectionId: string) => {
        if (!isHydrated) return;

        const element = document.getElementById(sectionId);
        if (element) {
            const offset = 100;
            const elementPosition = element.getBoundingClientRect().top;
            const offsetPosition =
                elementPosition + window.pageYOffset - offset;

            window.scrollTo({
                top: offsetPosition,
                behavior: "smooth",
            });

            setActiveSection(sectionId);
            setIsMobileMenuOpen(false);
        }
    };

    useEffect(() => {
        if (!isHydrated) return;

        const handleScroll = () => {
            const sections = termsData.map((section) => section.id);
            const scrollPosition = window.scrollY + 150;

            for (let i = sections.length - 1; i >= 0; i--) {
                const section = document.getElementById(sections[i]);
                if (section && section.offsetTop <= scrollPosition) {
                    setActiveSection(sections[i]);
                    break;
                }
            }
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isHydrated]);

    if (!isHydrated) {
        return (
            <div className="w-full bg-background">
                <div className="container mx-auto px-4 lg:px-8 py-12">
                    <div className="max-w-4xl mx-auto">
                        <div className="h-12 bg-muted rounded-md animate-pulse mb-4"></div>
                        <div className="h-6 bg-muted rounded-md animate-pulse mb-8 w-1/3"></div>
                        <div className="space-y-4">
                            {[1, 2, 3, 4, 5].map((i) => (
                                <div
                                    key={i}
                                    className="h-32 bg-muted rounded-md animate-pulse"
                                ></div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="w-full bg-background">
            <div className="container mx-auto px-4 lg:px-8 py-12">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-12">
                        <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4 font-headline">
                            Terms of Service
                        </h1>
                        <p className="text-lg text-muted-foreground font-body">
                            Last Updated: {lastUpdated}
                        </p>
                    </div>

                    <div className="lg:grid lg:grid-cols-12 lg:gap-8">
                        <aside className="hidden lg:block lg:col-span-3 lg:sticky lg:top-24 lg:self-start">
                            <nav className="bg-card rounded-lg shadow-sm p-6 border border-border">
                                <h2 className="text-sm font-semibold text-foreground mb-4 font-headline">
                                    Table of Contents
                                </h2>
                                <ul className="space-y-2">
                                    {tableOfContents.map((item) => (
                                        <li key={item.id}>
                                            <button
                                                onClick={() =>
                                                    scrollToSection(item.id)
                                                }
                                                className={`text-left text-sm w-full py-1.5 px-3 rounded-md transition-colors font-body ${
                                                    activeSection === item.id
                                                        ? "bg-primary text-primary-foreground font-semibold"
                                                        : "text-muted-foreground hover:text-foreground hover:bg-muted"
                                                }`}
                                            >
                                                {item.title}
                                            </button>
                                        </li>
                                    ))}
                                </ul>
                            </nav>
                        </aside>

                        <div className="lg:hidden mb-6">
                            <button
                                onClick={() =>
                                    setIsMobileMenuOpen(!isMobileMenuOpen)
                                }
                                className="w-full flex items-center justify-between bg-card rounded-lg shadow-sm p-4 border border-border"
                            >
                                <span className="text-sm font-semibold text-foreground font-headline">
                                    Table of Contents
                                </span>
                                <Icon
                                    name={
                                        isMobileMenuOpen
                                            ? "ChevronUpIcon"
                                            : "ChevronDownIcon"
                                    }
                                    size={20}
                                    className="text-muted-foreground"
                                />
                            </button>

                            {isMobileMenuOpen && (
                                <nav className="mt-2 bg-card rounded-lg shadow-sm p-4 border border-border">
                                    <ul className="space-y-2">
                                        {tableOfContents.map((item) => (
                                            <li key={item.id}>
                                                <button
                                                    onClick={() =>
                                                        scrollToSection(item.id)
                                                    }
                                                    className={`text-left text-sm w-full py-2 px-3 rounded-md transition-colors font-body ${
                                                        activeSection ===
                                                        item.id
                                                            ? "bg-primary text-primary-foreground font-semibold"
                                                            : "text-muted-foreground hover:text-foreground hover:bg-muted"
                                                    }`}
                                                >
                                                    {item.title}
                                                </button>
                                            </li>
                                        ))}
                                    </ul>
                                </nav>
                            )}
                        </div>

                        <main className="lg:col-span-9">
                            <div className="bg-card rounded-lg shadow-sm border border-border">
                                <div className="p-6 md:p-8 space-y-8">
                                    {termsData.map((section) => (
                                        <TermsSection
                                            key={section.id}
                                            id={section.id}
                                            title={section.title}
                                            content={section.content}
                                        />
                                    ))}
                                </div>
                            </div>

                            <div className="mt-8 bg-accent/10 rounded-lg p-6 border border-accent/20">
                                <div className="flex items-start space-x-3">
                                    <Icon
                                        name="InformationCircleIcon"
                                        size={24}
                                        className="text-accent flex-shrink-0 mt-0.5"
                                    />
                                    <div>
                                        <h3 className="text-lg font-semibold text-foreground mb-2 font-headline">
                                            Questions About These Terms?
                                        </h3>
                                        <p className="text-sm text-muted-foreground mb-4 font-body">
                                            If you have any questions about
                                            these Terms of Service, contact our
                                            support team.
                                        </p>
                                        <a
                                            href="mailto:support@hirequill.dev"
                                            className="inline-flex items-center space-x-2 text-sm font-semibold text-primary hover:text-primary/80 transition-colors font-cta"
                                        >
                                            <Icon
                                                name="EnvelopeIcon"
                                                size={16}
                                            />
                                            <span>support@hirequill.dev</span>
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </main>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TermsContent;
