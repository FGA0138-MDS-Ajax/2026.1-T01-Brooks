"use server";

import { auth } from "@/auth";
import { db } from "@/lib/db/db";
import { prato } from "@/lib/db/schema";
import { revalidatePath } from "next/cache";

export async function cadastrarPrato(formData: FormData) {
    const session = await auth();
    
    if (!session || !session.user) {
        throw new Error("Não autorizado.");
    }

    const perfil = (session.user as any).role; 

    const temAcesso = perfil === "gestorru" || perfil === "adm";

    if (!temAcesso) {
        throw new Error("Acesso negado: você não tem permissão.");
    }

    const codigo = formData.get("codigo") as string;
    const nome = formData.get("nome") as string;

    return await inserirPratoNoBanco(codigo, nome);
}

/** Função de lógica pura para o banco de dados, testável isoladamente */
export async function inserirPratoNoBanco(codigo: string, nome: string) {
    try {
        await db.insert(prato).values({
            idPrato: codigo,
            nome: nome
        });

        try {
            revalidatePath("/gestao/pratos");
        } catch (e) {
            // Ignora erro de revalidação se estiver fora do contexto Next.js (ex: testes)
            console.warn("Aviso: revalidatePath ignorado no ambiente de teste.");
        }

        return { success: true};
    } catch(error) {
        console.error(error);
        throw new Error("Erro ao salvar no banco de dados.");
    }

}