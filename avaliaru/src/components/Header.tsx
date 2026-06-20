"use client";

import type { UsuarioPerfil } from "@/types/types";
import { LogOut, User, UserRound } from "lucide-react";
import Image from "next/image";
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

    const menuOptions = {
        "aluno": [
            {label: "Cardapio", onClick: () => router.push("/dashboard/cardapio")},
            {label: "Minhas Avaliações", onClick: () => router.push("/dashboard/avaliacoes")},
            {label: "Restrições Alimentares", onClick: () => router.push("/dashboard/restricao")},
            {label: "Favoritos", onClick: () => router.push("/dashboard/favoritos")},
            {label: "Ranking", onClick: () => router.push("/dashboard/ranking")},
        ],
        "gestorru": [
            {label: "Gestão de Pratos", onClick: () => router.push("/gestao/pratos")},
            {label: "Gestão de Avaliações", onClick: () => router.push("/gestao/avaliacoes")},
            {label: "Gestão de Usuários", onClick: () => router.push("/gestao/usuarios")},
        ],
        "adm": [
            {label: "Admin", onClick: () => router.push("/admin/adm")},
        ],
    };

    return (
        <header className="bg-green-600 text-white !p-2 flex flex-row items-center justify-between gap-4 rounded-md">
            <h1 className="text-2xl font-bold">AvaliaRU</h1>

            <div className="flex flex-row items-center rounded-md overflow-hidden">
                {menuOptions[perfil].map((option) => (
                    <button key={option.label} onClick={option.onClick} className="!py-1 !px-2 bg-white text-slate-600 font-bold  flex flex-row items-center gap-2 hover:bg-sky-200 transition-colors cursor-pointer">
                        {option.label}
                    </button>
                ))}
            </div>

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
