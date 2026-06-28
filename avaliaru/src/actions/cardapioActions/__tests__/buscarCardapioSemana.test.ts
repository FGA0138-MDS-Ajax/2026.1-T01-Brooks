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
    // Simula o banco não retornando nenhum prato para a semana
    const whereMock = vi.fn().mockResolvedValueOnce([]);
    const innerJoinMock = vi.fn().mockReturnValue({ where: whereMock });
    const fromMock = vi.fn().mockReturnValue({ innerJoin: innerJoinMock });
    vi.mocked(db.select).mockReturnValue({ from: fromMock } as never);

    const resultado = await buscarCardapioSemana(0);

    expect(resultado).toHaveLength(7); // Segunda a Domingo
    
    // Verifica a estrutura básica do primeiro dia (Segunda-feira)
    expect(resultado[0]).toHaveProperty("data");
    expect(resultado[0]).toHaveProperty("panificacao");
    expect(resultado[0].panificacao).toEqual([]);
    expect(resultado[0]).toHaveProperty("prato_principal_padrao_almoco");
  });

  test("deve agrupar corretamente os pratos retornados do banco por dia", async () => {
    // 1. Congelamos o tempo para garantir que o teste rode igual independente do dia real
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-06-28T12:00:00.000Z")); // Fixado num domingo

    // Como fixamos hoje no dia 28 (Domingo), a função vai buscar a partir do dia 22 (Segunda-feira)
    const dataIso = "2026-06-22";

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

    // Encontra o dia correspondente ao mock (dia 22)
    const diaComCardapio = resultado.find(
      (d) => d.data.ano === 2026 && d.data.mes === 6 && d.data.dia === 22
    );

    expect(diaComCardapio).toBeDefined();
    expect(diaComCardapio?.panificacao).toEqual([{ idPrato: "p1", nome: "Pão de Queijo" }]);
    expect(diaComCardapio?.prato_principal_padrao_almoco).toEqual([{ idPrato: "p2", nome: "Estrogonofe" }]);
    expect(diaComCardapio?.sopa).toEqual([]); // Campo que não veio do banco deve estar vazio

    // 2. Restaura o relógio normal ao final do teste
    vi.useRealTimers();
  });
});