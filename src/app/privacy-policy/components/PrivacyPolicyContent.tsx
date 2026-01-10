"use client";

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
    { id: "your-rights", title: "Your Rights & Control" },
    { id: "ai-processing", title: "AI Processing & Generation" },
    { id: "cookies-analytics", title: "Cookies & Analytics" },
    { id: "data-retention", title: "Data Retention" },
    { id: "third-party-services", title: "Third-Party Services" },
    { id: "children-privacy", title: "Children's Privacy" },
    { id: "changes-to-policy", title: "Changes to This Policy" },
    { id: "contact-us", title: "Contact Us" },
];

const informationWeCollect = [
    "Account Information: Email address, name, and password (encrypted)",
    "CV/Resume Data: Documents you upload for cover letter generation",
    "Job Application Data: Job descriptions and company information you provide",
    "Generated Content: Cover letters created through our AI service",
    "Usage Data: How you interact with our platform, features used, and generation history",
    "Device Information: Browser type, IP address, operating system, and device identifiers",
    "Payment Information: Processed securely through our payment provider (we never store full card details)",
];

const howWeUseData = [
    "Generate personalized cover letters using AI technology",
    "Improve and optimize our AI generation algorithms",
    "Provide customer support and respond to your inquiries",
    "Send service updates, security alerts, and account notifications",
    "Process payments and manage subscriptions",
    "Analyze usage patterns to enhance user experience",
    "Prevent fraud and ensure platform security",
    "Comply with legal obligations and enforce our Terms of Service",
];

const yourRights = [
    "Access: Request a copy of all personal data we hold about you",
    "Correction: Update or correct inaccurate information in your account",
    "Deletion: Request permanent deletion of your account and associated data",
    "Export: Download your generated cover letters and CV data in standard formats",
    "Opt-Out: Unsubscribe from marketing emails (service emails remain necessary)",
    "Restriction: Limit how we process your data in certain circumstances",
    "Portability: Receive your data in a machine-readable format for transfer to another service",
];

const securityMeasures = [
    "256-bit SSL/TLS encryption for all data transmission",
    "AES-256 encryption for data at rest in our secure databases",
    "Regular security audits and penetration testing",
    "Multi-factor authentication options for account protection",
    "Secure file upload protocols with virus scanning",
    "Access controls limiting employee data access to essential personnel only",
    "Automated backup systems with encrypted storage",
    "GDPR-compliant data processing agreements with all service providers",
];

const cookieTypes = [
    "Essential Cookies: Required for platform functionality (login, session management)",
    "Analytics Cookies: Help us understand usage patterns and improve performance",
    "Preference Cookies: Remember your settings and language preferences",
    "Performance Cookies: Monitor site speed and identify technical issues",
];

const dataRetention = [
    "Active Accounts: Data retained while your account is active",
    "Generated Content: Cover letters stored for 12 months after generation",
    "Deleted Accounts: Personal data permanently deleted within 30 days of account closure",
    "Legal Requirements: Some data may be retained longer if required by law",
    "Backup Systems: Deleted data removed from backups within 90 days",
];

