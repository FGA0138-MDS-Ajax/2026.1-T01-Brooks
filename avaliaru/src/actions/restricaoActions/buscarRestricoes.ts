"use server";

import { db } from "@/lib/db/db";
import { restricaoAlimentar } from "@/lib/db/schema";

export async function buscarRestricoes() {
    const result = await db.select().from(restricaoAlimentar).all()
    return result
}