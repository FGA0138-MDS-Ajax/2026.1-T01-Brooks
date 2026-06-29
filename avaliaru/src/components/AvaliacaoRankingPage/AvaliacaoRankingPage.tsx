"use client";

import { useState } from "react";
import styles from "./AvaliacaoRankingPage.module.css";
import AvaliacaoModal from "../CardapioPage/AvaliacaoModal";
import { Star, BarChart3, UtensilsCrossed, Trophy, Search } from "lucide-react";
import Link from "next/link";
import { Session } from "next-auth";
import { RankingCompleto } from "@/actions/avaliacaoActions/buscarRankingAvaliacoes";

type AvaliacaoRankingPageProps = {
  dados: RankingCompleto;
  session: Session | null;
};

export default function AvaliacaoRankingPage({ dados, session }: AvaliacaoRankingPageProps) {
  const [isAvaliacaoOpen, setIsAvaliacaoOpen] = useState(false);
  const [pratoSelecionado, setPratoSelecionado] = useState("");
  const [busca, setBusca] = useState("");

  const [campoDaCategoria, setCampoDaCategoria] = useState(
    dados.categorias[0]?.campo ?? ""
  );

  const { categorias, estatisticas, distribuicao } = dados;

  const categoriaAtiva = 
    categorias.find((c) => c.campo === campoDaCategoria) ?? categorias[0];

  const pratosFiltrados = (categoriaAtiva?.ranking ?? []).filter((prato) =>
    prato.nome.toLowerCase().includes(busca.toLowerCase()));

  const handleRateClick = (nomeDoPrato: string) => {
    setPratoSelecionado(nomeDoPrato);
    setIsAvaliacaoOpen(true);
  };

  return (
    <main className={styles.page}>
      <div className={styles.wrapper}>
        <header className={styles.header}>
          <h1 className={styles.title}>Avaliações e Estatísticas</h1>
          <p className={styles.subtitle}>
            Ranking e desempenho dos pratos servidos no RU
          </p>
        </header>

        <section className={styles.statsGrid}>
          <StatCard icon={<Star size={24} />} label="Média Geral" 
          value={String(estatisticas.mediaGeral)} />
          <StatCard
            icon={<BarChart3 size={24} />}
            label="Avaliações"
            value={estatisticas.totalAvaliacoes.toLocaleString("pt-BR")}
          />
          <StatCard
            icon={<UtensilsCrossed size={24} />}
            label="Pratos"
            value={String(estatisticas.totalPratos)}
          />
          <StatCard
            icon={<Trophy size={24} />}
            label="Mais Bem Avaliado"
            value={estatisticas.melhorAvaliado}
          />
        </section>

        <div style={{ marginBottom: "24px"}}>
          <select
            value={campoDaCategoria}
            onChange={(e) => {
              setCampoDaCategoria(e.target.value);
              setBusca("");
            }}
            style={{
              width: "100%",
              padding: "14px 18px",
              borderRadius: "24px",
              border: "1px solid #e5e7eb",
              background: "#fff",
              fontSize: "1rem",
              color: "#111827",
              boxShadow: "0 4px 12px rgba(0,0,0,0.06)",
              cursor: "pointer",
              outline: "none",
            }}
          >
            {categorias.map((c) => (
              <option key={c.campo} value={c.campo}>
                {c.rotulo}
              </option>
            ))}
          </select>
        </div>

        <div className={styles.searchWrap}>
          <Search className={styles.searchIcon} size={20} />
          <input
            className={styles.searchInput}
            type="text"
            placeholder={`Pesquisar em ${categoriaAtiva?.rotulo ?? "pratos"}...`}
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
          />
        </div>

        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>
              {categoriaAtiva?.rotulo ?? "Pratos"} — Avaliações
            </h2>
            <Link href="/dashboard/lista-pratos" className={styles.seeAllLink}>
              Ver tudo
            </Link>
          </div>

          <div className={styles.dishList}>
            {pratosFiltrados.length === 0 && (
              <p style={{ color: "#6b7280" }}>Nenhum prato encontrado.</p>
            )}
            {pratosFiltrados.map((prato) => (
              <div className={styles.dishRow} key={prato.idPrato}>
                <div className={styles.dishInfo}>
                  <h3 className={styles.dishName}>{prato.nome}</h3>
                  <span className={styles.dishVotes}>
                    {prato.totalAvaliacoes} avaliações
                  </span>
                </div>
                <div className={styles.dishActions}>
                  <span className={styles.dishRating}>⭐ {prato.media}</span>
                  <button
                    onClick={() => handleRateClick(prato.nome)}
                    className={styles.evaluateButton}
                  >
                    Avaliar
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>
            Ranking — {categoriaAtiva?.rotulo ?? "Pratos Mais Bem Avaliados"}
          </h2>
          <div className={styles.rankingList}>
            {(categoriaAtiva?.ranking ?? []).map((prato) => (
              <div className={styles.rankingItem} key={prato.idPrato}>
                <div className={styles.rankingHeader}>
                  <span className={styles.rankingName}>{prato.nome}</span>
                  <span className={styles.rankingValue}>{prato.media}</span>
                </div>
                <div className={styles.barTrack}>
                  <div
                    className={styles.barFill}
                    style={{ width: `${(prato.media / 5) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </section>

        <div className={styles.bottomGrid}>
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Top 10 Pratos</h2>

            <div className={styles.topList}>
              {(categoriaAtiva?.ranking ?? []).slice(0, 10).map((prato, index) => (
                <div className={styles.topItem} key={prato.idPrato}>
                  <span className={styles.topIndex}>{index + 1}</span>
                  <span className={styles.topName}>{prato.nome}</span>
                  {index === 0 && (
                  <Trophy size={18} className={styles.trophyIcon} /> )}
                </div>
              ))}
            </div>
          </section>

          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Distribuição das Avaliações</h2>
            <div className={styles.distributionList}>
              {distribuicao.map((item) => (
                <div className={styles.distributionItem} key={item.estrelas}>
                  <span className={styles.distributionLabel}>{item.estrelas}⭐</span>
                  <div className={styles.distributionTrack}>
                    <div className={styles.distributionFill} style={{ width: `${item.percentual}%` }}/>
                  </div>
                  <span style={{color: "#6b7280", fontSize: "0.85rem", minWidth: "30px" }}>
                    {item.quantidade}
                  </span>
                </div>
              ))}
            </div>
          </section>
        </div>
        
          {isAvaliacaoOpen && (
            <AvaliacaoModal
              props={{
                pratoPrincipal: pratoSelecionado,
                onClose: () => setIsAvaliacaoOpen(false),
              }}
              session={session}
              dataCardapio={new Date().toISOString().split("T")[0]}
            />
          )}
      </div>
    </main>
  );
}

function StatCard({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <article className={styles.statCard}>
      <div className={styles.statIcon}>{icon}</div>
      <span className={styles.statLabel}>{label}</span>
      <strong className={styles.statValue}>{value}</strong>
    </article>
  );
}
