"use server";

import { db } from "@/lib/db/db";
import {
  prato,
  avaliacao,
  estudantePossuiRestricao,
  restricaoAlimentar,
  restricaoContemPrato,
  cardapioDiario,
  cardapioDiarioItem,
  users
} from "@/lib/db/schema";
import { and, eq, sql, desc } from "drizzle-orm";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";

// Helper function to generate a slug ID from a dish name
function gerarSlugPrato(nome: string): string {
  return nome
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // remove accents
    .replace(/[^a-z0-9\s_-]/g, "")   // remove special chars
    .replace(/\s+/g, "_")            // spaces to underscores
    .trim();
}

/**
 * Returns summary statistics for the gestor panel:
 * - count of unique registered dishes
 * - count of total reviews received
 * - count of unique students with restrictions
 */
export async function buscarResumoGestor() {
  const session = await auth();
  if (!session?.user) throw new Error("Não autorizado.");

  const [resPratos] = await db.select({ count: sql<number>`count(*)` }).from(prato);
  const [resAvaliacoes] = await db.select({ count: sql<number>`count(*)` }).from(avaliacao);
  const [resRestricoes] = await db
    .select({ count: sql<number>`count(distinct ${estudantePossuiRestricao.fkEstudante})` })
    .from(estudantePossuiRestricao);

  return {
    pratosCadastrados: Number(resPratos?.count ?? 0),
    avaliacoesRecebidas: Number(resAvaliacoes?.count ?? 0),
    pessoasComRestricoes: Number(resRestricoes?.count ?? 0),
  };
}

/**
 * Returns the count of students for each restriction category.
 */
export async function buscarEstatisticasRestricoes() {
  const session = await auth();
  if (!session?.user) throw new Error("Não autorizado.");

  const result = await db
    .select({
      codigo: restricaoAlimentar.codigo,
      nome: restricaoAlimentar.nome,
      quantidade: sql<number>`count(${estudantePossuiRestricao.fkEstudante})`,
    })
    .from(restricaoAlimentar)
    .leftJoin(
      estudantePossuiRestricao,
      eq(restricaoAlimentar.codigo, estudantePossuiRestricao.fkRestricao)
    )
    .groupBy(restricaoAlimentar.codigo)
    .all();

  return result.map((r) => ({
    codigo: r.codigo,
    nome: r.nome,
    quantidade: Number(r.quantidade || 0),
  }));
}

/**
 * Returns all reviews (evaluations) with the names of the students.
 */
export async function buscarAvaliacoes() {
  const session = await auth();
  if (!session?.user) throw new Error("Não autorizado.");

  const result = await db
    .select({
      idAvaliacao: avaliacao.idAvaliacao,
      nota: avaliacao.nota,
      dataHoraAvaliacao: avaliacao.dataHoraAvaliacao,
      comentario: avaliacao.comentario,
      statusModeracao: avaliacao.statusModeracao,
      fkCardapioDiario: avaliacao.fkCardapioDiario,
      estudanteNome: users.name,
    })
    .from(avaliacao)
    .innerJoin(users, eq(avaliacao.fkEstudante, users.id))
    .orderBy(desc(avaliacao.dataHoraAvaliacao))
    .all();

  return result;
}

/**
 * Toggles the moderation status of a review.
 */
export async function alternarStatusModeracao(idAvaliacao: number, statusAtual: boolean) {
  const session = await auth();
  if (!session?.user) throw new Error("Não autorizado.");

  const perfil = (session.user as { perfil?: string }).perfil;
  if (perfil !== "gestorru" && perfil !== "adm") {
    throw new Error("Não autorizado.");
  }

  await db
    .update(avaliacao)
    .set({ statusModeracao: !statusAtual })
    .where(eq(avaliacao.idAvaliacao, idAvaliacao));

  try {
    revalidatePath("/gestao");
  } catch (e) {}

  return { success: true };
}

/**
 * Returns all restriction codes associated with a specific dish ID.
 */
export async function buscarRestricoesDoPrato(idPrato: string) {
  const session = await auth();
  if (!session?.user) throw new Error("Não autorizado.");

  const result = await db
    .select({
      fkRestricao: restricaoContemPrato.fkRestricao,
    })
    .from(restricaoContemPrato)
    .where(eq(restricaoContemPrato.fkPrato, idPrato))
    .all();

  return result.map((r) => r.fkRestricao);
}

