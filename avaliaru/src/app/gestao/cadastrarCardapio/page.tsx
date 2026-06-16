import { buscarPratos } from "@/actions/pratoActions/buscarPratos";
import CadastrarCardapioClient from "./client";

export default async function CadastrarCardapioPage() {
    const pratos = await buscarPratos() || [];

    return <CadastrarCardapioClient pratos={pratos} />
}