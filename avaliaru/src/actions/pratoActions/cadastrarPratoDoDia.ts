"use server";

import { auth } from "@/auth";
import { db } from "@/lib/db/db";
import { cardapioDiario, cardapioDiarioItem } from "@/lib/db/schema";
import { and, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function cadastrarPratoDoDia(formData: FormData) {
    const session = await auth();
    
    if (!session || !session.user) {
        throw new Error("Não autorizado.");
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const perfil = (session.user as any).perfil; 
    const temAcesso = perfil === "gestorru" || perfil === "adm";

    if (!temAcesso) {
        throw new Error("Acesso negado: você não tem permissão.");
    }

    const fkPrato = formData.get("idPrato") as string;
    const refeicao = formData.get("refeicao") as "café" | "almoço" | "jantar";

    // Validação de presença
    if (!fkPrato || !refeicao) {
        throw new Error("Preencha todos os campos obrigatórios.");
    }

    return await inserirPratoDoDiaNoBanco(fkPrato, refeicao);
}

/** Função de lógica pura para o banco de dados, testável isoladamente */
export async function inserirPratoDoDiaNoBanco(fkPrato: string, refeicao: "café" | "almoço" | "jantar") {
    try {
        const hoje = new Date();
        const dia = String(hoje.getDate()).padStart(2, '0');
        const mes = String(hoje.getMonth() + 1).padStart(2, '0');
        const ano = hoje.getFullYear();
        
        // Formata a data para "YYYY-MM-DD"
        const dataFormatada = `${ano}-${mes}-${dia}`;

        // 1. Garante de forma segura que o registro do dia pai existe na tabela cardapioDiario
        try {
            await db.insert(cardapioDiario).values({ data: dataFormatada });
        } catch (e) {
            // Ignora se a data já estiver registrada no dev.db
        }

        // 2. Remove qualquer prato alocado nesta mesma refeição de hoje
        // Isso resolve o conflito de PRIMARY KEY/UNIQUE composta do SQLite
        await db.delete(cardapioDiarioItem).where(
            and(
                eq(cardapioDiarioItem.data, dataFormatada),
                eq(cardapioDiarioItem.campo, refeicao)
            )
        );

        // 3. Insere o novo registro com segurança
        await db.insert(cardapioDiarioItem).values({
            data: dataFormatada,
            campo: refeicao,
            idPrato: fkPrato
        });

        // Revalida as páginas que dependem dos dados do cardápio
        try {
            revalidatePath("/gestao/cardapio");
            revalidatePath("/dashboard");
        } catch (e) {
            console.warn("Aviso: revalidatePath ignorado no ambiente de teste.");
        }

        return { success: true };
    } catch(error) {
        console.error(error);
        if (error instanceof Error) {
            throw error;
        }
        throw new Error("Erro ao salvar no banco de dados.");
    }
}