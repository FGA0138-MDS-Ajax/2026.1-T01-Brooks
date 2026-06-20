"use client"

import { removerRestricao } from "@/actions/restricaoActions/removerRestricao";
import { salvarRestricaoEstudante } from "@/actions/restricaoActions/salvarRestricao";
import myAlert from "@/lib/alert";
import { RestricaoAlimentar } from "@/types/types";
import { Session } from "next-auth";

function OptionCard({ item, checked, onChange }: { item: RestricaoAlimentar, checked: boolean, onChange: (id: string) => void }) {
  return (
    <label className="option" htmlFor={item.codigo}>
      <input
        id={item.codigo}
        type="checkbox"
        checked={checked}
        onChange={() => onChange(item.codigo)}
      />
      <span className="emoji" aria-hidden="true">{item.emoji}</span>
      <div>
        <strong>{item.nome}</strong>
        <small>{item.descricao}</small>
      </div>
    </label>
  );
}

export default function RestricoesPage({restricoes, restricoesEstudante, session}: {restricoes: RestricaoAlimentar[], restricoesEstudante: string[], session: Session}) {
    const updateRestricao = async (codigo: string) => {
        try {
            if (restricoesEstudante.includes(codigo)) {
                await removerRestricao({ restricaoId: codigo, fkEstudante: session.user.id });
                myAlert.success("Restrição removida com sucesso!");
                return
            }

            await salvarRestricaoEstudante({ restricaoId: codigo, fkEstudante: session.user.id });
            myAlert.success("Restrição adicionada com sucesso!");
        } catch (error) {
            myAlert.error("Erro ao atualizar as informações. Tente novamente. " + error);
        }
    }
    
    return <main className="page">
      <section className="container">
        <header className="top">
          <div>
            <h1>Restrições Alimentares</h1>
            <p>Selecione os ingredientes que você não pode ou prefere não consumir.</p>
          </div>
        </header>

        <div className="card">
          <h2>Marque suas restrições</h2>

          <div className="grid">
            {restricoes.map((restricao) => (
              <OptionCard
                key={restricao.codigo}
                item={restricao}
                checked={restricoesEstudante.includes(restricao.codigo)}
                onChange={() => {updateRestricao(restricao.codigo)}}
              />
            ))}
          </div>

          
        </div>
      </section>
    </main>
}