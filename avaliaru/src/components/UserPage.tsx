"use client";

import { atualizarDados } from "@/actions/user/atualizarDados";
import myAlert from "@/lib/alert";
import { Mail, Save, ShieldCheck, UserRound } from "lucide-react";
import type { Session } from "next-auth";
import { useState } from "react";
import styles from "./UserPage.module.css";

const PERFIL_ROTULO = {
  aluno: "Aluno",
  gestorru: "Gestor RU",
  adm: "Administrador",
};

export default function UserPage({ session }: { session: Session }) {
  const nomeInicial = session.user.name || "";
  const emailInicial = session.user.email || "";
  const [name, setName] = useState(nomeInicial);
  const [email, setEmail] = useState(emailInicial);
  const [savedName, setSavedName] = useState(nomeInicial);
  const [savedEmail, setSavedEmail] = useState(emailInicial);
  const [isSaving, setIsSaving] = useState(false);
  const hasChanges = name !== savedName || email !== savedEmail;

  const handleSalvarDados = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!name.trim() || !email.trim()) {
      myAlert.error("Preencha todos os campos.");
      return;
    }

    try {
      setIsSaving(true);
      const result = await atualizarDados(name.trim(), email.trim(), session.user.id);

      if (result.changes > 0) {
        setName(name.trim());
        setEmail(email.trim());
        setSavedName(name.trim());
        setSavedEmail(email.trim());
        myAlert.success("Dados atualizados com sucesso!");
      }
    } catch {
      myAlert.error("Não foi possível atualizar os dados.");
    } finally {
      setIsSaving(false);
    }
  };

  const perfil = session.user.perfil || "aluno";

  return (
    <main className={styles.pageWrapper}>
      <div className={styles.container}>
        <header className={styles.pageHeader}>
          <div>
            <span className={styles.eyebrow}>Minha conta</span>
            <h1>Dados do usuário</h1>
            <p>Consulte e atualize suas informações pessoais.</p>
          </div>

          <span className={styles.profileBadge}>
            <ShieldCheck size={18} aria-hidden="true" />
            {PERFIL_ROTULO[perfil]}
          </span>
        </header>

        <section className={styles.formCard}>
          <div className={styles.cardHeading}>
            <span className={styles.avatar} aria-hidden="true">
              {(savedName || "U").charAt(0).toLocaleUpperCase("pt-BR")}
            </span>
            <span>
              <strong>{savedName || "Usuário AvaliaRU"}</strong>
              <small>{savedEmail}</small>
            </span>
          </div>

          <form onSubmit={handleSalvarDados} className={styles.form}>
            <label className={styles.field}>
              <span>Nome completo</span>
              <span className={styles.inputWrapper}>
                <UserRound size={19} aria-hidden="true" />
                <input
                  type="text"
                  name="name"
                  autoComplete="name"
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  required
                />
              </span>
            </label>

            <label className={styles.field}>
              <span>E-mail</span>
              <span className={styles.inputWrapper}>
                <Mail size={19} aria-hidden="true" />
                <input
                  type="email"
                  name="email"
                  autoComplete="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  required
                />
              </span>
            </label>

            <div className={styles.formActions}>
              <button type="submit" disabled={!hasChanges || isSaving}>
                <Save size={18} aria-hidden="true" />
                {isSaving ? "Salvando..." : "Salvar alterações"}
              </button>
            </div>
          </form>
        </section>
      </div>
    </main>
  );
}
