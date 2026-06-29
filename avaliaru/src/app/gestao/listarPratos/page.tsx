import { buscarPratos } from "@/actions/pratoActions/buscarPratos";
import ListaPratosPage from "@/components/ListaPratosPage/ListaPratosPage";

export default async function ListarPratosRouter() {
  const pratos = await buscarPratos() || []

  return <ListaPratosPage pratos={pratos} />;
}