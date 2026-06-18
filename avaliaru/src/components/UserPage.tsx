"use client"
import { atualizarDados } from "@/actions/user/atualizarDados";
import myAlert from "@/lib/alert";
import { Session } from "next-auth";
import { useState } from "react";

export default function UserPage({session}: { session: Session}) {
    const [email, setEmail] = useState<string>(session.user.email || ""); // Inicializa com o email da sessão, ou string vazia se não existir
    const [name, setName] = useState<string>(session.user.name || ""); // Inicializa com o nome da sessão, ou string vazia se não existir

    const handleSalvarDados = async (e: React.SubmitEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (name === "" || email === "" || name === undefined || email === undefined || name === null || email === null) {
            alert("Preencha todos os campos");
            return;
        }

        try {
            const result = await atualizarDados(name, email, session.user.id)

            if (result.changes > 0) {
                myAlert.success("Dados atualizados com sucesso!");
            }
            console.log(result);
        } catch (err) {
            console.error(err);
            myAlert.error("Erro ao atualizar dados");
            return;
        }
    }

    return <div>
        <h1>Dados do Usuário</h1>

        <form onSubmit={handleSalvarDados} className="flex flex-col">
            <input type="text" name="name"  onChange={(e) => setName(e.target.value)} value={name} />
            <input type="email" name="email" onChange={(e) => setEmail(e.target.value)} value={email} />
            <button type="submit" className="bg-blue-500 p-2 rounded-md cursor-pointer">Salvar</button>
        </form>

    </div>
}