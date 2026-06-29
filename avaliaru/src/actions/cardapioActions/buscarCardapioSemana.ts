"use server";

import { db } from "@/lib/db/db";
import { cardapioDiarioItem, prato } from "@/lib/db/schema";
import { and, eq, gte, lte } from "drizzle-orm";
import { CardapioSemanal, CardapioDiario } from "@/types/types";

export async function buscarCardapioSemana(indexSemana: number = 0): Promise<CardapioSemanal> {
  const hoje = new Date();
  // Calcula o início da semana (segunda-feira) em UTC
  const diaDaSemana = hoje.getUTCDay();
  const diasParaSegunda = diaDaSemana === 0 ? -6 : 1 - diaDaSemana;
  
  const segundaBase = new Date(Date.UTC(hoje.getUTCFullYear(), hoje.getUTCMonth(), hoje.getUTCDate()));
  segundaBase.setUTCDate(segundaBase.getUTCDate() + diasParaSegunda + (indexSemana * 7));

  // Gera as datas de início e fim da semana
  const segundaDesejada = new Date(segundaBase.getTime());
  const domingoDesejado = new Date(segundaBase.getTime());
  domingoDesejado.setUTCDate(domingoDesejado.getUTCDate() + 6);

  const dataInicio = segundaDesejada.toISOString().split("T")[0];
  const dataFim = domingoDesejado.toISOString().split("T")[0];

  const resultados = await db
    .select({
      data: cardapioDiarioItem.data,
      campo: cardapioDiarioItem.campo,
      idPrato: prato.idPrato,
      nome: prato.nome,
    })
    .from(cardapioDiarioItem)
    .innerJoin(prato, eq(prato.idPrato, cardapioDiarioItem.idPrato))
    .where(and(gte(cardapioDiarioItem.data, dataInicio), lte(cardapioDiarioItem.data, dataFim)));

  const cardapioPorData = new Map<string, CardapioDiario>();

  for (const item of resultados) {
    if (!cardapioPorData.has(item.data)) {
      const [ano, mes, dia] = item.data.split("-").map(Number);
      cardapioPorData.set(item.data, {
        data: { dia, mes, ano },
        panificacao: [], opcao_extra: [],
        complemento_padrao_cafe: [], complemento_ovolactovegetariano_cafe: [], complemento_vegetariano_estrito_cafe: [],
        fruta: [],
        prato_principal_padrao_almoco: [], prato_principal_ovolactovegetariano_almoco: [], prato_principal_vegetariano_estrito_almoco: [],
        guarnicao: [], sobremesa_almoco: [],
        prato_principal_padrao_jantar: [], prato_principal_ovolactovegetariano_jantar: [], prato_principal_vegetariano_estrito_jantar: [],
        sopa: [], sobremesa_jantar: [],
      });
    }

    const diaObj = cardapioPorData.get(item.data)!;
    const campoKey = item.campo as keyof Omit<CardapioDiario, "data">;
    if (diaObj[campoKey]) {
      diaObj[campoKey]!.push({ idPrato: item.idPrato, nome: item.nome });
    }
  }

  const cardapioSemanal: CardapioSemanal = [];
  for (let i = 0; i < 7; i++) {
    const dataIteracao = new Date(segundaDesejada.getTime());
    dataIteracao.setUTCDate(dataIteracao.getUTCDate() + i);
    const dataISO = dataIteracao.toISOString().split("T")[0];
    
    const diaExistente = cardapioPorData.get(dataISO);
    if (diaExistente) {
      cardapioSemanal.push(diaExistente);
    } else {
      const [ano, mes, dia] = dataISO.split("-").map(Number);
      cardapioSemanal.push({
        data: { dia, mes, ano },
        panificacao: [], opcao_extra: [],
        complemento_padrao_cafe: [], complemento_ovolactovegetariano_cafe: [], complemento_vegetariano_estrito_cafe: [],
        fruta: [],
        prato_principal_padrao_almoco: [], prato_principal_ovolactovegetariano_almoco: [], prato_principal_vegetariano_estrito_almoco: [],
        guarnicao: [], sobremesa_almoco: [],
        prato_principal_padrao_jantar: [], prato_principal_ovolactovegetariano_jantar: [], prato_principal_vegetariano_estrito_jantar: [],
        sopa: [], sobremesa_jantar: [],
      });
    }
  }

  return cardapioSemanal;
}