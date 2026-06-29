"use client";

import { removerRestricao } from "@/actions/restricaoActions/removerRestricao";
import { salvarRestricaoEstudante } from "@/actions/restricaoActions/salvarRestricao";
import myAlert from "@/lib/alert";
import { RestricaoAlimentar } from "@/types/types";
import { CircleCheck, ShieldCheck } from "lucide-react";
import { Session } from "next-auth";
import { useState } from "react";
import styles from "./RestricoesPage.module.css";

type OptionCardProps = {
  item: RestricaoAlimentar;
  checked: boolean;
  disabled: boolean;
  onChange: (id: string) => void;
};

function OptionCard({ item, checked, disabled, onChange }: OptionCardProps) {
  return (
    <label className={`${styles.option} ${checked ? styles.optionSelected : ""}`} htmlFor={item.codigo}>
      <input
        id={item.codigo}
        type="checkbox"
        checked={checked}
        disabled={disabled}
        onChange={() => onChange(item.codigo)}
      />
      <span className={styles.optionIcon} aria-hidden="true">
        {checked ? <CircleCheck size={22} /> : <ShieldCheck size={22} />}
      </span>
      <span className={styles.optionText}>
        <strong>{item.nome}</strong>
        <small>{item.descricao}</small>
      </span>
    </label>
  );
}

export default function RestricoesPage({
  restricoes,
  restricoesEstudante,
  session,
}: {
  restricoes: RestricaoAlimentar[];
  restricoesEstudante: string[];
  session: Session;
}) {
  const [selecionadas, setSelecionadas] = useState(restricoesEstudante);
  const [atualizando, setAtualizando] = useState<string | null>(null);

  const updateRestricao = async (codigo: string) => {
    if (atualizando) return;

    const estavaSelecionada = selecionadas.includes(codigo);
    setAtualizando(codigo);
    setSelecionadas((atuais) =>
      estavaSelecionada ? atuais.filter((item) => item !== codigo) : [...atuais, codigo],
    );

    try {
      if (estavaSelecionada) {
        await removerRestricao({ restricaoId: codigo, fkEstudante: session.user.id });
        myAlert.success("Restrição removida com sucesso!");
      } else {
        await salvarRestricaoEstudante({ restricaoId: codigo, fkEstudante: session.user.id });
        myAlert.success("Restrição adicionada com sucesso!");
      }
    } catch (error) {
      setSelecionadas((atuais) =>
        estavaSelecionada ? [...atuais, codigo] : atuais.filter((item) => item !== codigo),
      );
      myAlert.error("Erro ao atualizar as informações. Tente novamente. " + error);
    } finally {
      setAtualizando(null);
    }
  };

  return (
    <main className={styles.page}>
      <section className={styles.container}>
        <header className={styles.top}>
          <span className={styles.eyebrow}>Minha alimentação</span>
          <h1>Restrições alimentares</h1>
          <p>Selecione os ingredientes que você não pode ou prefere não consumir.</p>
        </header>

        <section className={styles.card} aria-labelledby="titulo-restricoes">
          <div className={styles.cardHeader}>
            <div>
              <h2 id="titulo-restricoes">Marque suas restrições</h2>
              <p>As opções selecionadas ficam vinculadas ao seu perfil.</p>
            </div>
            <span className={styles.counter}>{selecionadas.length} selecionada(s)</span>
          </div>

          <div className={styles.grid}>
            {restricoes.map((restricao) => (
              <OptionCard
                key={restricao.codigo}
                item={restricao}
                checked={selecionadas.includes(restricao.codigo)}
                disabled={atualizando === restricao.codigo}
                onChange={updateRestricao}
              />
            ))}
          </div>
        </section>
      </section>
    </main>
  );
}
