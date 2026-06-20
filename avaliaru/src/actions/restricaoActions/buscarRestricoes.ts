"use server";

import { db } from "@/lib/db/db";
import { restricaoAlimentar } from "@/lib/db/schema";

export async function buscarRestricoes() {
    return await buscarRestricoesBanco()
}

export async function buscarRestricoesBanco() {
    const result = await db.select().from(restricaoAlimentar).all()
    return result
}