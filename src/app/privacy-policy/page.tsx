import type { Metadata } from "next";
import Footer from "@/components/common/Footer";
import PrivacyPolicyContent from "./components/PrivacyPolicyContent";

export const metadata: Metadata = {
    title: "Privacy Policy - HireQuill AI",
    description:
        "Learn how HireQuill AI collects, uses, and protects your personal data. GDPR-compliant privacy policy with transparent data handling practices and user rights information.",
};

export default function PrivacyPolicyPage() {
    return (
        <div className="min-h-screen flex flex-col bg-background">
            <main className="flex-1">
                <PrivacyPolicyContent />
            </main>
            <Footer />
        </div>
    );
}
