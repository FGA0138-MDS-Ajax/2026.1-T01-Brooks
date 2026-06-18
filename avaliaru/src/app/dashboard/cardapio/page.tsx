import { buscarCardapioSemana } from "@/actions/cardapioActions/buscarCardapioSemana";
import CardapioPage from "@/components/CardapioPage/CardapioPage";

interface PageProps {
    params: Promise<{ index_semana: number }>
}

export default async function CardapioRoute({ params }: PageProps) {
    const { index_semana } = await params;

    const cardapio = await buscarCardapioSemana(index_semana)

    return (
        <CardapioPage cardapio={cardapio} />
    )
}