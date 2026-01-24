import { UserTable } from "@/drizzle/schema/user";
import { createdAt } from "@/drizzle/schemaHelpers";
import { relations } from "drizzle-orm";
import { pgTable, text, uuid, varchar } from "drizzle-orm/pg-core";

export const CVSTable = pgTable("cvs", {
    id: uuid().defaultRandom().primaryKey(),
    userId: varchar({ length: 255 })
        .notNull()
        .references(() => UserTable.id, { onDelete: "cascade" }),
    storagePath: text(),
    filename: varchar({ length: 255 }).notNull(),
    createdAt: createdAt,
    plainText: text().notNull(),
});

export const cvsRelations = relations(CVSTable, ({ one }) => ({
    user: one(UserTable, {
        fields: [CVSTable.userId],
        references: [UserTable.id],
    }),
}));
