'use server';

import { CoverLetterRequest } from "@/app/api/cover-letter/route";
import { SubscriptionsTable } from "@/db/subscriptions/subscriptions";
import { UserTable } from "@/db/users/user";

export const CreateCv = ({user, subscription, data} : {user: typeof UserTable.$inferInsert, subscription: typeof SubscriptionsTable.$inferSelect, data: CoverLetterRequest}) => {
    
};
export default CreateCv;