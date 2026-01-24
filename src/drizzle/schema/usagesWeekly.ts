import {
    pgTable,
    varchar,
    date,
    integer,
    primaryKey,
} from "drizzle-orm/pg-core";
import { UserTable } from "@/drizzle/schema/user";
import { relations } from "drizzle-orm";

export const UserCompanyUsageWeekTable = pgTable(
    "user_company_usage_week",
    {
        userId: varchar({ length: 255 })
            .notNull()
            .references(() => UserTable.id, { onDelete: "cascade" }),
        weekStart: date().notNull(),
        companyKey: varchar({ length: 255 }).notNull(),
        count: integer().notNull().default(0),
    },
    (table) => [
        primaryKey({
            columns: [table.userId, table.weekStart, table.companyKey],
        }),
    ],
);

export const usagesWeeklyRelations = relations(
    UserCompanyUsageWeekTable,
    ({ one }) => ({
        user: one(UserTable, {
            fields: [UserCompanyUsageWeekTable.userId],
            references: [UserTable.id],
        }),
    }),
);
