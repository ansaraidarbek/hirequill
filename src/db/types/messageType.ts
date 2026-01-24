import { Limitations } from "./limitationType";

export type MESSAGE_TYPE = {
    coverLetter: string;
    message: string;
    limitations: Limitations | null;
}