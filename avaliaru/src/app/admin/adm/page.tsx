import { auth } from "@/auth";
import AdminClient from "./client";
import { redirect } from "next/navigation";

export default async function Admin(){
    const session = await auth();

    if (!session) {
        // Redirecionar para a página de login se o usuário não estiver autenticado
        redirect("/login");
    }

    return <AdminClient session={session} />;
}