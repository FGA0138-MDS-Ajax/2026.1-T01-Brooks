import { beforeEach, afterEach, describe, expect, test } from "vitest";
import { db } from "@/lib/db/db";
import { prato } from "@/lib/db/schema";
import { buscarPratos } from "../buscarPratos";
import { inArray } from "drizzle-orm";

describe("Testes de Integração: buscarPratos", () => {
  const IDS_PRATOS = ["b-prato-1", "b-prato-2"];

  beforeEach(async () => {
    await db.delete(prato).where(inArray(prato.idPrato, IDS_PRATOS)).catch(() => {});
  });

  afterEach(async () => {
    await db.delete(prato).where(inArray(prato.idPrato, IDS_PRATOS)).catch(() => {});
  });

  test("deve buscar todos os pratos salvos na tabela real", async () => {
    await db.insert(prato).values([
      { idPrato: IDS_PRATOS[0], nome: "Bife Acebolado" },
      { idPrato: IDS_PRATOS[1], nome: "Batata Frita" }
    ]);

    const resultado = await buscarPratos();
    
    // Filtramos apenas os que criamos para garantir que o teste isola seus próprios dados
    // (já que outros testes podem ter deixado pratos residuais no banco)
    const pratosDoTeste = resultado.filter(p => IDS_PRATOS.includes(p.idPrato));

    expect(pratosDoTeste).toHaveLength(2);
    expect(pratosDoTeste.map(p => p.nome)).toContain("Bife Acebolado");
    expect(pratosDoTeste.map(p => p.nome)).toContain("Batata Frita");
  });
});