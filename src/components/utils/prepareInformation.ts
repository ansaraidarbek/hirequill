import {
    getCurrentCvInformation,
    getTotalUsersGenerationsCount,
    getUserLimitations,
} from "@/db/interactions";
import { CVType } from "@/db/types/cvType";
import { Limitations } from "@/db/types/limitationType";
import { getSubscriptionByUserId } from "@/db/subscriptions/subscriptions";

export type PreparedData = {
    totalGenerations: number;
    limitations: Limitations;
    cvInformation: CVType | null;
    currentPlan: "monthly" | "forever" | "free" | null;
};

export type CoverLetterInformation = {
    isDrawerOpen: boolean;
    coverLetter: string;
    companyName: string;
};
export async function prepareData(userId: string): Promise<PreparedData> {
    const generationsTotal = await getTotalUsersGenerationsCount();
    const limitations = await getUserLimitations(userId);
    const cvInformation = await getCurrentCvInformation(userId);
    const subscription = await getSubscriptionByUserId(userId);
    return {
        totalGenerations: generationsTotal,
        limitations,
        cvInformation,
        currentPlan: subscription?.plan || null,
    };
}
