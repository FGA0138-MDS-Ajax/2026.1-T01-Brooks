"use server";

import { db } from "@/lib/db/db";
import { estudantePossuiRestricao } from "@/lib/db/schema";
import { revalidatePath } from "next/cache";

export async function salvarRestricaoEstudante({ restricaoId, fkEstudante }: { restricaoId: string, fkEstudante: string }) {
    return await salvarRestricaoBanco({ restricaoId, fkEstudante });
}

export async function salvarRestricaoBanco({ restricaoId, fkEstudante }: { restricaoId: string, fkEstudante: string }) {
    try {
        await await db.insert(estudantePossuiRestricao).values({
            fkEstudante,
            fkRestricao: restricaoId
        }).onConflictDoNothing().execute();

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