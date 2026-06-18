"use client"

import { RestricaoAlimentar } from "@/types/types";
import { salvarRestricoesEstudante } from "@/actions/restricaoActions/salvarRestricoes";
import { Session } from "next-auth";
import { useState } from "react";

export default function RestricoesPageClient({ restricoes, sessao, restricoesEstudante }: { restricoes: RestricaoAlimentar[]; sessao: Session | null; restricoesEstudante: {fkEstudante: string, fkRestricao: string}[]  }) {
    const listaRestricoes = useState(restricoes.map((restricao, index) => ({
        codigo: restricao.codigo,
        nome: restricao.nome,
        emoji: restricao.emoji,
        descricao: restricao.descricao,
        marcada: restricoesEstudante.some((re) => re.fkRestricao === restricao.codigo)
    })))

    const salvarRestricoes = async () => {
        try {
            const result = await salvarRestricoesEstudante({
                restricoesSelecionadas: listaRestricoes[0].filter((r) => r.marcada).map((r) => r.codigo),
                fkEstudante: String(sessao?.user.id)
            });

            alert("Restrições salvas com sucesso!");
        } catch (error) {
            alert("Erro ao salvar restrições: " + error);
        }
    }
    
    return (
        <div>
            <h1>Restrições Alimentares</h1>
            {listaRestricoes[0].map((restricao) => (
                <div key={restricao.codigo} className="flex flex-row">
                    <input type="checkbox" checked={restricao.marcada} onChange={() => {
                        const novaLista = listaRestricoes[0].map((r) => {
                            if (r.codigo === restricao.codigo) {
                                return { ...r, marcada: !r.marcada };
                            }
                            return r;
                        });
                        listaRestricoes[1](novaLista);
                    }} />
                    <h2>{restricao.nome} {restricao.emoji}</h2>
                    <p>{restricao.descricao}</p>
                </div>
            ))}

            <div>
                <h2>Restricoes marcadas</h2>

            </div>

            <button onClick={salvarRestricoes} className="bg-blue-500 m-2 p-2 text-white">Salvar Restrição</button>
        </div>
    )
}