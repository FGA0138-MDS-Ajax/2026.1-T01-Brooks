import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db/db";
import { restricaoAlimentar } from "@/lib/db/schema";
import { eq, or } from "drizzle-orm";
import { auth } from "@/auth";

export async function POST(request:NextRequest) {
    try{
        const session = await auth()

        // Verifica se o usuário está autenticado
        if (!session || !session.user) {
            return NextResponse.json(
                {erro: "Você precisa estar autenticado para realizar esta ação"},
                {status: 401});
        }

        // Verifica se o usuário autenticado é o gestor
        if (session.user.perfil !== 'gestorru') {
            return NextResponse.json(
                {erro: "Acesso Negado"}, 
                {status: 403});
        }

        const body = await request.json();
        const { codigo, nome} = body;

        if (!codigo || !nome) {
            return NextResponse.json (
                {erro: "Os campos código e nome são obrigatórios"}, 
                {status: 400}
            );
        }

        const restricaoExistente = await db
        .select()
        .from(restricaoAlimentar)
        .where(or(eq(restricaoAlimentar.codigo, codigo),
        eq(restricaoAlimentar.nome, nome)))
        .limit(1);

        if (restricaoExistente.length > 0) {
            const existente = restricaoExistente[0];
            let erro = '';

            if (existente.codigo == codigo) {
                erro = `Já existe uma restrição com o código '${codigo}'.`;
            }

            if (existente.nome == nome) {
                erro = `Já existe uma restrição com o nome '${nome}'.`
            }

            return NextResponse.json(
                {erro},
                {status: 409});

        }

        const novaRestricao = await db
        .insert(restricaoAlimentar)
        .values({codigo, nome})
        .returning();

        return NextResponse.json(
            {mensagem: "Restrição alimentar cadastrada com sucesso!",
            restricao: novaRestricao[0]
            },
            {status: 201});

    } catch (error) {
        console.error('Erro ao cadastrar restrição:', error);
        return NextResponse.json(
            {erro: "Erro interno no servidor"},
            {status: 501});
    }
}

