"use server"

import {db} from "@/lib/db/db";
import { avaliacao, cardapioDiarioItem, prato } from "@/lib/db/schema";
import { and, eq } from "drizzle-orm";

export type PratoRanking = {
    idPrato: string;
    nome: string;
    media: number;
    totalAvaliacoes: number;
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
    ranking: PratoRanking[];
    estatisticas: EstatisticasGerais;
    distribuicao: Distribuicao[];
};

// Função principal

export async function buscarRankingAvaliacoes(): Promise<RankingCompleto> {
    //Busca as avaliações do principal do almoço daquela data
    const resultados = await db
        .select({
            idPrato: prato.idPrato,
            nome: prato.nome,
            nota: avaliacao.nota,
        })
        .from(avaliacao)
        .innerJoin(
            cardapioDiarioItem,
            and(
                eq(avaliacao.fkCardapioDiario, cardapioDiarioItem.data),
                eq(cardapioDiarioItem.campo, "prato_principal_padrao_almoco")
            )
        )
        .innerJoin(prato, eq(cardapioDiarioItem.idPrato, prato.idPrato));
    
    //Agrupa as notas por prato
    const pratoMap = new Map<string, { nome: string; notas: number[] }>();

    for (const item of resultados) {
        if (!pratoMap.has(item.idPrato)) {
            pratoMap.set(item.idPrato, { nome: item.nome, notas: [] });
        }
        pratoMap.get(item.idPrato)!.notas.push(Number(item.nota));
    }

    //Calcula as médias e monta o ranking
    const ranking: PratoRanking[] = Array.from(pratoMap.entries())
        .map(([idPrato, { nome, notas }]) => {
            const soma = notas.reduce((acumulador, nota) => acumulador + nota, 0);
            const media = Number((soma / notas.length).toFixed(1));
            return {
                idPrato,
                nome,
                media,
                totalAvaliacoes: notas.length,
            };
        })
        .sort((a, b) => b.media - a.media);

        //Calcula estatísticas gerais
        const todasAsNotas = resultados.map((r) => Number(r.nota));
        const totalAvaliacoes = todasAsNotas.length;

        const somaGeral = todasAsNotas.reduce((acumulador, nota) => acumulador + nota, 0);
        const mediaGeral = totalAvaliacoes > 0
            ? Number((somaGeral / totalAvaliacoes).toFixed(1)) : 0;

        const estatisticas: EstatisticasGerais = {
            mediaGeral,
            totalAvaliacoes,
            totalPratos: pratoMap.size,
            melhorAvaliado: ranking[0]?.nome ?? "-",
        };

        //Calcula a distribuição por estrelas
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

        return { ranking, estatisticas, distribuicao };
}
