import { beforeEach, afterEach, describe, expect, test, vi } from "vitest";
import { db } from "@/lib/db/db";
import { cardapioDiario, cardapioDiarioItem, prato } from "@/lib/db/schema";
import { buscarCardapioSemana } from "../buscarCardapioSemana";
import { inArray } from "drizzle-orm"; // <-- Importação nova aqui

describe("Testes de Integração: buscarCardapioSemana", () => {
  const DATA_SISTEMA_FIXA = "2026-06-28T12:00:00.000Z";

  // Agrupamos os IDs e Datas que criaremos neste teste
  const DATAS_TESTE = ["2026-06-22", "2026-06-23", "2026-06-29"];
  const PRATOS_TESTE = ["p-arroz", "p-frango", "p-suco", "p-sopa"];

  beforeEach(async () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date(DATA_SISTEMA_FIXA));

    // Limpa APENAS os registros que vamos usar, para não dar conflito 
    // de chave estrangeira com dados inseridos por outros arquivos de teste.
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

    expect(resultado[0].data).toEqual({ dia: 22, mes: 6, ano: 2026 });
    expect(resultado[0].prato_principal_padrao_almoco).toEqual([]);
    expect(resultado[0].panificacao).toEqual([]);

    expect(resultado[6].data).toEqual({ dia: 28, mes: 6, ano: 2026 });
  });

  test("deve buscar, realizar o Join com pratos e agrupar os itens corretamente por dia da semana", async () => {
    const DATA_SEGUNDA = "2026-06-22";
    const DATA_TERCA = "2026-06-23";

    await db.insert(prato).values([
      { idPrato: "p-arroz", nome: "Arroz Integral" },
      { idPrato: "p-frango", nome: "Frango Assado" },
      { idPrato: "p-suco", nome: "Suco de Laranja" },
    ]);

    await db.insert(cardapioDiario).values([
      { data: DATA_SEGUNDA },
      { data: DATA_TERCA },
    ]);

    await db.insert(cardapioDiarioItem).values([
      { data: DATA_SEGUNDA, campo: "prato_principal_padrao_almoco", idPrato: "p-frango" },
      { data: DATA_SEGUNDA, campo: "opcao_extra", idPrato: "p-arroz" },
      { data: DATA_TERCA, campo: "fruta", idPrato: "p-suco" },
    ]);

    const resultado = await buscarCardapioSemana(0);

    expect(resultado).toHaveLength(7);

    const segunda = resultado[0];
    expect(segunda.data).toEqual({ dia: 22, mes: 6, ano: 2026 });
    expect(segunda.prato_principal_padrao_almoco).toEqual([{ idPrato: "p-frango", nome: "Frango Assado" }]);
    expect(segunda.opcao_extra).toEqual([{ idPrato: "p-arroz", nome: "Arroz Integral" }]);
    expect(segunda.sopa).toEqual([]); 

    const terca = resultado[1];
    expect(terca.data).toEqual({ dia: 23, mes: 6, ano: 2026 });
    expect(terca.fruta).toEqual([{ idPrato: "p-suco", nome: "Suco de Laranja" }]);
    expect(terca.prato_principal_padrao_almoco).toEqual([]);
  });

  test("deve avançar semanas corretamente ao passar indexSemana igual a 1", async () => {
    const DATA_PROX_SEGUNDA = "2026-06-29";

    await db.insert(prato).values({ idPrato: "p-sopa", nome: "Canja de Galinha" });
    await db.insert(cardapioDiario).values({ data: DATA_PROX_SEGUNDA });
    await db.insert(cardapioDiarioItem).values({
      data: DATA_PROX_SEGUNDA,
      campo: "sopa",
      idPrato: "p-sopa",
    });

    const resultado = await buscarCardapioSemana(1);

    expect(resultado).toHaveLength(7);

    const primeiroDiaProximaSemana = resultado[0];
    expect(primeiroDiaProximaSemana.data).toEqual({ dia: 29, mes: 6, ano: 2026 });
    expect(primeiroDiaProximaSemana.sopa).toEqual([{ idPrato: "p-sopa", nome: "Canja de Galinha" }]);
  });
});