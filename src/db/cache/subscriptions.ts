import { revalidateTag } from "next/cache";
import { getGlobalTag, getIdTag } from "./dataCache";

export function getSubscriptionsGlobalTag() {
    return getGlobalTag("subscriptions");
}

export function getSubscriptionsIdTag(id: string) {
    return getIdTag("subscriptions", id);
}

export function revalidateSubscriptionsCache(id: string) {
    revalidateTag(getSubscriptionsGlobalTag());
    revalidateTag(getSubscriptionsIdTag(id));
}
