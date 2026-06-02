// Arquivo de referência
// Para listar o prato, bastar rodar um map no array de pratos e exibir as informações relevantes (código e nome do prato)

"use client"
import { Prato } from "@/lib/db/schema"

export default function ListarPratosPage({ pratos }: { pratos: Prato[] }) {
    
    return (
        <div>
            <div id="listar-pratos">
                {pratos.length === 0 && <p>Nenhum prato encontrado.</p>}

                <ul>
                    {pratos.map((prato) => (
                        <li key={prato.idPrato} className="w-full !p-4 bg-blue-100 rounded-md">
                            <strong>{prato.nome}</strong> (Código: {prato.idPrato})
                        </li>
                    ))}
                </ul>


            </div>
        </div>
    )
}