import { buscarRestricoes } from "@/actions/restricaoActions/buscarRestricoes"
import RestricoesPageClient from "./client"
import { auth } from "@/auth";
import { buscarRestricoesEstudante } from "@/actions/restricaoActions/buscarRestricoesEstudante";

export default async function RestricoesPage() {
    const sessao = await auth()
    const restricoes = await buscarRestricoes()
    const restricoesEstudante = await buscarRestricoesEstudante({ fkEstudante: String(sessao?.user.id) })

    return <RestricoesPageClient restricoes={restricoes} sessao={sessao} restricoesEstudante={restricoesEstudante} />
}