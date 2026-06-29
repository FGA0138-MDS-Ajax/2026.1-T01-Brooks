import { beforeEach, describe, expect, test, vi } from "vitest";
import { verificarCodigoPrato } from "../verificarCodigoPrato";
import { db } from "@/lib/db/db";

vi.mock("@/lib/db/db", () => ({
  db: { select: vi.fn() },
}));

describe("Testes Unitários: verificarCodigoPrato", () => {
  beforeEach(() => { vi.clearAllMocks(); });

  test("deve retornar 1 se o código do prato existir no banco", async () => {
    // Trocado de mockResolvedValueOnce para mockReturnValueOnce
    // porque o método .all() do Drizzle no SQLite devolve os dados de forma síncrona
    const allMock = vi.fn().mockReturnValueOnce([{ idPrato: "123", nome: "Teste" }]);
    const whereMock = vi.fn().mockReturnValue({ all: allMock });
    const fromMock = vi.fn().mockReturnValue({ where: whereMock });
    vi.mocked(db.select).mockReturnValue({ from: fromMock } as never);

    const qtd = await verificarCodigoPrato({ codigo: "123" });
    expect(qtd).toBe(1);
  });

  test("deve retornar 0 se o código do prato não existir", async () => {
    // Trocado para mockReturnValueOnce
    const allMock = vi.fn().mockReturnValueOnce([]);
    const whereMock = vi.fn().mockReturnValue({ all: allMock });
    const fromMock = vi.fn().mockReturnValue({ where: whereMock });
    vi.mocked(db.select).mockReturnValue({ from: fromMock } as never);

    const qtd = await verificarCodigoPrato({ codigo: "999" });
    expect(qtd).toBe(0);
  });
});