import { pgTable, varchar } from "drizzle-orm/pg-core";
import { createdAt, updatedAt } from "../schemaHelpers";
import { revalidateUserCache } from "../cache/user";
import { supabaseAdmin } from "../client";

export const UserTable = pgTable("users", {
    id: varchar().primaryKey(),
    name: varchar().notNull(),
    imageUrl: varchar().notNull(),
    email: varchar().notNull().unique(),
    createdAt,
    updatedAt,
});

export async function insertUser(user: typeof UserTable.$inferInsert) {
    const { error } = await supabaseAdmin
        .from("profiles")
        .upsert(user, { onConflict: "id" });

    if (error) throw error;
    revalidateUserCache(user.id);
}

export async function updateUser(
    id: string,
    user: Partial<typeof UserTable.$inferInsert>
) {
    const { error } = await supabaseAdmin
        .from("profiles")
        .update(user)
        .eq("id", id);
    if (error) throw error;
    revalidateUserCache(id);
}

export async function deleteUser(id: string) {
    const { error } = await supabaseAdmin
        .from("profiles")
        .delete()
        .eq("id", id);
    if (error) throw error;
    revalidateUserCache(id);
}
