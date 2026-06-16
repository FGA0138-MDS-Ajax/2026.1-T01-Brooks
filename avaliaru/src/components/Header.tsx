"use client";

import { User } from "lucide-react";

export default function Header({perfil}: { perfil?: "aluno" | "gestorru" | "adm" }) {
    const rota = {
        "aluno": "/dashboard/aluno",
        "gestorru": "/gestao/gestor",
        "adm": "/admin/adm"
    }
    
    return (
        <header className="bg-green-600 text-white p-8 flex flex-row items-center justify-between">
            <h1 className="text-2xl font-bold">AvaliaRU</h1>
            
            <button onClick={() => window.location.href = rota[perfil || "aluno"]} className="p-4 bg-blue-500 rounded-md flex flex-row items-center gap-2 hover:bg-blue-600 transition-colors cursor-pointer">
                <User />
                Meus dados
            </button>
        </header>
    );
}