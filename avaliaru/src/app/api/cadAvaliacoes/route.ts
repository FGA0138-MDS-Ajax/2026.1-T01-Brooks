import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { auth } from "@/auth";
import { avaliacao, users } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

export async function POST(request: NextRequest) {
    try {
        const session = await auth();

        if (!session?.user) {
            return NextResponse.json(
                { erro: "Você precisa estar autenticado para avaliar uma refeição." },
                { status: 401 }
            );
        }

        const userEmail = session.user.email;
        if (!userEmail) {
            return NextResponse.json(
                { erro: "E-mail do usuário não encontrado na sessão." },
                { status: 401 }
            );
        }

        const usuarioDb = await db
            .select()
            .from(users)
            .where(eq(users.email, userEmail))
            .limit(1);

        if (usuarioDb.length === 0) {
            return NextResponse.json(
                { erro: "Usuário não encontrado no banco de dados." },
                { status: 404 }
            );
        }

        const usuarioIdReal = usuarioDb[0].id;

        const body = await request.json();
        const { nota, comentario, idPratoDoDia } = body;

        if (nota == null || nota == undefined) {
            return NextResponse.json(
                { erro: 'O campo "nota" é obrigatório.' },
                { status: 400 }
            );
        }

        if (typeof nota !== 'number' || nota < 1 || nota > 5) {
            return NextResponse.json(
                { erro: "A nota deve ser um número inteiro entre 1 e 5" },
                { status: 400 }
            );
        }

        if (!idPratoDoDia) {
            return NextResponse.json(
                { erro: "O campo ID do prato do dia é obrigatório." },
                { status: 400 }
            );
        }

        const novaAvaliacao = await db
            .insert(avaliacao)
            .values({
                nota,
                comentario: comentario || null,
                dataHoraAvaliacao: new Date(),
                statusModeracao: false,
                fkEstudante: usuarioIdReal,
                fkCardapioDiario: idPratoDoDia
            })
            .returning();

        return NextResponse.json(
            {
                mensagem: "Avaliação Registrada com Sucesso!",
                avaliacao: novaAvaliacao[0]
            },
            { status: 201 }
        );

    } catch (error) {
        console.error('Erro ao cadastrar avaliação:', error);
        return NextResponse.json(
            { erro: 'Erro Interno no servidor.' },
            { status: 500 }
        );
    }
}