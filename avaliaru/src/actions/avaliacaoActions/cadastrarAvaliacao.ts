"use server";

import { db } from "@/lib/db/db";
import { avaliacao, prato } from "@/lib/db/schema";

export async function cadastrarAvaliacao({
    nota,
    comentario,
    dataHoraAvaliacao,
    statusModeracao,
    fkPratoDoDia,
    fkEstudante
}: {
    nota: 0 | 1 | 2 | 3 | 4 | 5;
    comentario?: string;
    dataHoraAvaliacao: Date;
    statusModeracao: boolean;
    fkPratoDoDia: string;
    fkEstudante: string;
    fkPrato: string;
}) {
    if (nota == null || nota == undefined) {
        throw new Error('O campo "nota" é obrigatório.');
    }

    if (fkPrato == "") {
        throw new Error("O campo ID do prato do dia é obrigatório.");
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
        fkPrato
    })

    return result
}