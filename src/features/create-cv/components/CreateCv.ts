"use server";

import { CoverLetterRequest } from "@/app/api/cover-letter/route";
import { SubscriptionsTable } from "@/db/subscriptions/subscriptions";

export const CreateCv = ({
    userId,
    data,
}: {
    userId: string;
    subscription: typeof SubscriptionsTable.$inferSelect;
    data: CoverLetterRequest;
}) => {};
export default CreateCv;
