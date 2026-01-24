import { UserTable } from "@/drizzle/schema/user";
import { revalidateUserCache } from "../cache/user";
import { db } from "@/drizzle/db";
import { eq } from "drizzle-orm";

export async function insertUser(user: typeof UserTable.$inferInsert) {
    await db.insert(UserTable).values(user).onConflictDoUpdate({
        target: UserTable.id,
        set: user,
    });
    revalidateUserCache(user.id);
}

export async function updateUser(
    id: string,
    user: Partial<typeof UserTable.$inferInsert>,
) {
    await db.update(UserTable).set(user).where(eq(UserTable.id, id));
    revalidateUserCache(id);
}

export async function deleteUser(id: string) {
    await db.delete(UserTable).where(eq(UserTable.id, id));
    revalidateUserCache(id);
}

export async function getUser(userId: string) {
    const [user] = await db
        .select()
        .from(UserTable)
        .where(eq(UserTable.id, userId));

    if (!user) {
        throw new Error("User not found");
    }
    return user as typeof UserTable.$inferSelect;
}