const thirdPartyServices = [
    "Payment Processing: Stripe for secure subscription and payment handling",
    "Email Services: SendGrid for transactional and notification emails",
    "Analytics: Google Analytics for usage tracking (anonymized data)",
    "Cloud Hosting: AWS for secure data storage and platform infrastructure",
    "AI Processing: OpenAI API for cover letter generation (data not used for training)",
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
                            Your privacy matters. Here's how we collect, use,
                            and protect your data with complete transparency.
                        </p>
                    </div>

                    <LastUpdated date="January 6, 2026" />

                    <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                        <div className="lg:col-span-1">
                            <TableOfContents items={tableOfContentsItems} />
                        </div>

                        <div className="lg:col-span-3">
                            <PolicySection
                                id="introduction"
                                title="Introduction"
                            >
                                <p>
                                    Welcome to HireQuill AI. We're committed to
                                    protecting your privacy and being
                                    transparent about how we handle your data.
                                    This policy explains what information we
                                    collect, why we collect it, and how you
                                    maintain control over your personal
                                    information.
                                </p>
                                <p>
                                    By using HireQuill AI, you agree to the
                                    practices described in this policy. We've
                                    written this in plain language because we
                                    believe privacy policies should be
                                    understandable, not buried in legal jargon.
                                </p>
                                <p className="font-semibold text-foreground">
                                    Core Principle: You own every cover letter
                                    you generate. Your CV data is yours, and we
                                    never use it to train AI models or share it
                                    with third parties for marketing purposes.
                                </p>
                            </PolicySection>

                            <PolicySection
                                id="information-we-collect"
                                title="Information We Collect"
                            >
                                <p>
                                    To provide our cover letter generation
                                    service, we collect several types of
                                    information:
                                </p>
                                <PolicyList items={informationWeCollect} />
                                <p className="mt-4">
                                    We only collect data necessary to deliver
                                    our service effectively. We never sell your
                                    personal information to third parties.
                                </p>
                            </PolicySection>

                            <PolicySection
                                id="how-we-use-your-data"
                                title="How We Use Your Data"
                            >
                                <p>
                                    Your data serves specific purposes that
                                    directly benefit your experience:
                                </p>
                                <PolicyList items={howWeUseData} />
                                <p className="mt-4">
                                    We process your data based on your consent,
                                    our legitimate business interests, and legal
                                    obligations. You can withdraw consent at any
                                    time by deleting your account.
                                </p>
                            </PolicySection>

                            <PolicySection
                                id="data-storage-security"
                                title="Data Storage & Security"
                            >
                                <p>
                                    We take security seriously. Your data is
                                    protected through multiple layers of
                                    industry-standard security measures:
                                </p>
                                <PolicyList items={securityMeasures} />
                                <p className="mt-4">
                                    While we implement robust security measures,
                                    no system is 100% secure. We continuously
                                    monitor and update our security protocols to
                                    protect against emerging threats.
                                </p>
                            </PolicySection>

                            <PolicySection
                                id="your-rights"
                                title="Your Rights & Control"
                            >
                                <p>
                                    You have complete control over your data.
                                    Under GDPR and other privacy regulations,
                                    you have the following rights:
                                </p>
                                <PolicyList items={yourRights} />
                                <div className="mt-6">
                                    <p className="font-semibold text-foreground mb-2">
                                        How to Exercise Your Rights:
                                    </p>
                                    <p>
                                        Access your account settings to update
                                        information, export data, or delete your
                                        account. For data access requests or
                                        privacy inquiries, contact our privacy
                                        team using the information at the bottom
                                        of this page.
                                    </p>
                                </div>
                            </PolicySection>

                            <PolicySection
                                id="ai-processing"
                                title="AI Processing & Generation"
                            >
                                <p>
                                    Our AI-powered cover letter generation works
                                    as follows:
                                </p>
                                <PolicyList
                                    ordered
                                    items={[
                                        "You upload your CV and provide job description details",
                                        "Our system securely transmits this data to OpenAI's API for processing",
                                        "The AI generates a personalized cover letter based on your inputs",
                                        "Generated content is returned to you and stored in your account",
                                        "Your data is NOT used to train OpenAI's models or any other AI systems",
                                    ]}
                                />
                                <p className="mt-4">
                                    We have a Data Processing Agreement with
                                    OpenAI that prohibits them from using your
                                    data for model training. Your CV and
                                    generated letters remain confidential.
                                </p>
                            </PolicySection>

                            <PolicySection
                                id="cookies-analytics"
                                title="Cookies & Analytics"
                            >
                                <p>
                                    We use cookies and similar technologies to
                                    improve your experience and understand how
                                    our platform is used:
                                </p>
                                <PolicyList items={cookieTypes} />
                                <p className="mt-4">
                                    You can control cookie preferences through
                                    your browser settings. Disabling essential
                                    cookies may affect platform functionality.
                                    Analytics data is anonymized and aggregated
                                    to protect your privacy.
                                </p>
                            </PolicySection>

                            <PolicySection
                                id="data-retention"
                                title="Data Retention"
                            >
                                <p>
                                    We retain your data only as long as
                                    necessary to provide our services:
                                </p>
                                <PolicyList items={dataRetention} />
                                <p className="mt-4">
                                    You can request immediate deletion of your
                                    account and data at any time. Some
                                    anonymized usage statistics may be retained
                                    for service improvement purposes.
                                </p>
                            </PolicySection>

                            <PolicySection
                                id="third-party-services"
                                title="Third-Party Services"
                            >
                                <p>
                                    We work with trusted third-party services to
                                    deliver our platform. These providers are
                                    bound by strict data protection agreements:
                                </p>
                                <PolicyList items={thirdPartyServices} />
                                <p className="mt-4">
                                    All third-party providers are GDPR-compliant
                                    and process data only as instructed by us.
                                    We regularly review their security practices
                                    and compliance status.
                                </p>
                            </PolicySection>

                            <PolicySection
                                id="children-privacy"
                                title="Children's Privacy"
                            >
                                <p>
                                    HireQuill AI is not intended for users under
                                    16 years of age. We do not knowingly collect
                                    personal information from children. If we
                                    discover that we have inadvertently
                                    collected data from a child, we will delete
                                    it immediately.
                                </p>
                                <p>
                                    If you believe a child has provided us with
                                    personal information, please contact us
                                    immediately using the information below.
                                </p>
                            </PolicySection>

                            <PolicySection
                                id="changes-to-policy"
                                title="Changes to This Policy"
                            >
                                <p>
                                    We may update this privacy policy to reflect
                                    changes in our practices or legal
                                    requirements. When we make significant
                                    changes, we will:
                                </p>
                                <PolicyList
                                    items={[
                                        "Update the 'Last Updated' date at the top of this page",
                                        "Notify you via email if you have an active account",
                                        "Display a prominent notice on our platform for 30 days",
                                        "Require your consent for material changes that affect your rights",
                                    ]}
                                />
                                <p className="mt-4">
                                    We encourage you to review this policy
                                    periodically to stay informed about how we
                                    protect your data.
                                </p>
                            </PolicySection>

                            <PolicySection id="contact-us" title="Contact Us">
                                <p className="mb-6">
                                    We're here to answer your privacy questions
                                    and help you exercise your data rights. Our
                                    privacy team is committed to responding to
                                    all inquiries promptly and transparently.
                                </p>
                                <ContactInfo
                                    email="privacy@HireQuillai.com"
                                    responseTime="We respond to all privacy inquiries within 48 hours"
                                />
                            </PolicySection>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
