import { Prato } from "@/lib/db/schema";

export const usuarioPerfis = [
    "gestorru",
    "aluno",
    "adm"
] as const;

export type UsuarioPerfil =
    typeof usuarioPerfis[number];

export type DataDMA = {
    dia: number;
    mes: number;
    ano: number;
}

export type RestricaoAlimentar = {
    nome: string;
    descricao: string;
    emoji: string;
    codigo: string;
}

export type CardapioDiario = {
    data: DataDMA;
    panificacao: Prato[];
    opcao_extra?: Prato[];
    complemento_padrao_cafe?: Prato[];
    complemento_ovolactovegetariano_cafe?: Prato[];
    complemento_vegetariano_estrito_cafe?: Prato[];
    fruta?: Prato[];
    prato_principal_padrao_almoco?: Prato[];
    prato_principal_ovolactovegetariano_almoco?: Prato[];
    prato_principal_vegetariano_estrito_almoco?: Prato[];
    guarnicao?: Prato[];
    sobremesa_almoco?: Prato[];
    prato_principal_padrao_jantar?: Prato[];
    prato_principal_ovolactovegetariano_jantar?: Prato[];
    prato_principal_vegetariano_estrito_jantar?: Prato[];
    sopa?: Prato[];
    sobremesa_jantar?: Prato[];
};

export type CardapioSemanal = CardapioDiario[];
