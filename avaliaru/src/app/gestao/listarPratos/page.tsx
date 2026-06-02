"use server";
import { buscarPratos } from "@/actions/pratoActions/buscarPratos";
import ListarPratosPage from "@/components/ListarPratosPage";


export default async function ListarPratosRouter() {
    const pratos = await buscarPratos() || []

    return (
        <div className="container">
            <div className="form-side">
                <h1>Listar Pratos</h1>
                <ListarPratosPage pratos={pratos}/>
            </div>
        </div>
    )
}