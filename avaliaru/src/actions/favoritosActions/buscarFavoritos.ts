"use server";

import { db } from "@/lib/db/db";
import { estudanteFavoritaPrato, users } from "@/lib/db/schema";
import { and, eq } from "drizzle-orm";
import { Session, User } from "next-auth";
import { revalidatePath } from "next/cache";

export async function buscarFavoritos( session: Session) {
    if (!session || !session.user) {
        throw new Error("Não autorizado.");
    }

    const perfil = (session.user as User & { id: string; perfil: string }).perfil;

    const temAcesso = perfil === "aluno";

    if (!temAcesso) {
        throw new Error("Acesso negado: somente alunos podem adicionar favoritos.");
    }

    return await buscarFavoritosBanco(session.user.id);

}

export async function buscarFavoritosBanco(idEstudante: string) {
    try {
        const favoritos = await db.select().from(estudanteFavoritaPrato)
        .where(eq(estudanteFavoritaPrato.fkEstudante, idEstudante))
        .execute();

        const listaDeFavoritos = favoritos.map(favorito => favorito.fkPrato);

        return listaDeFavoritos;
    } catch (error) {
        console.error(error);
        throw new Error("Erro ao buscar favoritos no banco de dados." + error);
    }
}