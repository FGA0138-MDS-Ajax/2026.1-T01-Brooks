/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, test, expect, beforeEach } from "vitest";
import { inserirCardapioNoBanco } from "../cadastrarCardapio";
import { db } from "@/lib/db/db";
import { prato, cardapioDiario, cardapioDiarioItem } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

describe("Testes de Cadastro de Cardápio", () => {
  const ID_PRATO_TESTE = "PRATO_MOCK_TESTE";
  const DATA_TESTE = "2026-06-20";

  // Roda antes do teste começar, garantindo banco limpo e sem conflitos de UNIQUE constraint
  beforeEach(async () => {
    // 1. Remove dependências de itens da data de teste
    await db.delete(cardapioDiarioItem).where(eq(cardapioDiarioItem.data, DATA_TESTE)).catch(() => {});
    
    // 2. Remove o registro pai da data de teste se houver
    await db.delete(cardapioDiario).where(eq(cardapioDiario.data, DATA_TESTE)).catch(() => {});
    
    // 3. Remove o prato mockado para reinseri-lo limpo
    await db.delete(prato).where(eq(prato.idPrato, ID_PRATO_TESTE)).catch(() => {});
  });

  test("deve cadastrar um cardápio completo com sucesso", async () => {
    console.log("Iniciando teste de cadastrarCardapio...");

    console.log("Cadastrando prato base de teste no banco...");
    await db.insert(prato).values({
      idPrato: ID_PRATO_TESTE,
      nome: "Item de Teste do Cardápio",
    });

    await db.insert(cardapioDiario).values({ data: DATA_TESTE });

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

    // Executa a action real
    const result = await inserirCardapioNoBanco(values);
    console.log("Resultado:", result);

    // Asserção do Vitest para validar o sucesso
    expect(result.success).toBe(true);
  });
});