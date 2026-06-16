"use server";

import { db } from "@/lib/db/db";
import { users } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

export async function atualizarDados(name: string, email: string, userId: string) {
    const result = await db
        .update(users)
        .set({ name, email })
        .where(eq(users.id, userId));
    
    return result
}