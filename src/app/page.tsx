import type { Metadata } from "next";
import PageClient from "./components/PageClient";
import { auth } from "@clerk/nextjs/server";
import { prepareData } from "@/components/utils/prepareInformation";

export const metadata: Metadata = {
    title: "Never Write a Cover Letter Again — Let AI Do It for You",
    description:
        "Generate personalized, professional cover letters in 10 seconds with AI-powered automation. Apply faster, smarter, without burning out. Start your free trial today.",
};

export default async function Home() {
    const { userId } = await auth();

    // Fetch limitations if user is authenticated
    const initialData = userId
        ? await prepareData(userId)
        : {
              totalGenerations: 0,
              limitations: { exist: false, amount: 0 },
          };

    return <PageClient initialData={initialData} />;
}
