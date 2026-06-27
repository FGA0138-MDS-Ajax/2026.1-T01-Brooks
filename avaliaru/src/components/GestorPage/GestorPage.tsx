"use client";

import { useEffect, useState } from "react";
import styles from "./GestorPage.module.css";

interface Toast {
  id: string;
  message: string;
  type: "success" | "error" | "warning";
}

export default function GestorPage() {
  const [activeTab, setActiveTab] = useState<string>("cadastro");
  const [toasts, setToasts] = useState<Toast[]>([]);

  // Navegação por abas baseada em Hash na URL
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace("#", "") || "cadastro";
      if (["cadastro", "avaliacoes", "restricoes"].includes(hash)) {
        setActiveTab(hash);
      }
    };

    handleHashChange();
    window.addEventListener("hashchange", handleHashChange);
    return () => window.removeEventListener("hashchange", handleHashChange);
  }, []);

  const handleTabClick = (tab: string) => {
    setActiveTab(tab);
    window.location.hash = tab;
  };

  // Toast notifications function
  const showToast = (
    message: string,
    type: "success" | "error" | "warning" = "success",
    duration = 3000
  ) => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, message, type }]);

    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, duration);
  };

  // Mensagem de boas-vindas do original gestor.js
  useEffect(() => {
    const timer = setTimeout(() => {
      showToast("Painel do Gestor inicializado!", "success");
    }, 600);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className={styles.gestorContainer}>
      <aside className={styles.menuLateral}>
        <h1>AvaliaRU</h1>
        <a
          onClick={() => handleTabClick("cadastro")}
          className={activeTab === "cadastro" ? styles.ativo : ""}
        >
          Cardápio Semanal
        </a>
        <a
          onClick={() => handleTabClick("avaliacoes")}
          className={activeTab === "avaliacoes" ? styles.ativo : ""}
        >
          Avaliações
        </a>
        <a
          onClick={() => handleTabClick("restricoes")}
          className={activeTab === "restricoes" ? styles.ativo : ""}
        >
          Restrições
        </a>
      </aside>

      <main className={styles.conteudo}>
        <header className={styles.topo}>
          <h2>Painel do Gestor</h2>
          <p>Cadastro do cardápio semanal, avaliações e restrições alimentares.</p>
        </header>

        <section className={styles.resumo}>
          <div className={styles.card}>
            <h3>Pratos cadastrados</h3>
            <span></span>
          </div>

          <div className={styles.card}>
            <h3>Avaliações recebidas</h3>
            <span></span>
          </div>

          <div className={styles.card}>
            <h3>Pessoas com restrições</h3>
            <span></span>
          </div>
        </section>

        {/* Seção Cadastro de Cardápio */}
        <section
          id="cadastro"
          className={styles.caixa}
          style={{ display: activeTab === "cadastro" ? "block" : "none" }}
        >
          <h2>Cadastro do Cardápio Semanal</h2>

          <div className={styles.linhaForm}>
            <div>
              <label htmlFor="refeicao">Refeição</label>
              <select id="refeicao">
                <option></option>
                <option>Café da manhã</option>
                <option>Almoço</option>
                <option>Jantar</option>
              </select>
            </div>

            <div>
              <label htmlFor="semana">Semana</label>
              <input type="text" id="semana" />
            </div>
          </div>

          <div className={styles.tabelaArea}>
            <table>
              <thead>
                <tr>
                  <th>Composição</th>
                  <th>2ª Feira</th>
                  <th>3ª Feira</th>
                  <th>4ª Feira</th>
                  <th>5ª Feira</th>
                  <th>6ª Feira</th>
                </tr>
              </thead>

              <tbody>
                {[...Array(8)].map((_, i) => (
                  <tr key={i}>
                    <td>
                      <input type="text" className={styles.campoComposicao} />
                    </td>
                    <td>
                      <textarea></textarea>
                    </td>
                    <td>
                      <textarea></textarea>
                    </td>
                    <td>
                      <textarea></textarea>
                    </td>
                    <td>
                      <textarea></textarea>
                    </td>
                    <td>
                      <textarea></textarea>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <h3 className={styles.subtitulo}>Alergênicos / Restrições do prato selecionado</h3>

          <div className={styles.restricoesCheck}>
            <label>
              <input type="checkbox" /> Cogumelo
            </label>
            <label>
              <input type="checkbox" /> Leite e derivados
            </label>
            <label>
              <input type="checkbox" /> Mel
            </label>
            <label>
              <input type="checkbox" /> Pimenta
            </label>
            <label>
              <input type="checkbox" /> Soja
            </label>
            <label>
              <input type="checkbox" /> Trigo/Glúten
            </label>
            <label>
              <input type="checkbox" /> Amendoim
            </label>
            <label>
              <input type="checkbox" /> Oleaginosa
            </label>
            <label>
              <input type="checkbox" /> Ovo
            </label>
            <label>
              <input type="checkbox" /> Suíno
            </label>
          </div>

          <button onClick={() => showToast("Funcionalidade de salvar (protótipo)", "success")}>
            Salvar cardápio
          </button>
        </section>

        {/* Seção Avaliações */}
        <section
          id="avaliacoes"
          className={styles.caixa}
          style={{ display: activeTab === "avaliacoes" ? "block" : "none" }}
        >
          <h2>Avaliações</h2>

          <div className={styles.filtros}>
            <input type="text" />
            <select>
              <option></option>
              <option>Café da manhã</option>
              <option>Almoço</option>
              <option>Jantar</option>
            </select>
          </div>

          <div className={styles.listaVazia}></div>
          <div className={styles.listaVazia}></div>
          <div className={styles.listaVazia}></div>
        </section>

        {/* Seção Restrições */}
        <section
          id="restricoes"
          className={styles.caixa}
          style={{ display: activeTab === "restricoes" ? "block" : "none" }}
        >
          <h2>Quantidade de Pessoas com Restrições</h2>

          <div className={styles.restricoesGrid}>
            <div>
              Cogumelo <span></span>
            </div>
            <div>
              Leite e derivados <span></span>
            </div>
            <div>
              Mel <span></span>
            </div>
            <div>
              Pimenta <span></span>
            </div>
            <div>
              Soja <span></span>
            </div>
            <div>
              Trigo/Glúten <span></span>
            </div>
            <div>
              Amendoim <span></span>
            </div>
            <div>
              Oleaginosa <span></span>
            </div>
            <div>
              Ovo <span></span>
            </div>
            <div>
              Suíno <span></span>
            </div>
          </div>
        </section>
      </main>

      {/* Toast Notifications container */}
      <div className={styles.toastContainer}>
        {toasts.map((t) => (
          <div
            key={t.id}
            className={`${styles.toast} ${styles.show} ${
              t.type === "success"
                ? styles.success
                : t.type === "error"
                ? styles.error
                : styles.warning
            }`}
          >
            <span>
              {t.type === "success"
                ? "✅"
                : t.type === "error"
                ? "❌"
                : "⚠️"}
            </span>
            <span>{t.message}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
