"use server";

import { db } from "@/lib/db/db";
import { cardapioDiarioItem, prato } from "@/lib/db/schema";
import { and, eq, gte, lte } from "drizzle-orm";
import { CardapioSemanal, CardapioDiario } from "@/types/types";
import { formatarDataLocal } from "@/lib/utils";

export async function buscarCardapioSemana(indexSemana: number = 0): Promise<CardapioSemanal> {
  const hoje = new Date();
  const diaDaSemana = hoje.getDay();
  const diasParaSegunda = diaDaSemana === 0 ? -6 : 1 - diaDaSemana;

  const segundaAtual = new Date(hoje);
  segundaAtual.setDate(hoje.getDate() + diasParaSegunda);

  const segundaDesejada = new Date(segundaAtual);
  segundaDesejada.setDate(segundaAtual.getDate() + indexSemana * 7);

  const domingoDesejado = new Date(segundaDesejada);
  domingoDesejado.setDate(segundaDesejada.getDate() + 6);

  const dataInicio = formatarDataLocal(segundaDesejada);
  const dataFim = formatarDataLocal(domingoDesejado);

  // Busca com join no prato
  const resultados = await db
    .select({
      data: cardapioDiarioItem.data,
      campo: cardapioDiarioItem.campo,
      idPrato: prato.idPrato,
      nome: prato.nome,
    })
    .from(cardapioDiarioItem)
    .innerJoin(prato, eq(prato.idPrato, cardapioDiarioItem.idPrato))
    .where(
      and(
        gte(cardapioDiarioItem.data, dataInicio),
        lte(cardapioDiarioItem.data, dataFim)
      )
    );

  console.table(resultados.slice(0, 20));

  // Agrupamento
  const cardapioPorData = new Map<string, CardapioDiario>();

  for (const item of resultados) {
    if (!cardapioPorData.has(item.data)) {
      cardapioPorData.set(item.data, {
        data: {
          dia: new Date(item.data).getDate(),
          mes: new Date(item.data).getMonth() + 1,
          ano: new Date(item.data).getFullYear(),
        },
        panificacao: [],
        opcao_extra: [],
        complemento_padrao_cafe: [],
        complemento_ovolactovegetariano_cafe: [],
        complemento_vegetariano_estrito_cafe: [],
        fruta: [],
        prato_principal_padrao_almoco: [],
        prato_principal_ovolactovegetariano_almoco: [],
        prato_principal_vegetariano_estrito_almoco: [],
        guarnicao: [],
        sobremesa_almoco: [],
        prato_principal_padrao_jantar: [],
        prato_principal_ovolactovegetariano_jantar: [],
        prato_principal_vegetariano_estrito_jantar: [],
        sopa: [],
        sobremesa_jantar: [],
      });
    }

    const dia = cardapioPorData.get(item.data)!;
    const campoKey = item.campo as keyof Omit<CardapioDiario, "data">;

    if (!(campoKey in dia)) {
      console.warn(
        `Campo inválido encontrado no banco: ${item.campo}`
      );
      continue;
    }

    dia[campoKey]!.push({
      idPrato: item.idPrato,
      nome: item.nome,
    });
  }

  // Monta o array final
  const cardapioSemanal: CardapioSemanal = [];

  for (let i = 0; i < 7; i++) {
    const dataAtual = new Date(segundaDesejada);
    dataAtual.setDate(segundaDesejada.getDate() + i);
    const dataISO = formatarDataLocal(dataAtual);

    const dia = cardapioPorData.get(dataISO);

    cardapioSemanal.push(
      dia ?? {
        data: {
          dia: dataAtual.getDate(),
          mes: dataAtual.getMonth() + 1,
          ano: dataAtual.getFullYear(),
        },
        panificacao: [],
        opcao_extra: [],
        complemento_padrao_cafe: [],
        complemento_ovolactovegetariano_cafe: [],
        complemento_vegetariano_estrito_cafe: [],
        fruta: [],
        prato_principal_padrao_almoco: [],
        prato_principal_ovolactovegetariano_almoco: [],
        prato_principal_vegetariano_estrito_almoco: [],
        guarnicao: [],
        sobremesa_almoco: [],
        prato_principal_padrao_jantar: [],
        prato_principal_ovolactovegetariano_jantar: [],
        prato_principal_vegetariano_estrito_jantar: [],
        sopa: [],
        sobremesa_jantar: [],
      }
    );
  }

  return cardapioSemanal;
}