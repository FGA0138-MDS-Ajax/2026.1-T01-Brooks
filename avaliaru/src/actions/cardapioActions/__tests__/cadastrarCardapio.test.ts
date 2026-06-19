import { runMigrations } from "@/lib/db/migrations";
import { inserirCardapioNoBanco } from "../cadastrarCardapio";

async function testCadastrarCardapio() {
  console.log("Iniciando teste de cadastrarCardapio...");

  runMigrations();

  const values = {
    data: "2026-06-20",
    panificacao: "Pão Francês ou Pão Careca ou Pão Integral",
    opcao_extra: "Pão de Queijo",
    complemento_padrao_cafe: "Iorgute Natural",
    complemento_ovolactovegetariano_cafe: "Queijo Minas",
    complemento_vegetariano_estrito_cafe: "Pasta de Amendoim",
    fruta: "Banana",
    prato_principal_padrao_almoco: "Frango Assado com Manjerição",
    prato_principal_ovolactovegetariano_almoco: "Ovos Assados ao Sugo",
    prato_principal_vegetariano_estrito_almoco: "Polpetone de Quinoa",
    guarnicao: "Batata Sauté",
    sobremesa_almoco: "Mix de Doces",
    prato_principal_padrão_jantar: "Hamburguer gratinado",
    prato_principal_ovolactovegetariano_jantar: "Escondidinho de Ervilha Gratinado",
    prato_principal_vegetariano_estrito_jantar: "Risoto de Cogumelos",
    sopa: "Creme de Legumes",
    sobremesa_jantar: "Melão",
  };

  try {
    const result = await inserirCardapioNoBanco(values);
    console.log("✅ Resultado:", result);
  } catch (error: any) {
    console.error("❌ Erro no teste:", error.message || error);
  }
}

testCadastrarCardapio();