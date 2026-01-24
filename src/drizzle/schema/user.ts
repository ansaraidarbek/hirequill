import { pgTable, varchar, integer, date } from "drizzle-orm/pg-core";
import { createdAt, updatedAt } from "@/drizzle/schemaHelpers";
import { relations, sql } from "drizzle-orm";
import { CVSTable } from "./cvs";
import { UserCompanyUsageWeekTable } from "./usagesWeekly";
import { SubscriptionsTable } from "./subscriptions";

export const UserTable = pgTable("profiles", {
    id: varchar().primaryKey(),
    name: varchar().notNull(),
    imageUrl: varchar().notNull(),
    email: varchar().notNull().unique(),
    createdAt,
    updatedAt,
    totalGenerationsAllTime: integer().notNull(),
    totalFreeGenerationsThisMonth: integer().notNull().default(0),
    freeGenerationsMonth: date()
        .notNull()
        .default(sql`date_trunc('month', now())::date`),
});

export const userRelations = relations(UserTable, ({ one, many }) => ({
    cvs: one(CVSTable),
    subscriptions: one(SubscriptionsTable),
    usagesWeekly: many(UserCompanyUsageWeekTable),
}));
