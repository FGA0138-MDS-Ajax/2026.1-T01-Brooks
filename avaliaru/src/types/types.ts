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