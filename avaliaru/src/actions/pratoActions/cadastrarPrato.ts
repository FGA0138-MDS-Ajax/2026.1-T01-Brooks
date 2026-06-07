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

    try {

        await db.insert(prato).values({
            idPrato: codigo,
            nome: nome
        });

        revalidatePath("/gestao/pratos");

        return { success: true};
    } catch(error) {
        console.error(error);
        throw new Error("Erro ao salvar no banco de dados.");
    }

}