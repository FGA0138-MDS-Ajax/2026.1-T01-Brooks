"use server";

import { db } from "@/lib/db/db";
import { avaliacao, cardapioDiarioItem, prato } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

// Removido o 'export' para não quebrar o build do Next.js
const ROTULOS_CAMPOS: Record<string, string> = {
  prato_principal_padrao_almoco:              "Prato Principal (Almoço)",
  prato_principal_ovolactovegetariano_almoco: "Ovolactovegetariano (Almoço)",
  prato_principal_vegetariano_estrito_almoco: "Vegetariano (Almoço)",
  guarnicao:                                  "Guarnição",
  sobremesa_almoco:                           "Sobremesa (Almoço)",
  prato_principal_padrao_jantar:              "Prato Principal (Jantar)",
  prato_principal_ovolactovegetariano_jantar: "Ovolactovegetariano (Jantar)",
  prato_principal_vegetariano_estrito_jantar: "Vegetariano (Jantar)",
  sopa:                                       "Sopa",
  sobremesa_jantar:                           "Sobremesa (Jantar)",
  fruta:                                      "Fruta",
  panificacao:                                "Panificação",
  opcao_extra:                                "Opção Extra",
  complemento_padrao_cafe:                    "Complemento (Café)",
  complemento_ovolactovegetariano_cafe:       "Ovolactovegetariano (Café)",
  complemento_vegetariano_estrito_cafe:       "Vegetariano (Café)",
};

export type PratoRanking = {
    idPrato: string;
    nome: string;
    media: number;
    totalAvaliacoes: number;
};

export type CategoriaRanking = {
    campo: string;
    rotulo: string;
    ranking: PratoRanking[];
};

export type Distribuicao = {
    estrelas: number;
    quantidade: number;
    percentual: number;
};

export type EstatisticasGerais = {
    mediaGeral: number;
    totalAvaliacoes: number;
    totalPratos: number;
    melhorAvaliado: string;
};

export type RankingCompleto = {
    categorias: CategoriaRanking[];
    estatisticas: EstatisticasGerais;
    distribuicao: Distribuicao[];
};

// Função principal

export async function buscarRankingAvaliacoes(): Promise<RankingCompleto> {
    // Busca as avaliações puras, sem fazer join
    const avaliacoesPuras = await db
        .select({ nota: avaliacao.nota })
        .from(avaliacao);

    // Join completo, sem filtro
    const resultados = await db
        .select({
            campo: cardapioDiarioItem.campo,
            idPrato: prato.idPrato,
            nome: prato.nome,
            nota: avaliacao.nota,
        })
        .from(avaliacao)
        .innerJoin(
            cardapioDiarioItem,
            eq(avaliacao.fkCardapioDiario, cardapioDiarioItem.data),
        )
        .innerJoin(prato, eq(cardapioDiarioItem.idPrato, prato.idPrato));
    
    // Agrupamento: campo -> prato -> notas
    const porCategoria = new Map<string, Map<string, { nome: string; notas: number[] }>>();

    for (const item of resultados) {
        if (!porCategoria.has(item.campo)) {
            porCategoria.set(item.campo, new Map());
        }
        const categoriaMapa = porCategoria.get(item.campo)!;

        if (!categoriaMapa.has(item.idPrato)) {
            categoriaMapa.set(item.idPrato, { nome: item.nome, notas: [] })
        }

        categoriaMapa.get(item.idPrato)!.notas.push(Number(item.nota));
    }

    // Calcula as médias e monta as categorias com ranking
    const ordemCampos = Object.keys(ROTULOS_CAMPOS);

    const categorias: CategoriaRanking[] = Array.from(porCategoria.entries())
        .map(([campo, pratosMapa]) => {
            const ranking: PratoRanking[] = Array.from(pratosMapa.entries())
                .map(([idPrato, { nome, notas }]) => {
                    const soma = notas.reduce((acumulador, nota) => acumulador + nota, 0);
                    return {
                        idPrato,
                        nome,
                        media: Number((soma / notas.length).toFixed(1)),
                        totalAvaliacoes: notas.length,
                    };
                })
                .sort((a, b) => b.media - a.media);

                return {
                    campo,
                    rotulo: ROTULOS_CAMPOS[campo] ?? campo,
                    ranking,
                };
        })
        .sort((a, b) => ordemCampos.indexOf(a.campo) - ordemCampos.indexOf(b.campo));

        // Calcula estatísticas gerais
        const todasAsNotas = avaliacoesPuras.map((a) => Number(a.nota));
        const totalAvaliacoes = todasAsNotas.length;
        const somaGeral = todasAsNotas.reduce((acumulador, nota) => acumulador + nota, 0);
        const mediaGeral = totalAvaliacoes > 0 ? Number((somaGeral / totalAvaliacoes).toFixed(1)) : 0;
        
        // MELHOR AVALIADO: prato com a maior média de todas as categorias
        const todosOsPratos = categorias.flatMap((c) => c.ranking);
        const melhorPrato = [...todosOsPratos].sort((a, b) => b.media - a.media)[0];

        const estatisticas: EstatisticasGerais = {
            mediaGeral,
            totalAvaliacoes,
            totalPratos: new Set(resultados.map((r) => r.idPrato)).size,
            melhorAvaliado: melhorPrato?.nome ?? "—",
        };

        // Calcula a distribuição por estrelas usando avaliacoesPuras
        const contagemPorEstrela: Record<number, number> = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
        for (const nota of todasAsNotas) {
            const estrelas = Math.round(nota);
            if (estrelas >= 1 && estrelas <= 5) {
                contagemPorEstrela[estrelas]++;
            }
        }

        const maiorContagem = Math.max(...Object.values(contagemPorEstrela), 1);
        const distribuicao: Distribuicao[] = [5, 4, 3, 2, 1].map((estrelas) => ({
            estrelas,
            quantidade: contagemPorEstrela[estrelas],
            percentual: Math.round((contagemPorEstrela[estrelas] / maiorContagem) * 100),
        }));

        return { categorias, estatisticas, distribuicao };
}