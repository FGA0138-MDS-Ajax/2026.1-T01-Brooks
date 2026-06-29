import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { eq } from "drizzle-orm";
import { enviarNotificacaoEmail } from "@/lib/emailService";
import { 
  users, 
  estudanteFavoritaPrato, 
  prato, 
  cardapioDiarioItem, 
  restricaoContemPrato, 
  estudantePossuiRestricao, 
  restricaoAlimentar 
} from "@/lib/db/schema";

export async function GET(request: Request) {
  try {
    // 1. VERIFICAÇÃO DE SEGURANÇA (AWS EventBridge)
    const authHeader = request.headers.get("authorization");
    const cronSecret = process.env.CRON_SECRET;

    if (authHeader !== `Bearer ${cronSecret}`) {
      return NextResponse.json({ error: "Acesso não autorizado" }, { status: 401 });
    }

    // 2. DATA DE HOJE
    // Formato exato do seu banco: "YYYY-MM-DD"
    const hoje = new Date();
    const dataFormatada = hoje.toLocaleDateString("pt-BR", { timeZone: "America/Sao_Paulo" }).split('/').reverse().join('-');

    // 3. CONSULTA 1: ESTUDANTES QUE FAVORITARAM OS PRATOS DE HOJE
    const alunosFavoritos = await db
      .select({
        email: users.email,
        nomePrato: prato.nome,
        campo: cardapioDiarioItem.campo
      })
      .from(cardapioDiarioItem)
      .innerJoin(estudanteFavoritaPrato, eq(cardapioDiarioItem.idPrato, estudanteFavoritaPrato.fkPrato))
      .innerJoin(users, eq(estudanteFavoritaPrato.fkEstudante, users.id))
      .innerJoin(prato, eq(cardapioDiarioItem.idPrato, prato.idPrato))
      .where(eq(cardapioDiarioItem.data, dataFormatada));

    // 4. CONSULTA 2: ESTUDANTES COM RESTRIÇÃO AOS PRATOS DE HOJE
    const alunosEmRisco = await db
      .select({
        email: users.email,
        nomePrato: prato.nome,
        nomeRestricao: restricaoAlimentar.nome,
      })
      .from(cardapioDiarioItem)
      .innerJoin(restricaoContemPrato, eq(cardapioDiarioItem.idPrato, restricaoContemPrato.fkPrato))
      .innerJoin(estudantePossuiRestricao, eq(restricaoContemPrato.fkRestricao, estudantePossuiRestricao.fkRestricao))
      .innerJoin(users, eq(estudantePossuiRestricao.fkEstudante, users.id))
      .innerJoin(prato, eq(cardapioDiarioItem.idPrato, prato.idPrato))
      .innerJoin(restricaoAlimentar, eq(restricaoContemPrato.fkRestricao, restricaoAlimentar.codigo))
      .where(eq(cardapioDiarioItem.data, dataFormatada));

    // Se não houver cardápio ou alertas para hoje, encerra silenciosamente
    if (alunosFavoritos.length === 0 && alunosEmRisco.length === 0) {
      return NextResponse.json({ message: `Cardápio de ${dataFormatada} verificado. Nenhuma notificação pendente.` });
    }

    // 5. PREPARAÇÃO DOS DISPAROS (FAVORITOS)
    const disparosFavoritos = alunosFavoritos.map(async (aluno) => {
      if (aluno.email) {
        return enviarNotificacaoEmail({
          para: aluno.email,
          assunto: `⭐ O seu favorito está no cardápio de hoje!`,
          corpoHtml: `
            <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #1b4d3e; border-radius: 8px;">
              <h2 style="color: #1b4d3e;">Boas notícias do AvaliaRU!</h2>
              <p>Olá! O prato <strong>${aluno.nomePrato}</strong> foi confirmado como <em>${aluno.campo}</em> no cardápio de hoje.</p>
              <p>Fique atento aos horários de funcionamento e bom apetite!</p>
            </div>
          `,
        });
      }
    });

// 6. PREPARAÇÃO DOS DISPAROS (RESTRIÇÕES)
    const disparosRestricoes = alunosEmRisco.map(async (aluno) => {
      if (aluno.email) {
        return enviarNotificacaoEmail({
          para: aluno.email,
          assunto: `⚠️ Alerta de Restrição Alimentar: ${aluno.nomeRestricao}`, // Emoji genérico fixo
          corpoHtml: `
            <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #d9534f; border-radius: 8px;">
              <h2 style="color: #d9534f;">Aviso de Segurança - AvaliaRU</h2>
              <p>Olá! Identificamos que o prato <strong>${aluno.nomePrato}</strong> do cardápio de hoje contém componentes associados à sua restrição: <strong>${aluno.nomeRestricao}</strong>.</p>
              <p>Recomendamos extrema cautela ao consumir os alimentos do RU hoje.</p>
            </div>
          `,
        });
      }
    });

    // 7. EXECUTA TODOS OS ENVIOS EM SEGUNDO PLANO
    await Promise.allSettled([...disparosFavoritos, ...disparosRestricoes]);

    return NextResponse.json({ 
      message: `Varredura concluída. ${alunosFavoritos.length} favoritos notificados e ${alunosEmRisco.length} alertas de restrição enviados.` 
    });

  } catch (error) {
    console.error("Erro na Rota Cron:", error);
    return NextResponse.json({ error: "Erro interno do servidor ao processar a varredura." }, { status: 500 });
  }
}