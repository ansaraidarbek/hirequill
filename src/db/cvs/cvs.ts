import { db } from "@/drizzle/db";
import { CVSTable } from "@/drizzle/schema/cvs";
import { revalidateCVCache } from "../cache/cv";
import { eq } from "drizzle-orm";

export async function insertCV(cv: typeof CVSTable.$inferInsert) {
    // Upsert by unique userId (requires unique constraint/index on cvs.user_id)
    await db.insert(CVSTable).values(cv).onConflictDoUpdate({
        target: CVSTable.userId,
        set: cv,
    });

    revalidateCVCache(cv.userId);
}

export async function updateCV(
    userId: string,
    cv: Partial<typeof CVSTable.$inferInsert>,
) {
    await db.update(CVSTable).set(cv).where(eq(CVSTable.userId, userId));
    revalidateCVCache(userId);
}

export async function deleteCV(userId: string) {
    await db.delete(CVSTable).where(eq(CVSTable.userId, userId));
    revalidateCVCache(userId);
}
