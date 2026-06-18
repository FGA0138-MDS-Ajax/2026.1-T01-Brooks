"use client";

import { LogOut, User } from "lucide-react";

import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function Header({ perfil }: { perfil: "aluno" | "gestorru" | "adm" | undefined }) {
    const rota = {
        "aluno": "/dashboard/aluno",
        "gestorru": "/gestao/gestor",
        "adm": "/admin/adm"
    }

    const handleLogout = () => {
        signOut({ callbackUrl: "/login" });
    };

    const handleMeusDados = () => {
        console.log("Perfil:", perfil);
        router.push(rota[perfil as "aluno" | "gestorru" | "adm"]);
    };

    const router = useRouter();

    if (!perfil) {
        return null; // Ou um header genérico para usuários não autenticados
    }

    return (
        <header className="bg-green-600 text-white !p-2 flex flex-row items-center justify-between gap-4 rounded-md">
            <h1 className="text-2xl font-bold">AvaliaRU</h1>

            <div className="flex flex-row items-center gap-4">
                <button onClick={handleMeusDados} className="!p-1 bg-sky-100 text-sky-600 !rounded-md flex flex-row items-center gap-2 hover:bg-sky-200 transition-colors cursor-pointer">
                    <User size={20} />
                    Meus dados
                </button>

                <button className="bg-white text-red-500 !py-1 !px-2 rounded-md mt-4 cursor-pointer flex flex-row items-center gap-2" onClick={handleLogout}>
                    <LogOut size={20} />
                    Sair
                </button>
            </div>
        </header>
    );
}