import { describe, test, expect, beforeEach } from "vitest";
import { inserirPratoNoBanco } from "../cadastrarPrato";
import { inserirPratoDoDiaNoBanco } from "../cadastrarPratoDoDia";
import { db } from "@/lib/db/db";
import { cardapioDiario, cardapioDiarioItem, prato } from "@/lib/db/schema";
import { eq, and } from "drizzle-orm";

describe("Testes de Prato do Dia", () => {
  const testPratoId = "PRATO_TESTE_001";
  const refeicaoTeste = "almoço";
  const dataFormatada = "2026-06-20";

  // O beforeEach roda ANTES do teste, limpando qualquer sujeira de execuções passadas
  beforeEach(async () => {
    // 1. Limpa o item do cardápio diário antigo
    await db.delete(cardapioDiarioItem).where(
      and(
        eq(cardapioDiarioItem.data, dataFormatada),
        eq(cardapioDiarioItem.campo, refeicaoTeste)
      )
    ).catch(() => {});

    // 2. Limpa o prato base para evitar o UNIQUE constraint failed
    await db.delete(prato).where(eq(prato.idPrato, testPratoId)).catch(() => {});
  });

  test("deve cadastrar o prato do dia com sucesso", async () => {
    console.log("Iniciando teste de cadastrarPratoDoDia...");

    // Criar o registro do dia na tabela pai se não existir
    await db.insert(cardapioDiario).values({ data: dataFormatada }).catch(() => {});

    console.log("Tentando cadastrar prato base no banco...");
    await inserirPratoNoBanco(testPratoId, "Prato de Teste Automatizado");

    console.log("Limpando registro antigo para o teste rodar limpo...");

    const result = await inserirPratoDoDiaNoBanco(testPratoId, refeicaoTeste);
    
    expect(result.success).toBe(true);
  });
});