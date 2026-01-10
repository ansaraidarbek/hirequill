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

    const lastUpdated = "January 6, 2026";

    const tableOfContents: TableOfContentsItem[] = [
        { id: "acceptance", title: "1. Acceptance of Terms" },
        { id: "service-description", title: "2. Service Description" },
        { id: "user-accounts", title: "3. User Accounts & Registration" },
        { id: "subscription-plans", title: "4. Subscription Plans & Billing" },
        { id: "usage-limitations", title: "5. Usage Limitations & Fair Use" },
        { id: "file-uploads", title: "6. File Uploads & Data Processing" },
        {
            id: "intellectual-property",
            title: "7. Intellectual Property Rights",
        },
        { id: "user-responsibilities", title: "8. User Responsibilities" },
        { id: "service-availability", title: "9. Service Availability" },
        { id: "termination", title: "10. Account Termination" },
        { id: "liability", title: "11. Limitation of Liability" },
        { id: "dispute-resolution", title: "12. Dispute Resolution" },
        { id: "changes", title: "13. Changes to Terms" },
        { id: "contact", title: "14. Contact Information" },
    ];

    const termsData = [
        {
            id: "acceptance",
            title: "1. Acceptance of Terms",
            content: `By accessing or using CoverCraft AI ("Service"), you agree to be bound by these Terms of Service ("Terms"). If you disagree with any part of these terms, you may not access the Service.\n\nThese Terms apply to all visitors, users, and others who access or use the Service. By using the Service, you represent that you are at least 18 years old and have the legal capacity to enter into these Terms.`,
        },
        {
            id: "service-description",
            title: "2. Service Description",
            content: `CoverCraft AI is an AI-powered cover letter generation platform that helps job seekers create personalized, professional cover letters. The Service includes:\n\n• AI-powered cover letter generation based on uploaded CV/resume data\n• Customization options for job descriptions and company information\n• Storage and management of generated cover letters\n• Access to generation history and analytics\n\nThe Service uses artificial intelligence technology to analyze your CV and generate cover letters. While we strive for accuracy and quality, AI-generated content may require review and editing before use in actual job applications.`,
        },
        {
            id: "user-accounts",
            title: "3. User Accounts & Registration",
            content: `To use certain features of the Service, you must register for an account. When you register, you agree to:\n\n• Provide accurate, current, and complete information\n• Maintain and promptly update your account information\n• Maintain the security of your password and account\n• Accept responsibility for all activities that occur under your account\n• Notify us immediately of any unauthorized use of your account\n\nYou are responsible for safeguarding your account credentials. We cannot and will not be liable for any loss or damage arising from your failure to maintain account security.`,
        },
        {
            id: "subscription-plans",
            title: "4. Subscription Plans & Billing",
            content: `**Free Plan:**\n• Limited to 5 cover letter generations per month\n• Basic customization features\n• Standard generation speed\n• No payment required\n\n**Monthly Plan ($19.99/month):**\n• Unlimited cover letter generations\n• Advanced customization options\n• Priority generation speed\n• Access to premium templates\n• Generation history and analytics\n\n**Billing Terms:**\n• Monthly subscriptions are billed in advance on a recurring basis\n• Payment is processed through Stripe or PayPal\n• Subscriptions automatically renew unless cancelled\n• You may cancel your subscription at any time\n• No refunds for partial months or unused generations\n• Price changes will be communicated 30 days in advance\n\n**Payment Processing:**\nAll payments are processed securely through third-party payment processors (Stripe/PayPal). We do not store your complete payment information on our servers.`,
        },
        {
            id: "usage-limitations",
            title: "5. Usage Limitations & Fair Use",
            content: `**Generation Limits:**\n• Free Plan: Maximum 5 generations per calendar month\n• Monthly Plan: Unlimited generations with fair use policy\n\n**Fair Use Policy:**\nWhile Monthly Plan users have unlimited generations, we reserve the right to limit usage that we determine to be:\n• Automated or bot-driven generation\n• Commercial resale or redistribution of generated content\n• Excessive usage that impacts service performance for other users\n• Usage patterns inconsistent with individual job search activities\n\n**File Upload Restrictions:**\n• Maximum file size: 10MB per CV/resume upload\n• Supported formats: PDF, DOC, DOCX\n• Maximum 5 CV files stored per account\n• Files must contain legitimate resume/CV content\n\n**API Usage:**\nDirect API access is not provided to standard users. Automated access or scraping of the Service is prohibited.`,
        },
        {
            id: "file-uploads",
            title: "6. File Uploads & Data Processing",
            content: `**Upload Requirements:**\nWhen uploading CV/resume files, you represent and warrant that:\n• You own or have the right to upload the content\n• The content does not violate any third-party rights\n• The content does not contain malicious code or viruses\n• The content is accurate and truthful\n\n**Data Processing:**\n• Uploaded files are processed by our AI systems to extract relevant information\n• Files are stored securely with encryption\n• We do not share your CV data with third parties for marketing purposes\n• You may delete your uploaded files at any time\n• Deleted files are permanently removed within 30 days\n\n**Data Retention:**\n• Active account data is retained for the duration of your account\n• Generated cover letters are stored for 12 months\n• After account deletion, data is retained for 90 days for legal compliance`,
        },
        {
            id: "intellectual-property",
            title: "7. Intellectual Property Rights",
            content: `**Your Content Ownership:**\nYou retain all ownership rights to:\n• Your uploaded CV/resume content\n• Generated cover letters created using the Service\n• Any modifications you make to generated content\n\nBy using the Service, you grant us a limited license to:\n• Process your CV data to generate cover letters\n• Store your content on our servers\n• Use anonymized, aggregated data to improve our AI models\n\n**Our Intellectual Property:**\nThe Service, including its original content, features, functionality, and underlying AI technology, is owned by CoverCraft AI and is protected by international copyright, trademark, and other intellectual property laws.\n\n**Generated Content:**\nWhile you own the generated cover letters, you acknowledge that:\n• AI-generated content may not be entirely unique\n• Similar content may be generated for other users\n• You are responsible for reviewing and editing generated content\n• We do not guarantee the originality of AI-generated text`,
        },
        {
            id: "user-responsibilities",
            title: "8. User Responsibilities",
            content: `You agree to use the Service only for lawful purposes and in accordance with these Terms. You agree NOT to:\n\n• Use the Service for any illegal or unauthorized purpose\n• Upload false, misleading, or fraudulent information\n• Attempt to gain unauthorized access to the Service or related systems\n• Interfere with or disrupt the Service or servers\n• Use automated systems to access the Service without permission\n• Resell or redistribute generated content commercially\n• Impersonate another person or entity\n• Upload content containing viruses or malicious code\n• Violate any applicable laws or regulations\n\n**Content Accuracy:**\nYou are solely responsible for:\n• Reviewing all generated cover letters before use\n• Ensuring accuracy of information in job applications\n• Customizing generated content to match specific job requirements\n• Verifying that generated content meets your standards`,
        },
        {
            id: "service-availability",
            title: "9. Service Availability",
            content: `**Uptime Commitment:**\nWe strive to maintain 99.5% uptime for the Service, but we do not guarantee uninterrupted access. The Service may be unavailable due to:\n• Scheduled maintenance (announced in advance when possible)\n• Emergency maintenance or security updates\n• Technical issues or system failures\n• Third-party service disruptions\n• Force majeure events\n\n**Service Modifications:**\nWe reserve the right to:\n• Modify or discontinue features of the Service\n• Update our AI models and generation algorithms\n• Change pricing with 30 days notice\n• Implement new usage limitations or restrictions\n\n**No Warranty:**\nThe Service is provided "as is" without warranties of any kind, either express or implied, including but not limited to warranties of merchantability, fitness for a particular purpose, or non-infringement.`,
        },
        {
            id: "termination",
            title: "10. Account Termination",
            content: `**Your Right to Terminate:**\nYou may terminate your account at any time by:\n• Cancelling your subscription through account settings\n• Contacting our support team\n• Deleting your account through the dashboard\n\nUpon termination:\n• Your subscription will not renew\n• You will retain access until the end of your billing period\n• No refunds will be provided for unused time\n• Your data will be deleted according to our retention policy\n\n**Our Right to Terminate:**\nWe may suspend or terminate your account immediately if:\n• You violate these Terms of Service\n• You engage in fraudulent or illegal activities\n• Your usage violates our Fair Use Policy\n• Your payment method fails or is declined\n• We are required to do so by law\n\n**Effect of Termination:**\nUpon termination:\n• Your access to the Service will cease immediately\n• Generated content may be deleted after 90 days\n• Outstanding payments remain due\n• Provisions regarding intellectual property, liability, and dispute resolution survive termination`,
        },
        {
            id: "liability",
            title: "11. Limitation of Liability",
            content: `**Disclaimer:**\nTo the maximum extent permitted by law, CoverCraft AI shall not be liable for:\n• Any indirect, incidental, special, consequential, or punitive damages\n• Loss of profits, revenue, data, or business opportunities\n• Damages resulting from use or inability to use the Service\n• Damages resulting from AI-generated content quality or accuracy\n• Damages resulting from unauthorized access to your account\n• Damages resulting from third-party services or integrations\n\n**Maximum Liability:**\nOur total liability to you for all claims arising from or related to the Service shall not exceed the amount you paid us in the 12 months preceding the claim, or $100, whichever is greater.\n\n**AI-Generated Content:**\nWe specifically disclaim liability for:\n• Accuracy or quality of generated cover letters\n• Job application outcomes or hiring decisions\n• Plagiarism or similarity to other content\n• Errors or omissions in generated text\n\nYou acknowledge that AI-generated content requires human review and editing before use in actual job applications.`,
        },
        {
            id: "dispute-resolution",
            title: "12. Dispute Resolution",
            content: `**Governing Law:**\nThese Terms shall be governed by and construed in accordance with the laws of the United States, without regard to its conflict of law provisions.\n\n**Informal Resolution:**\nBefore filing a claim, you agree to contact us at support@covercraftai.com to attempt to resolve the dispute informally. We will attempt to resolve disputes within 30 days.\n\n**Arbitration Agreement:**\nIf informal resolution fails, you agree that disputes will be resolved through binding arbitration rather than in court, except that you may assert claims in small claims court if they qualify.\n\n**Class Action Waiver:**\nYou agree to resolve disputes with us on an individual basis and waive your right to participate in class actions or class arbitrations.\n\n**Exceptions:**\nEither party may seek injunctive or other equitable relief in court to prevent infringement of intellectual property rights.`,
        },
        {
            id: "changes",
            title: "13. Changes to Terms",
            content: `We reserve the right to modify these Terms at any time. When we make changes:\n\n• We will update the "Last Updated" date at the top of this page\n• For material changes, we will provide notice via email or Service notification\n• Changes become effective 30 days after posting\n• Continued use of the Service after changes constitutes acceptance\n\n**Your Options:**\nIf you disagree with modified Terms:\n• You may terminate your account before changes take effect\n• You will not be charged for the next billing period if you cancel\n• You may export your data before termination\n\n**Version History:**\nPrevious versions of these Terms are available upon request.`,
        },
        {
            id: "contact",
            title: "14. Contact Information",
            content: `For questions about these Terms of Service, please contact us:\n\n**Email:** support@covercraftai.com\n**Response Time:** Within 48 hours for general inquiries\n**Support Hours:** Monday-Friday, 9:00 AM - 6:00 PM EST\n\n**Mailing Address:**\nCoverCraft AI\nLegal Department\n123 Innovation Drive\nSan Francisco, CA 94102\nUnited States\n\n**Legal Notices:**\nFor legal notices or service of process, please use the mailing address above and mark correspondence "ATTN: Legal Department."`,
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
    }, [isHydrated, termsData]);

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
                                            We're here to help. If you have any
                                            questions about these Terms of
                                            Service, please don't hesitate to
                                            reach out to our support team.
                                        </p>
                                        <a
                                            href="mailto:support@covercraftai.com"
                                            className="inline-flex items-center space-x-2 text-sm font-semibold text-primary hover:text-primary/80 transition-colors font-cta"
                                        >
                                            <Icon
                                                name="EnvelopeIcon"
                                                size={16}
                                            />
                                            <span>
                                                support@covercraftai.com
                                            </span>
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
