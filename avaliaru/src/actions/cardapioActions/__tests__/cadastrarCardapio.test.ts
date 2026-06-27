/* eslint-disable @typescript-eslint/no-explicit-any */
import { inserirCardapioNoBanco } from "../cadastrarCardapio";
import { db } from "@/lib/db/db";
import { prato, cardapioDiario, cardapioDiarioItem } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

async function testCadastrarCardapio() {
  console.log("Iniciando teste de cadastrarCardapio...");

  // runMigrations(); // comentada para evitar conflito de histórico

  const ID_PRATO_TESTE = "PRATO_MOCK_TESTE";
  const DATA_TESTE = "2026-06-20";
  
  console.log("Cadastrando prato base de teste no banco...");
  try {
    await db.insert(prato).values({
      idPrato: ID_PRATO_TESTE,
      nome: "Item de Teste do Cardápio",
    });
  } catch (e) {
    // Ignora se o prato já existir
  }

  try {
    await db.insert(cardapioDiario).values({ data: DATA_TESTE });
  } catch (e) {
    // Ignora se a data já estiver registrada
  }

  // Limpa os registros antigos desta data de teste para permitir re-execução livre
  console.log(`Limpando itens antigos da data ${DATA_TESTE} para o teste rodar limpo...`);
  await db.delete(cardapioDiarioItem).where(eq(cardapioDiarioItem.data, DATA_TESTE));

  const values = {
    data: DATA_TESTE,
    panificacao: ID_PRATO_TESTE,
    opcao_extra: ID_PRATO_TESTE,
    complemento_padrao_cafe: ID_PRATO_TESTE,
    complemento_ovolactovegetariano_cafe: ID_PRATO_TESTE,
    complemento_vegetariano_estrito_cafe: ID_PRATO_TESTE,
    fruta: ID_PRATO_TESTE,
    prato_principal_padrao_almoco: ID_PRATO_TESTE,
    prato_principal_ovolactovegetariano_almoco: ID_PRATO_TESTE,
    prato_principal_vegetariano_estrito_almoco: ID_PRATO_TESTE,
    guarnicao: ID_PRATO_TESTE,
    sobremesa_almoco: ID_PRATO_TESTE,
    prato_principal_padrão_jantar: ID_PRATO_TESTE,
    prato_principal_ovolactovegetariano_jantar: ID_PRATO_TESTE,
    prato_principal_vegetariano_estrito_jantar: ID_PRATO_TESTE,
    sopa: ID_PRATO_TESTE,
    sobremesa_jantar: ID_PRATO_TESTE,
  };

  try {
    const result = await inserirCardapioNoBanco(values);
    console.log("Resultado:", result);
  } catch (error: any) {
    console.error("Erro no teste:", error.message || error);
  }
}

testCadastrarCardapio();