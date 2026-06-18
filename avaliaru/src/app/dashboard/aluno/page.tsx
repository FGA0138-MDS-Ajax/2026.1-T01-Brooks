import { auth } from "@/auth";
import AlunoClient from "./client";
import { redirect } from "next/navigation";

export default async function Aluno(){
    const session = await auth();

    if (!session) {
        // Redirecionar para a página de login se o usuário não estiver autenticado
        redirect("/login");
    }

    return <AlunoClient session={session} />;
}