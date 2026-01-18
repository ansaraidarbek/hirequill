import { dayStartedEnum, deleteSubscription, insertSubscription } from "@/db/subscriptions/subscriptions";
import { deleteUser, insertUser, updateUser } from "@/db/users/user";
import { getDay } from "@/utils/getDay";
import type { UserJSON, WebhookEvent } from "@clerk/nextjs/server";

export const clerkUserCreate = async ({ event }: { event: WebhookEvent }) => {
    const userData = event.data as UserJSON;
    const email = userData.email_addresses.find(
        (email) => email.id === userData.primary_email_address_id
    );
    console.log("User created webhook received for user ID:", userData.id);
    if (email == null) {
        throw new Error("No primary email found");
    }

    await insertUser({
        id: userData.id,
        name: `${userData.first_name} ${userData.last_name}`,
        imageUrl: userData.image_url,
        email: email.email_address,
        createdAt: new Date(userData.created_at),
        updatedAt: new Date(userData.updated_at),
    });
    await insertSubscription({
        userId: userData.id,
        plan: "free",
        status: "active",
        providerSubscriptionId: null,
        currentPeriodStart: new Date(userData.created_at),
        currentPeriodEnd: null,
        dayStarted: getDay(),
        updatedAt: new Date(userData.updated_at),
    });
};

export const clerkUserUpdate = async ({ event }: { event: WebhookEvent }) => {
    const userData = event.data as UserJSON;
    const email = userData.email_addresses.find(
        (email) => email.id === userData.primary_email_address_id
    );

    if (email == null) {
        throw new Error("No primary email found");
    }

    await updateUser(userData.id, {
        name: `${userData.first_name} ${userData.last_name}`,
        imageUrl: userData.image_url,
        email: email.email_address,
        updatedAt: new Date(userData.updated_at),
    });
};

export const clerkUserDelete = async ({ event }: { event: WebhookEvent }) => {
    const userData = event.data as UserJSON;

    if (userData.id == null) {
        throw new Error("No user ID found");
    }

    await deleteUser(userData.id);
    await deleteSubscription(userData.id);
};
