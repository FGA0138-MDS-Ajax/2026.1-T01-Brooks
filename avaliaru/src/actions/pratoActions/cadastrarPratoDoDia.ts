"use server";

import { auth } from "@/auth";
import { db } from "@/lib/db/db";
import { pratoDoDia } from "@/lib/db/schema";
import { revalidatePath } from "next/cache";
import { DataDMA } from "@/types/types";

export async function cadastrarPratoDoDia(formData: FormData) {
    const session = await auth();
    
    if (!session || !session.user) {
        throw new Error("Não autorizado.");
    }

    const perfil = (session.user as any).role; 

    const temAcesso = perfil === "gestorru" || perfil === "adm";

    if (!temAcesso) {
        throw new Error("Acesso negado: você não tem permissão.");
    }

    const fkPrato = formData.get("idPrato") as string;
    const refeicao = formData.get("refeicao") as "café" | "almoço" | "jantar";

    // 1. Validação de presença
    if (!fkPrato || !refeicao) {
        throw new Error("Preencha todos os campos obrigatórios.");
    }

    return await inserirPratoDoDiaNoBanco(fkPrato, refeicao);
}

/** Função de lógica pura para o banco de dados, testável isoladamente */
export async function inserirPratoDoDiaNoBanco(fkPrato: string, refeicao: "café" | "almoço" | "jantar") {
    try {
        const hoje = new Date();
        const data: DataDMA = {
            dia: hoje.getDate(),
            mes: hoje.getMonth() + 1, // getMonth() retorna 0-11
            ano: hoje.getFullYear(),
        };

        await db.insert(pratoDoDia).values({
            refeicao,
            data,
            fkPrato: fkPrato
        });

        // Revalida as páginas que dependem dos dados do cardápio
        try {
            revalidatePath("/gestao/cardapio");
            revalidatePath("/dashboard");
        } catch (e) {
            // Ignora erro de revalidação no ambiente de teste
            console.warn("Aviso: revalidatePath ignorado no ambiente de teste.");
        }

        return { success: true};
    } catch(error) {
        console.error(error);
        if (error instanceof Error) {
            throw error; // Re-lança o erro específico para ser capturado pela UI
        }
        throw new Error("Erro ao salvar no banco de dados.");
    }

}