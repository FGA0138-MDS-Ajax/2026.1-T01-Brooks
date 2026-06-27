"use server";

import { auth } from "@/auth";
import { db } from "@/lib/db/db";
import { cardapioDiario } from "@/lib/db/schema";
import { revalidatePath } from "next/cache";

type CadastrarCardapioValues = {
  data: string;
  panificacao: string;
  opcao_extra: string;
  complemento_padrao_cafe: string;
  complemento_ovolactovegetariano_cafe: string;
  complemento_vegetariano_estrito_cafe: string;
  fruta: string;
  prato_principal_padrao_almoco: string;
  prato_principal_ovolactovegetariano_almoco: string;
  prato_principal_vegetariano_estrito_almoco: string;
  guarnicao: string;
  sobremesa_almoco: string;
  prato_principal_padrão_jantar: string;
  prato_principal_ovolactovegetariano_jantar: string;
  prato_principal_vegetariano_estrito_jantar: string;
  sopa: string;
  sobremesa_jantar: string;
};

export async function cadastrarCardapio(formData: FormData) {
  const session = await auth();

  if (!session?.user) {
    throw new Error("Não autorizado.");
  }

  const perfil = (session.user as { id: string; perfil: string }).perfil;
  const temAcesso = perfil === "gestorru" || perfil === "adm";

  if (!temAcesso) {
    throw new Error("Acesso negado: você não tem permissão.");
  }

  const values: CadastrarCardapioValues = {
    data: formData.get("data") as string,
    panificacao: formData.get("panificacao") as string,
    opcao_extra: formData.get("opcao_extra") as string,
    complemento_padrao_cafe: formData.get("complemento_padrao_cafe") as string,
    complemento_ovolactovegetariano_cafe: formData.get(
      "complemento_ovolactovegetariano_cafe"
    ) as string,
    complemento_vegetariano_estrito_cafe: formData.get(
      "complemento_vegetariano_estrito_cafe"
    ) as string,
    fruta: formData.get("fruta") as string,
    prato_principal_padrao_almoco: formData.get(
      "prato_principal_padrao_almoco"
    ) as string,
    prato_principal_ovolactovegetariano_almoco: formData.get(
      "prato_principal_ovolactovegetariano_almoco"
    ) as string,
    prato_principal_vegetariano_estrito_almoco: formData.get(
      "prato_principal_vegetariano_estrito_almoco"
    ) as string,
    guarnicao: formData.get("guarnicao") as string,
    sobremesa_almoco: formData.get("sobremesa_almoco") as string,
    prato_principal_padrão_jantar: formData.get(
      "prato_principal_padrão_jantar"
    ) as string,
    prato_principal_ovolactovegetariano_jantar: formData.get(
      "prato_principal_ovolactovegetariano_jantar"
    ) as string,
    prato_principal_vegetariano_estrito_jantar: formData.get(
      "prato_principal_vegetariano_estrito_jantar"
    ) as string,
    sopa: formData.get("sopa") as string,
    sobremesa_jantar: formData.get("sobremesa_jantar") as string,
  };

  return await inserirCardapioNoBanco(values);
}

export async function inserirCardapioNoBanco(values: CadastrarCardapioValues) {
  try {
    await db.insert(cardapioDiario).values(values);

    try {
      revalidatePath("/gestao/cardapio");
    } catch (error) {
      console.warn("Aviso: revalidatePath ignorado no ambiente de teste.");
    }

    return { success: true };
  } catch (error) {
    console.error(error);
    throw new Error("Erro ao salvar o cardápio no banco de dados.");
  }
}