"use server";

import { db } from "@/lib/db/db";
import { restricaoAlimentar, estudantePossuiRestricao } from "@/lib/db/schema";
import { eq, inArray } from "drizzle-orm";

export async function salvarRestricoesEstudante({restricoesSelecionadas, fkEstudante}: {restricoesSelecionadas: string[], fkEstudante: string}) {
    //deletar os registros
    const response1 = await db.delete(estudantePossuiRestricao).where(eq(estudantePossuiRestricao.fkEstudante, fkEstudante))

    //inserir os novos registros
    const response2 = await db.insert(estudantePossuiRestricao).values(
        restricoesSelecionadas.map((restricao) => ({
            fkEstudante,
            fkRestricao: restricao
        }))
    )

    return { response1, response2 }
}