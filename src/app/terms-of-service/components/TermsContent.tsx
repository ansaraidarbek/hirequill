import TermsSection from "./TermsSection";
import TableOfContents from "./TableOfContents";

const lastUpdated = "January 27, 2026";

const tableOfContents = [
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
    { id: "contact-us", title: "13. Contact" },
];

const termsData = [
    {
        id: "acceptance",
        title: "1. Acceptance of Terms",
        content:
            `By accessing or using HireQuill (the "Service"), you agree to these Terms of Service ("Terms"). ` +
            `If you do not agree, do not use the Service.\n\n` +
            `You must be at least 18 years old (or the age of majority in your jurisdiction) and capable of forming a binding contract to use the Service.\n\n` +
            `These Terms are entered into between you and Anything (the legal entity operating HireQuill).`,
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
            `HireQuill offers both free and paid subscription plans.\n\n` +
            `**Free Plan**\n` +
            `• Up to 2 cover letter generations per calendar month\n\n` +
            `**Monthly Subscription**\n` +
            `• Monthly subscription providing access to unlimited cover letter generations, subject to reasonable usage policies described in Section 5\n` +
            `• Subscriptions renew automatically every month unless cancelled before the renewal date\n\n` +
            `**Payments**\n` +
            `All payments are securely processed by Lemon Squeezy, our Merchant of Record. By completing a purchase, you enter into a transaction with Lemon Squeezy under their Terms and Conditions.\n\n` +
            `**Refund Policy**\n` +
            `We offer refunds under the following condition:\n\n` +
            `• If no more than 2 cover letters were generated during the active monthly subscription period, you are eligible for a full refund.\n\n` +
            `If more than 2 cover letters were generated during the subscription period, the subscription is considered consumed and is not eligible for a refund.\n\n` +
            `Refund requests must be submitted within 14 days of the original purchase date.\n\n` +
            `To request a refund, please contact us at support@hirequill.dev with your purchase details. Approved refunds will be processed through Lemon Squeezy in accordance with their payment processing policies.\n\n` +
            `We reserve the right to deny refund requests in cases of fraud, abuse, or violation of our Terms of Service.`,
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
];

export default function TermsContent() {
    return (
        <div className="min-h-screen bg-background">
            <div className="container mx-auto px-4 lg:px-8 py-12">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-12">
                        <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4 font-headline">
                            Terms of Service
                        </h1>
                        <p className="text-lg text-muted-foreground max-w-3xl mx-auto font-body">
                            Last Updated: {lastUpdated}
                        </p>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                        <div className="lg:col-span-1">
                            <TableOfContents items={tableOfContents} />
                        </div>

                        <div className="lg:col-span-3 space-y-10">
                            {termsData.map((section) => (
                                <TermsSection
                                    key={section.id}
                                    id={section.id}
                                    title={section.title}
                                    content={section.content}
                                />
                            ))}

                            <section
                                id="contact-us"
                                className="mb-12 scroll-mt-24"
                            >
                                <h2 className="text-2xl font-bold text-foreground mb-4 font-headline">
                                    13. Contact
                                </h2>
                                <div className="text-muted-foreground space-y-4 font-body leading-relaxed">
                                    <div className="bg-muted rounded-lg p-6 border border-border">
                                        <div className="flex items-start space-x-4">
                                            <div className="flex-shrink-0 text-primary text-2xl">
                                                &#9993;
                                            </div>
                                            <div>
                                                <h3 className="text-lg font-semibold text-foreground mb-2 font-headline">
                                                    Questions About These Terms?
                                                </h3>
                                                <p className="mb-3">
                                                    If you have any questions
                                                    about these Terms of
                                                    Service, contact our support
                                                    team.
                                                </p>
                                                <a
                                                    href="mailto:support@hirequill.dev"
                                                    className="text-primary hover:text-primary/80 font-medium transition-colors inline-flex items-center space-x-2"
                                                >
                                                    <span>
                                                        support@hirequill.dev
                                                    </span>
                                                </a>
                                                <p className="text-sm mt-2">
                                                    We respond within 48 hours.
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </section>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
