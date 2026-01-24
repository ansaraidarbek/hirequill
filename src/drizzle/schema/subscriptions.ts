import { pgTable, varchar, timestamp, pgEnum } from "drizzle-orm/pg-core";
import { UserTable } from "@/drizzle/schema/user";
import { updatedAt } from "@/drizzle/schemaHelpers";
import { relations } from "drizzle-orm";

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
    providerSubscriptionId: varchar({
        length: 255,
    }),
    plan: planEnum().notNull(),
    status: varchar(),
    currentPeriodStart: timestamp({ withTimezone: true })
        .defaultNow()
        .notNull(),
    currentPeriodEnd: timestamp({ withTimezone: true }),
    dayStarted: dayStartedEnum().notNull(),
    updatedAt: updatedAt,
});

export const subscriptionsRelations = relations(
    SubscriptionsTable,
    ({ one }) => ({
        user: one(UserTable, {
            fields: [SubscriptionsTable.userId],
            references: [UserTable.id],
        }),
    }),
);
