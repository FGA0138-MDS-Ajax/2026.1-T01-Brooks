"use client";

import AvaliacaoRankingPage from "@/components/AvaliacaoRankingPage/AvaliacaoRankingPage";
import { Session } from "next-auth";
import { RankingCompleto } from "@/actions/avaliacaoActions/buscarRankingAvaliacoes";

interface AvaliacaoRankingClientProps {
  dados: RankingCompleto;
  session: Session | null;
}

export default function AvaliacaoRankingClient({ dados, session }: AvaliacaoRankingClientProps) {
  return <AvaliacaoRankingPage dados={dados} session={session} />;
}