"use server";

import { db } from "@/lib/db/db";
import { prato } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

export async function verificarCodigoPrato({codigo}: {codigo: string}) {
    const result = db.select().from(prato).where(eq(prato.idPrato, codigo)).all()

    return result.length
}