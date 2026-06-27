"use server";

import { db } from "@/lib/db/db";
import { prato } from "@/lib/db/schema";

export async function buscarPratos() {
    const result = db.select().from(prato).all()
    return result
}