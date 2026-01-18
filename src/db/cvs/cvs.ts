import { pgTable, text, timestamp, uuid, varchar } from "drizzle-orm/pg-core";
import { supabaseAdmin } from "../client";
import { revalidateCVCache } from "../cache/cv";

export const CVSTable = pgTable("cvs", {
    id: uuid("id").defaultRandom().primaryKey(),
    userId: varchar("user_id", { length: 255 }).notNull(),
    storagePath: text("storage_path").notNull(),
    filename: varchar("filename", { length: 255 }).notNull(),
    createdAt: timestamp("created_at", { withTimezone: true })
        .defaultNow()
        .notNull(),
});

export async function insertCV(cv: typeof CVSTable.$inferInsert) {
    const { error } = await supabaseAdmin
        .from("cvs")
        .upsert(cv, { onConflict: "id" });

    if (error) throw error;
    if (cv.id) {
        revalidateCVCache(cv.id);
    }
}

export async function updateCV(
    id: string,
    cv: Partial<typeof CVSTable.$inferInsert>,
) {
    const { error } = await supabaseAdmin.from("cvs").update(cv).eq("id", id);
    if (error) throw error;
    revalidateCVCache(id);
}

export async function deleteCV(id: string) {
    const { error } = await supabaseAdmin.from("cvs").delete().eq("id", id);
    if (error) throw error;
    revalidateCVCache(id);
}
