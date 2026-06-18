import { auth } from "@/auth";
import GestorClient from "./client";
import { redirect } from "next/navigation";

export default async function Gestor(){
    const session = await auth();

    if (!session) {
        // Redirecionar para a página de login se o usuário não estiver autenticado
        redirect("/login");
    }

    return <GestorClient session={session} />;
}