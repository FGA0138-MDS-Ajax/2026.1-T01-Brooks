"use server";

import { db } from "@/lib/db/db";
import { estudantePossuiRestricao } from "@/lib/db/schema";
import { and, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function removerRestricao({ restricaoId, fkEstudante }: { restricaoId: string, fkEstudante: string }) {

    return await removerRestricaoBanco({ restricaoId, fkEstudante });
}

export async function removerRestricaoBanco({ restricaoId, fkEstudante }: { restricaoId: string, fkEstudante: string }) {
    try {
        await db.delete(estudantePossuiRestricao).where(
            and(
                eq(estudantePossuiRestricao.fkEstudante, fkEstudante),
                eq(estudantePossuiRestricao.fkRestricao, restricaoId)
            )
        );

        try {
            revalidatePath("/gestao/pratos");
        } catch (e) {
            // Ignora erro de revalidação se estiver fora do contexto Next.js (ex: testes)
            console.warn("Aviso: revalidatePath ignorado no ambiente de teste.");
        }

        return { success: true };
    } catch (error) {
        console.error(error);
        throw new Error("Erro ao salvar no banco de dados.");
    }

}

