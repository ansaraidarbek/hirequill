import {
    insertSubscription,
    updateSubscription,
} from "@/db/subscriptions/subscriptions";
import { getDay } from "@/utils/getDay";

type LemonSqueezyWebhookPayload = {
    meta: {
        event_name: string;
        custom_data?: {
            user_id?: string;
        };
    };
    data: {
        id: string;
        type: string;
        attributes: {
            store_id: number;
            customer_id: number;
            order_id: number;
            order_item_id: number;
            product_id: number;
            variant_id: number;
            product_name: string;
            variant_name: string;
            user_name: string;
            user_email: string;
            status: string;
            status_formatted: string;
            card_brand: string | null;
            card_last_four: string | null;
            pause: string | null;
            cancelled: boolean;
            trial_ends_at: string | null;
            billing_anchor: number;
            urls: {
                update_payment_method: string;
                customer_portal: string;
            };
            renews_at: string;
            ends_at: string | null;
            created_at: string;
            updated_at: string;
            test_mode: boolean;
        };
    };
};

/**
 * Add one month to a date
 */
function addOneMonth(date: Date): Date {
    const newDate = new Date(date);
    newDate.setMonth(newDate.getMonth() + 1);
    return newDate;
}

/**
 * Handle subscription_created event
 * Grants the user a monthly subscription for one month
 */
export async function handleSubscriptionCreated(
    payload: LemonSqueezyWebhookPayload,
) {
    const userId = payload.meta.custom_data?.user_id;
    if (!userId) {
        throw new Error("user_id not found in webhook payload");
    }

    const now = new Date();
    const periodEnd = addOneMonth(now);

    await insertSubscription({
        userId,
        plan: "monthly",
        status: "active",
        providerSubscriptionId: payload.data.id,
        currentPeriodStart: now,
        currentPeriodEnd: periodEnd,
        dayStarted: getDay(),
        updatedAt: now,
    });
}

/**
 * Handle subscription_updated event
 * Updates the subscription for one month from now
 */
export async function handleSubscriptionUpdated(
    payload: LemonSqueezyWebhookPayload,
) {
    const userId = payload.meta.custom_data?.user_id;
    if (!userId) {
        throw new Error("user_id not found in webhook payload");
    }

    const now = new Date();
    const periodEnd = addOneMonth(now);

    await updateSubscription(userId, {
        plan: "monthly",
        status: "active",
        providerSubscriptionId: payload.data.id,
        currentPeriodStart: now,
        currentPeriodEnd: periodEnd,
        dayStarted: getDay(),
        updatedAt: now,
    });
}

/**
 * Handle subscription_canceled event
 * Switches the user to free subscription
 */
export async function handleSubscriptionCanceled(
    payload: LemonSqueezyWebhookPayload,
) {
    const userId = payload.meta.custom_data?.user_id;
    if (!userId) {
        throw new Error("user_id not found in webhook payload");
    }

    const now = new Date();

    await updateSubscription(userId, {
        plan: "free",
        status: "canceled",
        providerSubscriptionId: payload.data.id,
        currentPeriodStart: now,
        currentPeriodEnd: null,
        dayStarted: getDay(),
        updatedAt: now,
    });
}

/**
 * Handle subscription_expired event
 * Switches the user to free subscription
 */
export async function handleSubscriptionExpired(
    payload: LemonSqueezyWebhookPayload,
) {
    const userId = payload.meta.custom_data?.user_id;
    if (!userId) {
        throw new Error("user_id not found in webhook payload");
    }

    const now = new Date();

    await updateSubscription(userId, {
        plan: "free",
        status: "expired",
        providerSubscriptionId: payload.data.id,
        currentPeriodStart: now,
        currentPeriodEnd: null,
        dayStarted: getDay(),
        updatedAt: now,
    });
}
