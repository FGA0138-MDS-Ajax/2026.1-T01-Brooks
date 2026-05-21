import { registerUser } from "@/actions/register";

export default function Home() {

    // Implementar página de registro com formulário para nome, email e senha. 
    // Utilize a função registerUser para processar o registro do usuário.
    return (
        <div className="flex flex-col flex-1 items-center justify-center bg-zinc-50 font-sans dark:bg-black">
            <h1>Registrar no AvaliaRU</h1>

            <form action={registerUser} className="flex flex-col gap-4 w-full max-w-sm">
                <input type="text" name="name" placeholder="Nome" className="p-2 border border-gray-300 rounded" required />
                <input type="email" name="email" placeholder="E-mail" className="p-2 border border-gray-300 rounded" required />
                <input type="password" name="password" placeholder="Senha" className="p-2 border border-gray-300 rounded" required />
                <button type="submit" className="bg-blue-500 text-white p-2 rounded">Registrar</button>
            </form>
        </div>
    );
}
