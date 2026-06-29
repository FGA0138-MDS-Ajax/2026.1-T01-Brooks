import { beforeEach, afterEach, describe, expect, test, vi } from "vitest";
import { db } from "@/lib/db/db";
import { cardapioDiario, cardapioDiarioItem, prato } from "@/lib/db/schema";
import { buscarCardapioSemana } from "../buscarCardapioSemana";
import { inArray } from "drizzle-orm";

describe("Testes de Integração: buscarCardapioSemana", () => {
  // Movemos os testes para AGOSTO para não conflitar com as avaliações (que usam Junho)
  const DATA_SISTEMA_FIXA = "2026-08-16T12:00:00.000Z"; // Domingo

  const DATAS_TESTE = ["2026-08-10", "2026-08-11", "2026-08-17"];
  const PRATOS_TESTE = ["p-arroz-t", "p-frango-t", "p-suco-t", "p-sopa-t"];

  beforeEach(async () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date(DATA_SISTEMA_FIXA));

    await db.delete(cardapioDiarioItem).where(inArray(cardapioDiarioItem.data, DATAS_TESTE)).catch(() => {});
    await db.delete(cardapioDiario).where(inArray(cardapioDiario.data, DATAS_TESTE)).catch(() => {});
    await db.delete(prato).where(inArray(prato.idPrato, PRATOS_TESTE)).catch(() => {});
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  test("deve retornar uma estrutura vazia padrão com exatos 7 dias se o banco não tiver dados", async () => {
    const resultado = await buscarCardapioSemana(0);

    expect(resultado).toHaveLength(7);
    expect(resultado[0].data).toEqual({ dia: 10, mes: 8, ano: 2026 }); // Segunda
    expect(resultado[0].prato_principal_padrao_almoco).toEqual([]);
    expect(resultado[6].data).toEqual({ dia: 16, mes: 8, ano: 2026 }); // Domingo
  });

  test("deve buscar, realizar o Join com pratos e agrupar os itens corretamente por dia da semana", async () => {
    const DATA_SEGUNDA = "2026-08-10";
    const DATA_TERCA = "2026-08-11";

    await db.insert(prato).values([
      { idPrato: "p-arroz-t", nome: "Arroz Integral" },
      { idPrato: "p-frango-t", nome: "Frango Assado" },
      { idPrato: "p-suco-t", nome: "Suco de Laranja" },
    ]);

    await db.insert(cardapioDiario).values([
      { data: DATA_SEGUNDA },
      { data: DATA_TERCA },
    ]).onConflictDoNothing(); // Proteção contra execuções paralelas agressivas

    await db.insert(cardapioDiarioItem).values([
      { data: DATA_SEGUNDA, campo: "prato_principal_padrao_almoco", idPrato: "p-frango-t" },
      { data: DATA_SEGUNDA, campo: "opcao_extra", idPrato: "p-arroz-t" },
      { data: DATA_TERCA, campo: "fruta", idPrato: "p-suco-t" },
    ]);

    const resultado = await buscarCardapioSemana(0);

    expect(resultado).toHaveLength(7);
    const segunda = resultado[0];
    expect(segunda.data).toEqual({ dia: 10, mes: 8, ano: 2026 });
    expect(segunda.prato_principal_padrao_almoco).toEqual([{ idPrato: "p-frango-t", nome: "Frango Assado" }]);
    expect(segunda.opcao_extra).toEqual([{ idPrato: "p-arroz-t", nome: "Arroz Integral" }]);

    const terca = resultado[1];
    expect(terca.data).toEqual({ dia: 11, mes: 8, ano: 2026 });
    expect(terca.fruta).toEqual([{ idPrato: "p-suco-t", nome: "Suco de Laranja" }]);
  });

  test("deve avançar semanas corretamente ao passar indexSemana igual a 1", async () => {
    const DATA_PROX_SEGUNDA = "2026-08-17";

    await db.insert(prato).values({ idPrato: "p-sopa-t", nome: "Canja de Galinha" });
    await db.insert(cardapioDiario).values({ data: DATA_PROX_SEGUNDA }).onConflictDoNothing();
    await db.insert(cardapioDiarioItem).values({
      data: DATA_PROX_SEGUNDA,
      campo: "sopa",
      idPrato: "p-sopa-t",
    });

    const resultado = await buscarCardapioSemana(1);

    expect(resultado).toHaveLength(7);
    const primeiroDiaProximaSemana = resultado[0];
    expect(primeiroDiaProximaSemana.data).toEqual({ dia: 17, mes: 8, ano: 2026 });
    expect(primeiroDiaProximaSemana.sopa).toEqual([{ idPrato: "p-sopa-t", nome: "Canja de Galinha" }]);
  });
});