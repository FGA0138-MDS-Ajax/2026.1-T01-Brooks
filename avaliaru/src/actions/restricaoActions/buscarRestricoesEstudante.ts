"use server";

import { db } from "@/lib/db/db";
import { estudantePossuiRestricao } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

export async function buscarRestricoesEstudante({fkEstudante}: {fkEstudante: string}) {
    const result = await db.select().from(estudantePossuiRestricao).where(eq(estudantePossuiRestricao.fkEstudante, fkEstudante)).all()
    return result
}