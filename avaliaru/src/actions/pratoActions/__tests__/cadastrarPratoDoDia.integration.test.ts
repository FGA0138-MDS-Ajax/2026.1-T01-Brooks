import { describe, test, expect, beforeEach, vi, afterEach } from "vitest";
import { inserirPratoDoDiaNoBanco } from "../cadastrarPratoDoDia";
import { db } from "@/lib/db/db";
import { cardapioDiario, cardapioDiarioItem, prato } from "@/lib/db/schema";
import { eq, and } from "drizzle-orm";

describe("Testes de Prato do Dia", () => {
  const testPratoId = "PRATO_TESTE_001";
  const refeicaoTeste = "almoço"; // ou "jantar"
  const dataTeste = new Date("2026-06-20T12:00:00.000Z");
  const dataFormatada = "2026-06-20";

  // O beforeEach roda ANTES do teste, limpando qualquer sujeira de execuções passadas
  beforeEach(async () => {
    // Controla o tempo para que a action use uma data determinística
    vi.useFakeTimers();
    vi.setSystemTime(dataTeste);

    // 1. Limpa o item do cardápio que referencia o prato (quebra a FK)
    await db.delete(cardapioDiarioItem).where(eq(cardapioDiarioItem.idPrato, testPratoId)).catch(() => {});
    // 2. Limpa o prato base
    await db.delete(prato).where(eq(prato.idPrato, testPratoId)).catch(() => {});
    // 3. Limpa o cardápio do dia do teste
    await db.delete(cardapioDiario).where(eq(cardapioDiario.data, dataFormatada)).catch(() => {});
  });

  afterEach(() => {
    // Restaura os timers reais após cada teste
    vi.useRealTimers();
  });

  test("deve cadastrar o prato do dia com sucesso", async () => {
    // Arrange: Prepara o estado do banco de dados para o teste
    // 1. Insere o prato base que será referenciado.
    await db.insert(prato).values({
      idPrato: testPratoId,
      nome: "Prato de Teste Automatizado",
    });

    // 2. Garante que o registro do cardápio diário pai exista para a data do teste.
    await db.insert(cardapioDiario).values({ data: dataFormatada }).onConflictDoNothing();

    // Act: Executa a função que está sendo testada.
    // Como usamos `setSystemTime`, a action `inserirPratoDoDiaNoBanco` usará a data "2026-06-20".
    const result = await inserirPratoDoDiaNoBanco(testPratoId, refeicaoTeste);

    // Assert: Verifica se o resultado foi o esperado
    expect(result.success).toBe(true);
  });
});