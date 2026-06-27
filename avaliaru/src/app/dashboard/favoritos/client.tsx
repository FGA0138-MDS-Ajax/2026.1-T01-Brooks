"use client";

import { adicionarFavorito } from "@/actions/favoritosActions/adicionarFavorito";
import { removerFavorito } from "@/actions/favoritosActions/removerFavorito";
import type { Prato } from "@/lib/db/schema";
import myAlert from "@/lib/alert";
import { Heart, Search, UtensilsCrossed, X } from "lucide-react";
import type { Session } from "next-auth";
import { useDeferredValue, useMemo, useState } from "react";
import styles from "./favoritos.module.css";

type Filtro = "todos" | "favoritos";

type FavoritosClientProps = {
  pratos: Prato[];
  favoritosIniciais: string[];
  session: Session;
};

function normalizarTexto(valor: string) {
  return valor
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLocaleLowerCase("pt-BR");
}

export default function FavoritosClient({
  pratos,
  favoritosIniciais,
  session,
}: FavoritosClientProps) {
  const [busca, setBusca] = useState("");
  const [filtro, setFiltro] = useState<Filtro>("todos");
  const [favoritos, setFavoritos] = useState(
    () => new Set(favoritosIniciais),
  );
  const [pratoPendente, setPratoPendente] = useState<string | null>(null);
  const buscaAdiada = useDeferredValue(busca);

  const pratosVisiveis = useMemo(() => {
    const termo = normalizarTexto(buscaAdiada.trim());

    return pratos.filter((prato) => {
      const correspondeBusca =
        termo.length === 0 || normalizarTexto(prato.nome).includes(termo);
      const correspondeFiltro =
        filtro === "todos" || favoritos.has(prato.idPrato);

      return correspondeBusca && correspondeFiltro;
    });
  }, [buscaAdiada, favoritos, filtro, pratos]);

  const alternarFavorito = async (idPrato: string) => {
    if (pratoPendente) return;

    const estavaFavorito = favoritos.has(idPrato);

    setPratoPendente(idPrato);
    setFavoritos((atuais) => {
      const proximos = new Set(atuais);

      if (estavaFavorito) {
        proximos.delete(idPrato);
      } else {
        proximos.add(idPrato);
      }

      return proximos;
    });

    try {
      if (estavaFavorito) {
        await removerFavorito(idPrato, session);
        myAlert.success("Favorito removido com sucesso!");
      } else {
        await adicionarFavorito(idPrato, session);
        myAlert.success("Favorito adicionado com sucesso!");
      }
    } catch (error) {
      setFavoritos((atuais) => {
        const anteriores = new Set(atuais);

        if (estavaFavorito) {
          anteriores.add(idPrato);
        } else {
          anteriores.delete(idPrato);
        }

        return anteriores;
      });
      myAlert.error("Não foi possível atualizar o favorito. Tente novamente.");
      console.error(error);
    } finally {
      setPratoPendente(null);
    }
  };

  return (
    <main className={styles.pageWrapper}>
      <div className={styles.container}>
        <header className={styles.pageHeader}>
          <div>
            <span className={styles.eyebrow}>Minha alimentação</span>
            <h1 className={styles.pageTitle}>Pratos favoritos</h1>
            <p className={styles.pageSubtitle}>
              Pesquise os pratos do RU e marque aqueles que você mais gosta.
            </p>
          </div>

          <div className={styles.favoriteSummary} aria-live="polite">
            <Heart size={20} fill="currentColor" aria-hidden="true" />
            <span>
              <strong>{favoritos.size}</strong>{" "}
              {favoritos.size === 1 ? "prato favorito" : "pratos favoritos"}
            </span>
          </div>
        </header>

        <section className={styles.catalogPanel} aria-labelledby="catalogo-titulo">
          <div className={styles.panelHeader}>
            <div>
              <h2 id="catalogo-titulo">Catálogo de pratos</h2>
              <p>
                {pratosVisiveis.length}{" "}
                {pratosVisiveis.length === 1
                  ? "resultado encontrado"
                  : "resultados encontrados"}
              </p>
            </div>

            <div className={styles.segmentedControl} aria-label="Filtrar pratos">
              <button
                type="button"
                className={filtro === "todos" ? styles.segmentActive : ""}
                onClick={() => setFiltro("todos")}
                aria-pressed={filtro === "todos"}
              >
                Todos
              </button>
              <button
                type="button"
                className={filtro === "favoritos" ? styles.segmentActive : ""}
                onClick={() => setFiltro("favoritos")}
                aria-pressed={filtro === "favoritos"}
              >
                Favoritos
              </button>
            </div>
          </div>

          <div className={styles.searchBar}>
            <label className={styles.searchField}>
              <Search size={20} aria-hidden="true" />
              <span className={styles.srOnly}>Pesquisar prato</span>
              <input
                type="search"
                value={busca}
                onChange={(event) => setBusca(event.target.value)}
                placeholder="Buscar por nome do prato"
              />
            </label>

            {busca && (
              <button
                type="button"
                className={styles.clearButton}
                onClick={() => setBusca("")}
                aria-label="Limpar busca"
                title="Limpar busca"
              >
                <X size={18} aria-hidden="true" />
              </button>
            )}
          </div>

          {pratosVisiveis.length > 0 ? (
            <div className={styles.dishGrid}>
              {pratosVisiveis.map((prato) => {
                const estaFavorito = favoritos.has(prato.idPrato);
                const estaPendente = pratoPendente === prato.idPrato;

                return (
                  <article className={styles.dishCard} key={prato.idPrato}>
                    <span className={styles.dishIcon} aria-hidden="true">
                      <UtensilsCrossed size={20} />
                    </span>
                    <div className={styles.dishInfo}>
                      <h3>{prato.nome}</h3>
                      <span>{estaFavorito ? "Favorito" : "Disponível no RU"}</span>
                    </div>
                    <button
                      type="button"
                      className={`${styles.favoriteButton} ${
                        estaFavorito ? styles.favoriteButtonActive : ""
                      }`}
                      onClick={() => alternarFavorito(prato.idPrato)}
                      disabled={estaPendente}
                      aria-label={
                        estaFavorito
                          ? `Remover ${prato.nome} dos favoritos`
                          : `Adicionar ${prato.nome} aos favoritos`
                      }
                      aria-pressed={estaFavorito}
                      title={
                        estaFavorito
                          ? "Remover dos favoritos"
                          : "Adicionar aos favoritos"
                      }
                    >
                      <Heart
                        size={19}
                        fill={estaFavorito ? "currentColor" : "none"}
                        aria-hidden="true"
                      />
                    </button>
                  </article>
                );
              })}
            </div>
          ) : (
            <div className={styles.emptyState}>
              <Search size={28} aria-hidden="true" />
              <strong>Nenhum prato encontrado</strong>
              <p>Revise a busca ou selecione outro filtro.</p>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
