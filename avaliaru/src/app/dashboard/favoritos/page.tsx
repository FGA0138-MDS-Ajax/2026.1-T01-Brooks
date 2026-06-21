import { buscarFavoritos } from "@/actions/favoritosActions/buscarFavoritos";
import { buscarPratos } from "@/actions/pratoActions/buscarPratos";
import { auth } from "@/auth";
import type { Session } from "next-auth";
import { redirect } from "next/navigation";
import FavoritosClient from "./client";

export default async function FavoritosPage() {
  const session = await auth();

  if (!session || session.user.perfil !== "aluno") {
    redirect("/login");
  }

  const [pratos, favoritos] = await Promise.all([
    buscarPratos(),
    buscarFavoritos(session as Session),
  ]);

  return (
    <FavoritosClient
      pratos={pratos}
      favoritosIniciais={favoritos}
      session={session}
    />
  );
}
