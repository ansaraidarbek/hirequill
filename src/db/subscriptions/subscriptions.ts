import { pgTable, varchar, timestamp, date, pgEnum } from "drizzle-orm/pg-core";
import { supabaseAdmin } from "../client";
import {
    getSubscriptionsIdTag,
    revalidateSubscriptionsCache,
} from "../cache/subscriptions";
import { UserTable } from "../users/user";

export const planEnum = pgEnum("plan_type", ["free", "monthly", "forever"]);
export const dayStartedEnum = pgEnum("day_started_type", [
    "monday",
    "tuesday",
    "wednesday",
    "thursday",
    "friday",
    "saturday",
    "sunday",
]);
export const SubscriptionsTable = pgTable("subscriptions", {
    userId: varchar()
        .primaryKey()
        .references(() => UserTable.id, { onDelete: "cascade" }),
    providerSubscriptionId: varchar("provider_subscription_id", {
        length: 255,
    }),
    plan: planEnum("plan").notNull(),
    status: varchar(),
    currentPeriodStart: timestamp("current_period_start", {
        withTimezone: true,
    }).notNull(),
    currentPeriodEnd: timestamp("current_period_end", { withTimezone: true }),
    dayStarted: dayStartedEnum("day_started").notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
        .defaultNow()
        .notNull(),
});

export async function insertSubscription(
    subscription: typeof SubscriptionsTable.$inferInsert,
) {
    const { error } = await supabaseAdmin
        .from("subscriptions")
        .upsert(subscription, { onConflict: "userId" });
    if (error) throw error;
    revalidateSubscriptionsCache(subscription.userId);
}

export async function updateSubscription(
    userId: string,
    subscription: Partial<typeof SubscriptionsTable.$inferInsert>,
) {
    const { error } = await supabaseAdmin
        .from("subscriptions")
        .update(subscription)
        .eq("userId", userId);
    if (error) throw error;
    revalidateSubscriptionsCache(userId);
}

export async function deleteSubscription(userId: string) {
    const { error } = await supabaseAdmin
        .from("subscriptions")
        .delete()
        .eq("userId", userId);
    if (error) throw error;
    revalidateSubscriptionsCache(userId);
}

export async function getSubscriptionByUserId(userId: string) {
    const { data, error } = await supabaseAdmin
        .from("subscriptions")
        .select("*")
        .eq("userId", userId)
        .single();
    if (error) throw error;
    return data as typeof SubscriptionsTable.$inferSelect;
}
