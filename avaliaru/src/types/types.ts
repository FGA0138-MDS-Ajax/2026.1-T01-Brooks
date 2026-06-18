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

    prato_principal_padrao_jantar: string;
    prato_principal_ovolactovegetariano_jantar: string;
    prato_principal_vegetariano_estrito_jantar: string;
    sopa: string;
    sobremesa_jantar: string;
};

export type CardapioSemanal = CardapioDiario[];
