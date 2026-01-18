import { revalidateTag } from "next/cache";
import { getGlobalTag, getIdTag } from "./dataCache";

export function getCVGlobalTag() {
    return getGlobalTag("cvs");
}

export function getCVIdTag(id: string) {
    return getIdTag("cvs", id);
}

export function revalidateCVCache(id: string) {
    revalidateTag(getCVGlobalTag());
    revalidateTag(getCVIdTag(id));
}
