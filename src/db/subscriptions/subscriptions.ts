import { db } from "@/drizzle/db";
import { SubscriptionsTable } from "@/drizzle/schema";
import { revalidateSubscriptionsCache } from "../cache/subscriptions";
import { eq } from "drizzle-orm";

export async function insertSubscription(
    subscription: typeof SubscriptionsTable.$inferInsert,
) {
    await db
        .insert(SubscriptionsTable)
        .values(subscription)
        .onConflictDoUpdate({
            target: SubscriptionsTable.userId, // works if PK/unique
            set: subscription,
        });

    revalidateSubscriptionsCache(subscription.userId);
}

export async function updateSubscription(
    userId: string,
    subscription: Partial<typeof SubscriptionsTable.$inferInsert>,
) {
    await db
        .update(SubscriptionsTable)
        .set(subscription)
        .where(eq(SubscriptionsTable.userId, userId));

    revalidateSubscriptionsCache(userId);
}

export async function deleteSubscription(userId: string) {
    await db
        .delete(SubscriptionsTable)
        .where(eq(SubscriptionsTable.userId, userId));

    revalidateSubscriptionsCache(userId);
}

export async function getSubscriptionByUserId(
    userId: string,
): Promise<null | typeof SubscriptionsTable.$inferSelect> {
    const [row] = await db
        .select()
        .from(SubscriptionsTable)
        .where(eq(SubscriptionsTable.userId, userId))
        .limit(1);

    if (!row) return null; // or throw new Error("Subscription not found")

    return row;
}
