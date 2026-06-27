"use server";

import { db } from "@/lib/db/db";
import { estudantePossuiRestricao } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

export async function buscarRestricoesEstudante(userId: string) {
    const restricoesEstudante = await buscarRestricoesEstudanteBanco({fkEstudante: userId})

    const restricoesLista = restricoesEstudante.map((item) => item.fkRestricao)

    return restricoesLista
}

export async function buscarRestricoesEstudanteBanco({fkEstudante}: {fkEstudante: string}) {
    const result = await db.select().from(estudantePossuiRestricao).where(eq(estudantePossuiRestricao.fkEstudante, fkEstudante)).all()
    return result
}