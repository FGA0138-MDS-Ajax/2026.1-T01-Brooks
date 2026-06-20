import { buscarCardapioSemana } from "@/actions/cardapioActions/buscarCardapioSemana";
import { buscarFavoritos } from "@/actions/favoritosActions/buscarFavoritos";
import { auth } from "@/auth";
import CardapioPage from "@/components/CardapioPage/CardapioPage";
import { Session } from "next-auth";
import { redirect } from "next/navigation";

interface PageProps {
    params: Promise<{ index_semana: number }>
}

export default async function CardapioRoute({ params }: PageProps) {
    const { index_semana } = await params;

    const session = await auth()

    if (session == null || !session){
        redirect("/login")
    }

    const cardapio = await buscarCardapioSemana(index_semana)
    const favoritosSalvos = await buscarFavoritos(session as Session)

    return (
        <CardapioPage cardapio={cardapio} favoritosSalvos={favoritosSalvos} session={session}/>
    )
}