import { beforeEach, describe, expect, test, vi } from "vitest";
import { buscarCardapioSemana } from "../buscarCardapioSemana";
import { db } from "@/lib/db/db";

vi.mock("@/lib/db/db", () => ({
  db: { select: vi.fn() },
}));

describe("Testes Unitários: buscarCardapioSemana", () => {
  beforeEach(() => { vi.clearAllMocks(); });

  test("deve retornar uma estrutura com exatos 7 dias", async () => {
    const whereMock = vi.fn().mockResolvedValueOnce([]);
    const innerJoinMock = vi.fn().mockReturnValue({ where: whereMock });
    const fromMock = vi.fn().mockReturnValue({ innerJoin: innerJoinMock });
    vi.mocked(db.select).mockReturnValue({ from: fromMock } as never);

    const resultado = await buscarCardapioSemana(0);
    expect(resultado).toHaveLength(7);
  });

  test("deve agrupar corretamente os pratos retornados do banco", async () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-08-16T12:00:00.000Z"));

    const retornoDoBanco = [
      { data: "2026-08-10", campo: "panificacao", idPrato: "p1", nome: "Pão de Queijo" },
      { data: "2026-08-10", campo: "prato_principal_padrao_almoco", idPrato: "p2", nome: "Estrogonofe" }
    ];

    const whereMock = vi.fn().mockResolvedValueOnce(retornoDoBanco);
    const innerJoinMock = vi.fn().mockReturnValue({ where: whereMock });
    const fromMock = vi.fn().mockReturnValue({ innerJoin: innerJoinMock });
    vi.mocked(db.select).mockReturnValue({ from: fromMock } as never);

    const resultado = await buscarCardapioSemana(0);
    
    // Procura o item de 10 de Agosto (index 0)
    const diaComCardapio = resultado.find((d) => d.data.dia === 10 && d.data.mes === 8 && d.data.ano === 2026);

    expect(diaComCardapio).toBeDefined();
    expect(diaComCardapio?.panificacao).toEqual([{ idPrato: "p1", nome: "Pão de Queijo" }]);
    expect(diaComCardapio?.prato_principal_padrao_almoco).toEqual([{ idPrato: "p2", nome: "Estrogonofe" }]);
    vi.useRealTimers();
  });
});