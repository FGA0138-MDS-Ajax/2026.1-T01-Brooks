import { beforeEach, describe, expect, test, vi } from "vitest";
import { buscarCardapioSemana } from "../buscarCardapioSemana";
import { db } from "@/lib/db/db";

vi.mock("@/lib/db/db", () => ({
  db: {
    select: vi.fn(),
  },
}));

describe("Testes Unitários: buscarCardapioSemana", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test("deve retornar uma estrutura com exatos 7 dias, mesmo se o banco estiver vazio", async () => {
    const whereMock = vi.fn().mockResolvedValueOnce([]);
    const innerJoinMock = vi.fn().mockReturnValue({ where: whereMock });
    const fromMock = vi.fn().mockReturnValue({ innerJoin: innerJoinMock });
    vi.mocked(db.select).mockReturnValue({ from: fromMock } as never);

    const resultado = await buscarCardapioSemana(0);

    expect(resultado).toHaveLength(7);
    expect(resultado[0]).toHaveProperty("data");
    expect(resultado[0].panificacao).toEqual([]);
    expect(resultado[0]).toHaveProperty("prato_principal_padrao_almoco");
  });

  test("deve agrupar corretamente os pratos retornados do banco por dia", async () => {
    // 1. Congela o tempo para garantir que o teste seja determinístico
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-08-16T12:00:00.000Z")); // Domingo

    const dataIso = "2026-08-10"; // Segunda-feira correspondente

    const retornoDoBanco = [
      {
        data: dataIso,
        campo: "panificacao",
        idPrato: "p1",
        nome: "Pão de Queijo",
      },
      {
        data: dataIso,
        campo: "prato_principal_padrao_almoco",
        idPrato: "p2",
        nome: "Estrogonofe",
      }
    ];

    const whereMock = vi.fn().mockResolvedValueOnce(retornoDoBanco);
    const innerJoinMock = vi.fn().mockReturnValue({ where: whereMock });
    const fromMock = vi.fn().mockReturnValue({ innerJoin: innerJoinMock });
    vi.mocked(db.select).mockReturnValue({ from: fromMock } as never);

    const resultado = await buscarCardapioSemana(0);

    // Encontra o dia correspondente ao mock (dia 10 de Agosto de 2026)
    const diaComCardapio = resultado.find(
      (d) => d.data.ano === 2026 && d.data.mes === 8 && d.data.dia === 10
    );

    expect(diaComCardapio).toBeDefined();
    expect(diaComCardapio?.panificacao).toEqual([{ idPrato: "p1", nome: "Pão de Queijo" }]);
    expect(diaComCardapio?.prato_principal_padrao_almoco).toEqual([{ idPrato: "p2", nome: "Estrogonofe" }]);
    expect(diaComCardapio?.sopa).toEqual([]); 

    vi.useRealTimers();
  });
});