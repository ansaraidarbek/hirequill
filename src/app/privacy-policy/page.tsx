import type { Metadata } from "next";
import Header from "@/components/common/Header";
import Footer from "@/components/common/Footer";
import PrivacyPolicyContent from "./components/PrivacyPolicyContent";

export const metadata: Metadata = {
    title: "Privacy Policy - CoverCraft AI",
    description:
        "Learn how CoverCraft AI collects, uses, and protects your personal data. GDPR-compliant privacy policy with transparent data handling practices and user rights information.",
};

export default function PrivacyPolicyPage() {
    return (
        <>
            <Header />
            <PrivacyPolicyContent />
            <Footer />
        </>
    );
}
