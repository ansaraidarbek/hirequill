import {
    getCurrentCvInformation,
    getTotalUsersGenerationsCount,
    getUserLimitations,
} from "@/db/interactions";
import { CVType } from "@/db/types/cvType";
import { Limitations } from "@/db/types/limitationType";

export type PreparedData = {
    totalGenerations: number;
    limitations: Limitations;
    cvInformation: CVType | null;
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
    return {
        totalGenerations: generationsTotal,
        limitations,
        cvInformation,
    };
}
