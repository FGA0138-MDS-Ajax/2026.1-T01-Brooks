import { beforeEach, describe, expect, test, vi } from "vitest";
import { buscarPratos } from "../buscarPratos";
import { db } from "@/lib/db/db";

vi.mock("@/lib/db/db", () => ({
  db: { select: vi.fn() },
}));

describe("Testes Unitários: buscarPratos", () => {
  beforeEach(() => { vi.clearAllMocks(); });

  test("deve retornar a lista inteira de pratos cadastrados", async () => {
    const listaFalsa = [
      { idPrato: "p1", nome: "Arroz" },
      { idPrato: "p2", nome: "Feijão" }
    ];
    
    const allMock = vi.fn().mockResolvedValueOnce(listaFalsa);
    const fromMock = vi.fn().mockReturnValue({ all: allMock });
    vi.mocked(db.select).mockReturnValue({ from: fromMock } as never);

    const resultado = await buscarPratos();
    
    expect(resultado).toHaveLength(2);
    expect(resultado[0].nome).toBe("Arroz");
    expect(db.select).toHaveBeenCalledTimes(1);
  });
});