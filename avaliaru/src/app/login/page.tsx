"use client"
import { loginUser } from "@/actions/login";

export default function LoginPage() {

    // Implementar página de login com formulário para email e senha, utilizando o NextAuth para autenticação.
    return (
        <div className="flex flex-col flex-1 items-center justify-center bg-zinc-50 font-sans dark:bg-black">
            <h1>Login no AvaliaRU</h1>

            <form action={loginUser} className="flex flex-col gap-4 w-full max-w-sm">
                <input type="email" name="email" placeholder="E-mail" className="p-2 border border-gray-300 rounded" required />
                <input type="password" name="password" placeholder="Senha" className="p-2 border border-gray-300 rounded" required />
                <button type="submit" className="bg-blue-500 text-white p-2 rounded">Entrar</button>
            </form>
        </div>
    );
}