"use client";

import { useState } from "react";
import styles from "./CardapioPage.module.css";
import CardapioCard from "./CardapioCard";
import { CardapioSemanal } from "@/types/types";
import myAlert from "@/lib/alert";
import { adicionarFavorito } from "@/actions/favoritosActions/adicionarFavorito";
import { Session } from "next-auth";
import { removerFavorito } from "@/actions/favoritosActions/removerFavorito";

export type CardapioDiario = {
  id: number;
  dia: string;
  diaSemana: number;
  pratoPrincipal: string;
  vegetariano: string;
  guarnicao: string;
  acompanhamentos: string;
  sobremesa: string;
};

export default function CardapioPage({
  cardapio,
  favoritosSalvos,
  session,
}: {
  cardapio: CardapioSemanal | null;
  favoritosSalvos: string[];
  session: Session;
}) {
  const [favoritos, setFavoritos] = useState(favoritosSalvos);

  const hojeSP = new Date(
    new Date().toLocaleString("en-US", {
      timeZone: "America/Sao_Paulo",
    })
  );

  const alternarFavorito = async (id: string) => {
    const estaFavorito = favoritos.includes(id);
    const favoritosAnteriores = favoritos;

    try {
      if (estaFavorito) {
        setFavoritos((favoritosAtuais) =>
          favoritosAtuais.filter((favorito) => favorito !== id)
        );
        await removerFavorito(id, session);
        myAlert.success("Favorito removido com sucesso!");
        return;
      }

      setFavoritos((favoritosAtuais) => [...favoritosAtuais, id]);
      await adicionarFavorito(id, session);
      myAlert.success("Favorito adicionado com sucesso!");
    } catch (error) {
      setFavoritos(favoritosAnteriores);
      myAlert.error("Erro ao realizar a operação. Tente novamente. " + error);
    }
  };

  return (
    <main className={styles.paginaCardapio}>
      <h1 className={styles.tituloPrincipal}>Cardápio da Semana - FGA</h1>

      <div className={styles.container}>
        {cardapio?.map((cardapioDia) => (
          <CardapioCard
            session={session}
            key={cardapioDia.data.dia}
            cardapio={cardapioDia}
            isHoje={
              cardapioDia.data.dia === hojeSP.getDate() &&
              cardapioDia.data.mes === hojeSP.getMonth() + 1 &&
              cardapioDia.data.ano === hojeSP.getFullYear()
            }
            favoritos={favoritos}
            onAlternarFavorito={alternarFavorito}
          />
        ))}
      </div>
    </main>
  );
}
