import { beforeEach, afterEach, describe, expect, test } from "vitest";
import { db } from "@/lib/db/db";
import { prato } from "@/lib/db/schema";
import { inserirPratoNoBanco } from "../cadastrarPrato";
import { eq } from "drizzle-orm";

describe("Testes de Integração: cadastrarPrato", () => {
  const ID_PRATO = "prato-int-01";

  beforeEach(async () => {
    await db.delete(prato).where(eq(prato.idPrato, ID_PRATO)).catch(() => {});
  });

  afterEach(async () => {
    await db.delete(prato).where(eq(prato.idPrato, ID_PRATO)).catch(() => {});
  });

  test("deve salvar o prato no banco de dados corretamente", async () => {
    const resultado = await inserirPratoNoBanco(ID_PRATO, "Feijoada de Integração");
    
    expect(resultado.success).toBe(true);

    const pratosSalvos = await db.select().from(prato).where(eq(prato.idPrato, ID_PRATO)).all();
    expect(pratosSalvos).toHaveLength(1);
    expect(pratosSalvos[0].nome).toBe("Feijoada de Integração");
  });
});