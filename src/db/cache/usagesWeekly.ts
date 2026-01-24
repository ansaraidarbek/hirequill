import { revalidateTag } from "next/cache";
import { getGlobalTag, getIdTag } from "./dataCache";

export function getUserCompanyUsageWeeklyGlobalTag() {
    return getGlobalTag("userCompanyUsageWeekly");
}

export function getUserCompanyUsageWeeklyIdTag(id: string) {
    return getIdTag("userCompanyUsageWeekly", id);
}

export function revalidateUserCompanyUsageWeeklyCache(id: string) {
    revalidateTag(getUserCompanyUsageWeeklyGlobalTag());
    revalidateTag(getUserCompanyUsageWeeklyIdTag(id));
}
