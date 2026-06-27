"use server";

import { db } from "@/lib/db/db";
import { estudanteFavoritaPrato } from "@/lib/db/schema";
import { and, eq } from "drizzle-orm";
import { Session, User } from "next-auth";
import { revalidatePath } from "next/cache";

export async function removerFavorito(idPrato: string, session: Session) {
    if (!session || !session.user) {
        throw new Error("Não autorizado.");
    }

    const perfil = (session.user as User & { id: string; perfil: string }).perfil;

    const temAcesso = perfil === "aluno";

    if (!temAcesso) {
        throw new Error("Acesso negado: somente alunos podem adicionar favoritos.");
    }

    return await removerPratoFavoritoBanco(session, idPrato);

}

export async function removerPratoFavoritoBanco(session: Session, idPrato: string) {
    try {
        await db.delete(estudanteFavoritaPrato)
            .where(
                and(
                    eq(estudanteFavoritaPrato.fkEstudante, session.user.id),
                    eq(estudanteFavoritaPrato.fkPrato, idPrato)
                )
            );

        try {
            revalidatePath("/dashboard/cardapio");
        } catch (e) {
            // Ignora erro de revalidação se estiver fora do contexto Next.js (ex: testes)
            console.warn("Aviso: revalidatePath ignorado no ambiente de teste.");
        }

        return { success: true };
    } catch (error) {
        console.error(error);
        throw new Error("Erro ao salvar no banco de dados." + error);
    }
}