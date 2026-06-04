"use client";

import {
  Star,
  Trophy,
  BarChart3,
  UtensilsCrossed,
} from "lucide-react";

import StatCard from "@/components/AvaliacaoRankingPage/StatCard";
import SectionCard from "@/components/AvaliacaoRankingPage/SectionCard";
import SearchBar from "@/components/AvaliacaoRankingPage/SearchBar";
import DishCard from "@/components/AvaliacaoRankingPage/DishCard";
import RankingChart from "@/components/AvaliacaoRankingPage/RankingChart";
import TopRankingList from "@/components/AvaliacaoRankingPage/TopRankingList";
import RatingDistribution from "@/components/AvaliacaoRankingPage/RatingDistribution";

import {
  pratosMock,
  distribuicaoMock,
} from "@/lib/mock/avaliacaoRanking";

export default function AvaliacaoRankingClient() {
  return (
    <main className="min-h-screen bg-[#F5F6FA] p-10">
      <div className="max-w-7xl mx-auto">

        <h1 className="text-center text-5xl font-bold text-[#0B2A59] mb-12">
          Avaliações e Estatísticas
        </h1>

        <section className="grid xl:grid-cols-4 md:grid-cols-2 gap-6 mb-10">
          <StatCard icon={<Star />} title="Média Geral" value="4.6" />
          <StatCard icon={<BarChart3 />} title="Avaliações" value="2481" />
          <StatCard icon={<UtensilsCrossed />} title="Pratos" value="43" />
          <StatCard icon={<Trophy />} title="Mais Bem Avaliado" value="Estrogonofe" />
        </section>

        <div className="mb-10">
          <SearchBar />
        </div>

        <SectionCard title="Pratos para Avaliação">
          <div className="space-y-4">
            {pratosMock.map((prato) => (
              <DishCard key={prato.id} prato={prato} />
            ))}
          </div>
        </SectionCard>

        <div className="h-10" />

        <SectionCard title="Ranking dos Pratos Mais Bem Avaliados">
          <RankingChart pratos={pratosMock} />
        </SectionCard>

        <div className="grid lg:grid-cols-2 gap-8 mt-10">

          <SectionCard title="Top 10">
            <TopRankingList pratos={pratosMock} />
          </SectionCard>

          <SectionCard title="Distribuição das Avaliações">
            <RatingDistribution ratings={distribuicaoMock} />
          </SectionCard>

        </div>
      </div>
    </main>
  );
}