"use server";

import { db } from "@/lib/db/db";
import { cardapioDiario } from "@/lib/db/schema";
import { CardapioSemanal } from "@/types/types";
import { gte } from "drizzle-orm";

export async function buscarCardapioSemana(index_semana: number): Promise<CardapioSemanal | null> {
    const inicio_semana_atual = new Date();
    const dia_semana_atual = inicio_semana_atual.getDay();
    inicio_semana_atual.setDate(inicio_semana_atual.getDate() + (dia_semana_atual === 0 ? 1 : - (dia_semana_atual - 1)))
    const inicio_semana_atual_ISO = inicio_semana_atual.toISOString().split("T")[0];

    console.log("Inicio da semana atual: ", inicio_semana_atual.toLocaleDateString("pt-BR"));

    const result = db.select().from(cardapioDiario).where(gte(cardapioDiario.data, inicio_semana_atual_ISO)).all();

    const cardapioSemanal: CardapioSemanal = [];

    for (let i = 0; i < 7; i++) {
        const dataAtual = new Date(inicio_semana_atual);
        dataAtual.setDate(inicio_semana_atual.getDate() + i + (index_semana * 7));

        const dataFormatada = `${dataAtual.getDate().toString().padStart(2, "0")}/${(dataAtual.getMonth() + 1).toString().padStart(2, "0")}/${dataAtual.getFullYear()}`;

        const cardapioDoDia = result.find((cardapio) => cardapio.data === dataFormatada);

        if (cardapioDoDia) {
            cardapioSemanal.push({
                idPratoDoDia: cardapioDoDia.idCardapioDiario,
                data: cardapioDoDia.data,
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
                prato_principal_padrão_jantar: cardapioDoDia.prato_principal_padrão_jantar,
                prato_principal_ovolactovegetariano_jantar: cardapioDoDia.prato_principal_ovolactovegetariano_jantar,
                prato_principal_vegetariano_estrito_jantar: cardapioDoDia.prato_principal_vegetariano_estrito_jantar,
                sopa: cardapioDoDia.sopa,
                sobremesa_jantar: cardapioDoDia.sobremesa_jantar,
            });
        }
    }

    return cardapioSemanal
}