type SalvarCardapioSemanalParams = {
  datas: string[]; // Array of 5 date strings: Mon-Fri ["YYYY-MM-DD", ...]
  refeicao: "cafe" | "almoco" | "jantar";
  cardapio: Record<string, string[]>; // Mapping: fieldName -> array of 5 comma-separated strings
  restricoesPratos: Record<string, string[]>; // Mapping: dishName -> list of restriction codes
};

/**
 * Saves the weekly cardapio and the associated dish restrictions.
 */
export async function salvarCardapioSemanalAction({
  datas,
  refeicao,
  cardapio,
  restricoesPratos,
}: SalvarCardapioSemanalParams) {
  const session = await auth();
  if (!session?.user) throw new Error("Não autorizado.");

  const perfil = (session.user as { perfil?: string }).perfil;
  if (perfil !== "gestorru" && perfil !== "adm") {
    throw new Error("Acesso negado: você não tem permissão.");
  }

  try {
    // 1. Process and save the menu for each of the 5 days (Monday to Friday)
    for (let dayIndex = 0; dayIndex < 5; dayIndex++) {
      const data = datas[dayIndex];
      if (!data) continue;

      // Ensure the day's record exists in cardapioDiario
      try {
        await db.insert(cardapioDiario).values({ data }).onConflictDoNothing();
      } catch (e) {
        // Safe to ignore if already exists or handles onConflict
      }

      // Process each composition field
      for (const [campo, valuesArray] of Object.entries(cardapio)) {
        const text = valuesArray[dayIndex];
        const dishNames = text
          ? text
              .split(",")
              .map((s) => s.trim())
              .filter(Boolean)
          : [];

        // Delete existing items for this data + campo
        await db
          .delete(cardapioDiarioItem)
          .where(
            and(
              eq(cardapioDiarioItem.data, data),
              eq(cardapioDiarioItem.campo, campo)
            )
          );

        // Insert new dishes
        for (const dishName of dishNames) {
          // Look up if dish exists
          let p = await db
            .select()
            .from(prato)
            .where(eq(prato.nome, dishName))
            .limit(1)
            .all();

          let pratoId = p[0]?.idPrato;

          if (!pratoId) {
            // Generate unique slug
            const baseSlug = gerarSlugPrato(dishName);
            let finalSlug = baseSlug || "prato_novo";

            // Check slug uniqueness
            const exists = await db
              .select()
              .from(prato)
              .where(eq(prato.idPrato, finalSlug))
              .limit(1)
              .all();

            if (exists.length > 0) {
              finalSlug = `${baseSlug}_${Math.random()
                .toString(36)
                .substring(2, 6)}`;
            }

            // Insert new dish
            await db.insert(prato).values({
              idPrato: finalSlug,
              nome: dishName,
            });
            pratoId = finalSlug;
          }

          // Insert association
          await db.insert(cardapioDiarioItem).values({
            data,
            campo,
            idPrato: pratoId,
          });
        }
      }
    }

    // 2. Save allergen restrictions for each dish
    for (const [nomePrato, restricoes] of Object.entries(restricoesPratos)) {
      const p = await db
        .select()
        .from(prato)
        .where(eq(prato.nome, nomePrato))
        .limit(1)
        .all();

      const pratoId = p[0]?.idPrato;
      if (pratoId) {
        // Delete existing restrictions for this dish
        await db
          .delete(restricaoContemPrato)
          .where(eq(restricaoContemPrato.fkPrato, pratoId));

        // Insert new ones
        if (restricoes.length > 0) {
          const insertValues = restricoes.map((code) => ({
            fkPrato: pratoId,
            fkRestricao: code,
          }));
          await db.insert(restricaoContemPrato).values(insertValues);
        }
      }
    }

    try {
      revalidatePath("/gestao");
      revalidatePath("/dashboard");
    } catch (e) {
      // Ignore during tests
    }

    return { success: true };
  } catch (error) {
    console.error("Erro ao salvar cardápio semanal:", error);
    throw new Error("Erro interno ao salvar cardápio no banco de dados.");
  }
}
