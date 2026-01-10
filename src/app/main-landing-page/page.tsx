import type { Metadata } from "next";
import Header from "@/components/common/Header";
import Footer from "@/components/common/Footer";
import MainLandingInteractive from "./components/MainLandingInteractive";

export const metadata: Metadata = {
    title: "Never Write a Cover Letter Again — Let AI Do It for You",
    description:
        "Generate personalized, professional cover letters in 10 seconds with AI-powered automation. Apply faster, smarter, without burning out. Start your free trial today.",
};

export default function MainLandingPage() {
    return (
        <>
            <Header />
            <MainLandingInteractive />
            <Footer />
        </>
    );
}
