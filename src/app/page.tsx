import type { Metadata } from "next";
import PageClient from "./components/PageClient";

export const metadata: Metadata = {
    title: "Never Write a Cover Letter Again — Let AI Do It for You",
    description:
        "Generate personalized, professional cover letters in 10 seconds with AI-powered automation. Apply faster, smarter, without burning out. Start your free trial today.",
};

export default function Home() {
    return <PageClient />;
}
