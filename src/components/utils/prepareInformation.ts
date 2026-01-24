import { getTotalUsersGenerationsCount, getUserLimitations } from "@/db/interactions";
import { Limitations } from "@/db/types/limitationType";

export type PreparedData = {
    totalGenerations: number;
    limitations: Limitations;
};

export type CoverLetterInformation = {
    isDrawerOpen: boolean;
    coverLetter: string;
    companyName: string;
};
export async function prepareData(
    userId: string,
): Promise<PreparedData> {
    const generationsTotal = await getTotalUsersGenerationsCount();
    const limitations = await getUserLimitations(userId);
    return {
        totalGenerations: generationsTotal,
        limitations,
    };
}