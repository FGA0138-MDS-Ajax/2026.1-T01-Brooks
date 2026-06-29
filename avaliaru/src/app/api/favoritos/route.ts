import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db"; 
import { estudanteFavoritaPrato, prato } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

export async function GET(request: NextRequest) {
  try {
    // 1. Pegando o ID da URL
    const { searchParams } = new URL(request.url);
    const usuarioId = searchParams.get("usuarioId");

    if (!usuarioId) {
      return NextResponse.json({ error: "Parâmetro usuarioId é obrigatório" }, { status: 400 });
    }

    // 2. Buscando no Banco de Dados (Sem aspas nas variáveis!)
    const favoritos = await db
      .select({
        idPrato: prato.idPrato,
        nomePrato: prato.nome,
      })
      .from(estudanteFavoritaPrato)
      .innerJoin(prato, eq(estudanteFavoritaPrato.fkPrato, prato.idPrato))
      .where(eq(estudanteFavoritaPrato.fkEstudante, usuarioId));

    // 3. Devolvendo o pacote em caso de Sucesso
    return NextResponse.json({ favoritos }, { status: 200 });

  } catch (error) {
    // 4. Tratamento do Erro (O que faltava para evitar o Error 500)
    console.error("Erro interno no servidor:", error);
    
    // O retorno obrigatório do Next.js!
    return NextResponse.json(
      { error: "Erro ao buscar a lista de favoritos no banco de dados." },
      { status: 500 }
    );
  }
}