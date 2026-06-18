"use server";

import { db } from "@/lib/db/db";
import { cardapioDiario } from "@/lib/db/schema";
import { and, gte, lte } from "drizzle-orm";
import { CardapioSemanal } from "@/types/types";

export async function buscarCardapioSemana(indexSemana: number = 0): Promise<CardapioSemanal> {
  // 1. Calcula a segunda-feira da semana atual
  const hoje = new Date();
  const diaDaSemana = hoje.getDay(); // 0 = domingo, 1 = segunda, ..., 6 = sábado

  // Ajusta para chegar na segunda-feira
  const diasParaSegunda = diaDaSemana === 0 ? -6 : 1 - diaDaSemana;

  const segundaAtual = new Date(hoje);
  segundaAtual.setDate(hoje.getDate() + diasParaSegunda);

  // 2. Aplica o deslocamento de semanas (indexSemana)
  const segundaDesejada = new Date(segundaAtual);
  segundaDesejada.setDate(segundaAtual.getDate() + indexSemana * 7);

  // 3. Calcula o domingo da semana desejada
  const domingoDesejado = new Date(segundaDesejada);
  domingoDesejado.setDate(segundaDesejada.getDate() + 6);

  // 4. Formata as datas no padrão do banco (YYYY-MM-DD)
  const dataInicio = segundaDesejada.toISOString().split("T")[0];
  const dataFim = domingoDesejado.toISOString().split("T")[0];

  // 5. Busca apenas os cardápios da semana desejada (eficiente)
  const resultados = db
    .select()
    .from(cardapioDiario)
    .where(
      and(
        gte(cardapioDiario.data, dataInicio),
        lte(cardapioDiario.data, dataFim)
      )
    )
    .all();

  // 6. Monta o array final na ordem correta (segunda a domingo)
  const cardapioSemanal: CardapioSemanal = [];

  for (let i = 0; i < 7; i++) {
    const dataAtual = new Date(segundaDesejada);
    dataAtual.setDate(segundaDesejada.getDate() + i);

    const dataISO = dataAtual.toISOString().split("T")[0];

    const cardapioDoDia = resultados.find((c) => c.data === dataISO);

    if (cardapioDoDia) {
      cardapioSemanal.push({
        data: {
          dia: dataAtual.getDate(),
          mes: dataAtual.getMonth() + 1,
          ano: dataAtual.getFullYear(),
        },
        panificacao: cardapioDoDia.panificacao,
        opcao_extra: cardapioDoDia.opcao_extra,
        complemento_padrao_cafe: cardapioDoDia.complemento_padrao_cafe,
        complemento_ovolactovegetariano_cafe: cardapioDoDia.complemento_ovolactovegetariano_cafe,
        complemento_vegetariano_estrito_cafe: cardapioDoDia.complemento_vegetariano_estrito_cafe,
        fruta: cardapioDoDia.fruta,

        prato_principal_padrao_almoco: cardapioDoDia.prato_principal_padrao_almoco,
        prato_principal_ovolactovegetariano_almoco: cardapioDoDia.prato_principal_ovolactovegetariano_almoco,
        prato_principal_vegetariano_estrito_almoco: cardapioDoDia.prato_principal_vegetariano_estrito_almoco,
        guarnicao: cardapioDoDia.guarnicao,
        sobremesa_almoco: cardapioDoDia.sobremesa_almoco,

        prato_principal_padrao_jantar: cardapioDoDia.prato_principal_padrao_jantar,
        prato_principal_ovolactovegetariano_jantar: cardapioDoDia.prato_principal_ovolactovegetariano_jantar,
        prato_principal_vegetariano_estrito_jantar: cardapioDoDia.prato_principal_vegetariano_estrito_jantar,
        sopa: cardapioDoDia.sopa,
        sobremesa_jantar: cardapioDoDia.sobremesa_jantar,
      });
    }
  }

  return cardapioSemanal;
}