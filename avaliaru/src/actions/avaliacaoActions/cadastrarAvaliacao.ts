"use server";

import { db } from "@/lib/db/db";
import { avaliacao, prato } from "@/lib/db/schema";

export async function cadastrarAvaliacao({
    nota,
    comentario,
    dataHoraAvaliacao,
    statusModeracao,
    fkEstudante,
    fkCardapioDiario
}: {
    nota: number;
    comentario?: string;
    dataHoraAvaliacao: Date;
    statusModeracao: boolean;
    fkEstudante: string;
    fkCardapioDiario: string;
}) {
    if (nota == null || nota == undefined) {
        throw new Error('O campo "nota" é obrigatório.');
    }

    if (fkCardapioDiario == "") {
        throw new Error("O campo ID do cardápio diário é obrigatório.");
    }

    if (fkEstudante == "") {
        throw new Error("O campo ID do estudante é obrigatório.");
    }

    const result = await db.insert(avaliacao)
    .values({
        nota,
        comentario: comentario || null,
        dataHoraAvaliacao,
        statusModeracao,
        fkEstudante,
        fkCardapioDiario
    })

    return result
}