"use server";

import { db } from "@/lib/db/db";
import { estudanteFavoritaPrato } from "@/lib/db/schema";
import { Session, User } from "next-auth";
import { revalidatePath } from "next/cache";

export async function adicionarFavorito(idPrato: string, session: Session) {
    if (!session || !session.user) {
        throw new Error("Não autorizado.");
    }

    const perfil = (session.user as User & { id: string; perfil: string }).perfil;

    const temAcesso = perfil === "aluno";

    if (!temAcesso) {
        throw new Error("Acesso negado: somente alunos podem adicionar favoritos.");
    }

    return await adicionarPratoFavoritoBanco(session, idPrato);

}

export async function adicionarPratoFavoritoBanco(session: Session, idPrato: string) {
    try {
        await db.insert(estudanteFavoritaPrato).values({
            fkEstudante: session.user.id,
            fkPrato: idPrato,
        }).onConflictDoNothing()
        .execute();

        try {
            revalidatePath("/dashboard/cardapio");
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