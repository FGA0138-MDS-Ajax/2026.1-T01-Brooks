import { beforeEach, afterEach, describe, expect, test, vi } from "vitest";
import { db } from "@/lib/db/db";
import { cardapioDiario, cardapioDiarioItem, prato } from "@/lib/db/schema";
import { buscarCardapioSemana } from "../buscarCardapioSemana";
import { inArray } from "drizzle-orm";

describe("Testes de Integração: buscarCardapioSemana", () => {
  const DATAS_TESTE = ["2026-08-10", "2026-08-11", "2026-08-17"];
  const PRATOS_TESTE = ["p-arroz-t", "p-frango-t", "p-suco-t", "p-sopa-t"];

  beforeEach(async () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-08-16T12:00:00.000Z"));
    await db.delete(cardapioDiarioItem).where(inArray(cardapioDiarioItem.data, DATAS_TESTE)).catch(() => {});
    await db.delete(cardapioDiario).where(inArray(cardapioDiario.data, DATAS_TESTE)).catch(() => {});
    await db.delete(prato).where(inArray(prato.idPrato, PRATOS_TESTE)).catch(() => {});
  });

  afterEach(() => { vi.useRealTimers(); });

  test("deve retornar estrutura vazia de 7 dias", async () => {
    const res = await buscarCardapioSemana(0);
    expect(res).toHaveLength(7);
    expect(res[0].data).toEqual({ dia: 10, mes: 8, ano: 2026 });
  });

  test("deve agrupar itens corretamente", async () => {
    await db.insert(prato).values([
      { idPrato: "p-frango-t", nome: "Frango Assado" },
      { idPrato: "p-arroz-t", nome: "Arroz Integral" }
    ]);
    await db.insert(cardapioDiario).values([{ data: "2026-08-10" }]).onConflictDoNothing();
    await db.insert(cardapioDiarioItem).values([
      { data: "2026-08-10", campo: "prato_principal_padrao_almoco", idPrato: "p-frango-t" },
      { data: "2026-08-10", campo: "opcao_extra", idPrato: "p-arroz-t" }
    ]);

    const res = await buscarCardapioSemana(0);
    expect(res[0].prato_principal_padrao_almoco).toEqual([{ idPrato: "p-frango-t", nome: "Frango Assado" }]);
  });

  test("deve avançar semanas corretamente", async () => {
    await db.insert(prato).values({ idPrato: "p-sopa-t", nome: "Canja" });
    await db.insert(cardapioDiario).values({ data: "2026-08-17" }).onConflictDoNothing();
    await db.insert(cardapioDiarioItem).values({ data: "2026-08-17", campo: "sopa", idPrato: "p-sopa-t" });

    const res = await buscarCardapioSemana(1);
    expect(res[0].data).toEqual({ dia: 17, mes: 8, ano: 2026 });
    expect(res[0].sopa).toEqual([{ idPrato: "p-sopa-t", nome: "Canja" }]);
  });
});