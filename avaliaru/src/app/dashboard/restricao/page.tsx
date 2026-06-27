import RestricoesPage from "@/components/RestricoesPage/RestricoesPage";
import { auth } from '@/auth';
import { buscarRestricoes } from '@/actions/restricaoActions/buscarRestricoes';
import { buscarRestricoesEstudante } from '@/actions/restricaoActions/buscarRestricoesEstudante';
import { redirect } from 'next/navigation';


export default async function Restricao() {

  const session = await auth();

  if (!session) {
    redirect("/login");
  }

  const restricoes = await buscarRestricoes();
  const restricoesEstudante = await buscarRestricoesEstudante(session.user.id);

  return (
    <RestricoesPage
      restricoes={restricoes}
      restricoesEstudante={restricoesEstudante}
      session={session}
    />
  );
}
