import AvaliacaoRankingPage from "@/components/AvaliacaoRankingPage/AvaliacaoRankingPage";
import { buscarRankingAvaliacoes } from "@/actions/avaliacaoActions/buscarRankingAvaliacoes";
import { auth } from "@/auth";

export default async function AvaliacoesPage() {
  const dados = await buscarRankingAvaliacoes();
  const session = await auth();
  return <AvaliacaoRankingPage dados={dados} session={session} />;
}