import PolicySection from "./PolicySection";
import PolicyList from "./PolicyList";
import ContactInfo from "./ContactInfo";
import TableOfContents from "./TableOfContents";
import LastUpdated from "./LastUpdated";

interface TOCItem {
    id: string;
    title: string;
}

const tableOfContentsItems: TOCItem[] = [
    { id: "introduction", title: "Introduction" },
    { id: "information-we-collect", title: "Information We Collect" },
    { id: "how-we-use-your-data", title: "How We Use Your Data" },
    { id: "data-storage-security", title: "Data Storage & Security" },
    { id: "ai-processing", title: "AI Processing & Generation" },
    { id: "usage-tracking", title: "Usage Tracking & Fair Use" },
    { id: "data-retention", title: "Data Retention" },
    { id: "your-rights", title: "Your Rights & Control" },
    { id: "third-party-services", title: "Third-Party Services" },
    { id: "children-privacy", title: "Children's Privacy" },
    { id: "changes-to-policy", title: "Changes to This Policy" },
    { id: "contact-us", title: "Contact Us" },
];

const informationWeCollect = [
    "Account Information: Full name, email address, and profile image (authentication handled by Clerk)",
    "CV / Resume Data: Files you upload for cover letter generation (stored only for paid users)",
    "Job Input Data: Company name, position title, and optional job description you provide",
    "Generated Content: Cover letters generated through the Service (stored only for paid users)",
    "Usage Data: Generation counts, timestamps, company-level usage, and subscription status",
    "Technical Data: IP address, browser type, and basic device information collected automatically",
    "Payment Metadata: Subscription status and billing identifiers from our payment provider (we do not store card details)",
];

const howWeUseData = [
    "Authenticate users and manage accounts via Clerk",
    "Generate AI-based cover letters based on user-provided inputs",
    "Store CVs and generated letters for paid users only",
    "Enforce free-tier limits, paid-tier access, and fair use throttling",
    "Provide customer support and respond to inquiries",
    "Process payments, refunds, and subscription status",
    "Monitor platform stability, prevent abuse, and improve reliability",
    "Comply with legal obligations and enforce our Terms of Service",
];

const securityPractices = [
    "Encrypted connections (HTTPS/TLS) for all data transmission",
    "Restricted database access and role-based permissions",
    "Secure cloud infrastructure provided by Supabase",
    "Separation of authentication data (handled by Clerk)",
    "Regular dependency and access reviews",
];

const dataRetention = [
    "Account Data: Retained while your account remains active",
    "Free Users: CV files are processed transiently and not stored",
    "Paid Users: CV files stored in Base64 format in Supabase while the account remains active",
    "Generated Cover Letters: Stored for paid users during the active subscription period",
    "Deleted Accounts: Personal data removed within a reasonable timeframe unless legally required",
    "Operational Logs: Limited retention for security, abuse prevention, and system integrity",
];

const yourRights = [
    "Access: Request a copy of the personal data associated with your account",
    "Correction: Update or correct inaccurate account information",
    "Deletion: Request deletion of your account and associated data",
    "Export: Request export of stored cover letters and CV data (paid users)",
    "Restriction: Limit certain data processing where legally applicable",
    "Objection: Object to specific data processing activities",
];

const thirdPartyServices = [
    "Clerk: User authentication and session management",
    "Supabase: Database and secure file storage",
    "AI Providers: Cover letter generation and text processing (data not used for training)",
    "Payment Providers: Subscription billing and refund handling",
];

export default function PrivacyPolicyContent() {
    return (
        <div className="min-h-screen bg-background">
            <div className="container mx-auto px-4 lg:px-8 py-12">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-12">
                        <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4 font-headline">
                            Privacy Policy
                        </h1>
                        <p className="text-lg text-muted-foreground max-w-3xl mx-auto font-body">
                            This Privacy Policy explains how HireQuill collects,
                            uses, and protects your personal data.
                        </p>
                    </div>

                    <LastUpdated date="January 27, 2026" />

                    <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                        <div className="lg:col-span-1">
                            <TableOfContents items={tableOfContentsItems} />
                        </div>

                        <div className="lg:col-span-3 space-y-10">
                            <PolicySection
                                id="introduction"
                                title="Introduction"
                            >
                                <p>
                                    HireQuill is an AI-powered web application
                                    that helps users generate cover letters.
                                    Your privacy is important to us, and we are
                                    committed to handling your data responsibly
                                    and transparently.
                                </p>
                                <p className="font-semibold text-foreground mt-4">
                                    Core principle: You own your data. We do not
                                    sell it, and we do not use it to train AI
                                    models.
                                </p>
                            </PolicySection>

                            <PolicySection
                                id="information-we-collect"
                                title="Information We Collect"
                            >
                                <PolicyList items={informationWeCollect} />
                            </PolicySection>

                            <PolicySection
                                id="how-we-use-your-data"
                                title="How We Use Your Data"
                            >
                                <PolicyList items={howWeUseData} />
                            </PolicySection>

                            <PolicySection
                                id="data-storage-security"
                                title="Data Storage & Security"
                            >
                                <PolicyList items={securityPractices} />
                                <p className="mt-4">
                                    While we take reasonable steps to protect
                                    your data, no system can be guaranteed to be
                                    completely secure.
                                </p>
                            </PolicySection>

                            <PolicySection
                                id="ai-processing"
                                title="AI Processing & Generation"
                            >
                                <p>
                                    When you request a cover letter, your inputs
                                    (CV, company name, position title, and
                                    optional job description) are sent to our AI
                                    provider solely to generate your requested
                                    content.
                                </p>
                                <p className="mt-4">
                                    We do not allow AI providers to use your
                                    data for training or model improvement.
                                    Generated content is returned directly to
                                    you.
                                </p>
                            </PolicySection>

                            <PolicySection
                                id="usage-tracking"
                                title="Usage Tracking & Fair Use"
                            >
                                <p>
                                    We track generation counts and usage
                                    patterns to enforce plan limits and fair use
                                    rules. This includes detecting excessive
                                    generation for the same company or unusually
                                    high weekly activity.
                                </p>
                            </PolicySection>

                            <PolicySection
                                id="data-retention"
                                title="Data Retention"
                            >
                                <PolicyList items={dataRetention} />
                            </PolicySection>

                            <PolicySection
                                id="your-rights"
                                title="Your Rights & Control"
                            >
                                <PolicyList items={yourRights} />
                                <p className="mt-4">
                                    You can exercise most rights directly from
                                    your account settings or by contacting us.
                                </p>
                            </PolicySection>

                            <PolicySection
                                id="third-party-services"
                                title="Third-Party Services"
                            >
                                <PolicyList items={thirdPartyServices} />
                            </PolicySection>

                            <PolicySection
                                id="children-privacy"
                                title="Children's Privacy"
                            >
                                <p>
                                    HireQuill is not intended for users under
                                    the age of 16. We do not knowingly collect
                                    data from children.
                                </p>
                            </PolicySection>

                            <PolicySection
                                id="changes-to-policy"
                                title="Changes to This Policy"
                            >
                                <p>
                                    We may update this Privacy Policy from time
                                    to time. Changes will be reflected by
                                    updating the "Last Updated" date.
                                </p>
                            </PolicySection>

                            <PolicySection id="contact-us" title="Contact Us">
                                <ContactInfo
                                    email="privacy@hirequill.dev"
                                    responseTime="We respond within 48 hours"
                                />
                            </PolicySection>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
