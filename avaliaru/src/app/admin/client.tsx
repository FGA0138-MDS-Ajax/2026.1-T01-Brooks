"use client"
import { Session } from "next-auth";
import { signOut } from "next-auth/react";

export default function AdminClient({ session }: { session: Session | null }) {
    const handleLogout = () => {
        signOut({ callbackUrl: "/login" });
    };

    // Implementar dashboard com informações do usuário, avaliações recentes, etc. Adicionar botão de logout.
    return (
        <div className="flex flex-col flex-1 items-center justify-center bg-zinc-50 font-sans dark:bg-black">
            <h1>Bem-vindo ao Admin do AvaliaRU, {session?.user?.name}!</h1>
            <p>Aqui você pode acessar suas avaliações, histórico e muito mais.</p>
            <button className="bg-blue-500 text-white p-2 rounded mt-4 cursor-pointer" onClick={handleLogout}>
                Sair
            </button>
        </div>
    )
}