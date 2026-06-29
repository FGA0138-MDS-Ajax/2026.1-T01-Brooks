import { beforeEach, afterEach, describe, expect, test } from "vitest";
import { db } from "@/lib/db/db";
import { prato } from "@/lib/db/schema";
import { verificarCodigoPrato } from "../verificarCodigoPrato";
import { eq } from "drizzle-orm";

describe("Testes de Integração: verificarCodigoPrato", () => {
  const ID_PRATO = "cod-verificacao-01";

  beforeEach(async () => {
    await db.delete(prato).where(eq(prato.idPrato, ID_PRATO)).catch(() => {});
  });

  afterEach(async () => {
    await db.delete(prato).where(eq(prato.idPrato, ID_PRATO)).catch(() => {});
  });

  test("deve retornar 1 após inserir o prato real no banco", async () => {
    await db.insert(prato).values({ idPrato: ID_PRATO, nome: "Macarrão" });

    const qtd = await verificarCodigoPrato({ codigo: ID_PRATO });
    expect(qtd).toBe(1);
  });

  test("deve retornar 0 para um código que nunca foi inserido", async () => {
    const qtd = await verificarCodigoPrato({ codigo: "CODIGO_INEXISTENTE_99" });
    expect(qtd).toBe(0);
  });
});