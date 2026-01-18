import { pgTable, varchar, timestamp, date } from "drizzle-orm/pg-core";
import { supabaseAdmin } from "../client";
import { revalidateSubscriptionsCache } from "../cache/subscriptions";

export const SubscriptionsTable = pgTable("subscriptions", {
    userId: varchar("user_id", { length: 255 }).primaryKey(),
    providerSubsc: varchar("provider_subsc", { length: 255 }),
    plan: varchar("plan", { length: 100 }),
    status: varchar("status", { length: 50 }),
    currentPeriodStart: timestamp("current_period_start", {
        withTimezone: true,
    }),
    currentPeriodEnd: timestamp("current_period_end", { withTimezone: true }),
    dayStarted: date("day_started"),
    updatedAt: timestamp("updated_at", { withTimezone: true })
        .defaultNow()
        .notNull(),
});

export async function insertSubscription(
    
) {}

export async function updateSubscription() {}

export async function deleteSubscription(userId: string) {}

export async function getSubscriptionByUserId(userId: string) {
    const { data, error } = await supabaseAdmin
        .from("subscriptions")
        .select("*")
        .eq("user_id", userId)
        .single();
    if (error) throw error;
    return data as typeof SubscriptionsTable.$inferSelect;
}
