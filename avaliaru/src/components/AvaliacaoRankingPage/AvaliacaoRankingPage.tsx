"use client";

import { useState } from "react";
import styles from "./AvaliacaoRankingPage.module.css";
import AvaliacaoModal from "../CardapioPage/AvaliacaoModal";
import { Star, BarChart3, UtensilsCrossed, Trophy, Search } from "lucide-react";

const pratos = [
  { id: 1, nome: "Estrogonofe de Frango", nota: 4.8, votos: 320 },
  { id: 2, nome: "Feijoada", nota: 4.5, votos: 280 },
  { id: 3, nome: "Lasanha", nota: 4.4, votos: 250 },
  { id: 4, nome: "Frango Grelhado", nota: 4.2, votos: 180 },
];

const distribuicao = [
  { estrelas: 5, percentual: 90 },
  { estrelas: 4, percentual: 70 },
  { estrelas: 3, percentual: 40 },
  { estrelas: 2, percentual: 15 },
  { estrelas: 1, percentual: 5 },
];

export default function AvaliacaoRankingPage() {
  const [isAvaliacaoOpen, setIsAvaliacaoOpen] = useState(false);
  const [pratoSelecionado, setPratoSelecionado] = useState("");

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
          <StatCard icon={<Star size={24} />} label="Média Geral" value="4.6" />
          <StatCard
            icon={<BarChart3 size={24} />}
            label="Avaliações"
            value="2.481"
          />
          <StatCard
            icon={<UtensilsCrossed size={24} />}
            label="Pratos"
            value="43"
          />
          <StatCard
            icon={<Trophy size={24} />}
            label="Mais Bem Avaliado"
            value="Estrogonofe"
          />
        </section>

        <div className={styles.searchWrap}>
          <Search className={styles.searchIcon} size={20} />
          <input
            className={styles.searchInput}
            type="text"
            placeholder="Pesquisar prato..."
          />
        </div>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Pratos para Avaliação</h2>

          <div className={styles.dishList}>
            {pratos.map((prato) => (
              <div className={styles.dishRow} key={prato.id}>
                <div className={styles.dishInfo}>
                  <h3 className={styles.dishName}>{prato.nome}</h3>
                  <span className={styles.dishVotes}>
                    {prato.votos} avaliações
                  </span>
                </div>

                <div className={styles.dishActions}>
                  <span className={styles.dishRating}>⭐ {prato.nota}</span>
                  <button
                    onClick={() => {
                      handleRateClick(prato.nome);
                    }}
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
            Ranking dos Pratos Mais Bem Avaliados
          </h2>

          <div className={styles.rankingList}>
            {pratos.map((prato) => (
              <div className={styles.rankingItem} key={prato.id}>
                <div className={styles.rankingHeader}>
                  <span className={styles.rankingName}>{prato.nome}</span>
                  <span className={styles.rankingValue}>{prato.nota}</span>
                </div>

                <div className={styles.barTrack}>
                  <div
                    className={styles.barFill}
                    style={{ width: `${(prato.nota / 5) * 100}%` }}
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
              {pratos.map((prato, index) => (
                <div className={styles.topItem} key={prato.id}>
                  <span className={styles.topIndex}>{index + 1}</span>
                  <span className={styles.topName}>{prato.nome}</span>
                  <Trophy size={18} className={styles.trophyIcon} />
                </div>
              ))}
            </div>
          </section>

          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Distribuição das Avaliações</h2>

            <div className={styles.distributionList}>
              {distribuicao.map((item) => (
                <div className={styles.distributionItem} key={item.estrelas}>
                  <span className={styles.distributionLabel}>
                    {item.estrelas}⭐
                  </span>

                  <div className={styles.distributionTrack}>
                    <div
                      className={styles.distributionFill}
                      style={{ width: `${item.percentual}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>

        <div>
          {isAvaliacaoOpen && (
            <AvaliacaoModal
              pratoPrincipal={pratoSelecionado}
              onClose={() => setIsAvaliacaoOpen(false)}
            />
          )}
        </div>
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
