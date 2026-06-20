"use client";

import { useEffect, useMemo, useState } from "react";
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

export type FavoritoCardapio = {
  id: string;
  titulo: string;
  descricao: string;
  tipo: "prato";
};

const FAVORITOS_STORAGE_KEY = "avaliaru:favoritos-cardapio";

const dadosDoCardapio: CardapioDiario[] = [
  {
    id: 1,
    dia: "Segunda-feira",
    diaSemana: 1,
    pratoPrincipal: "Frango Assado",
    vegetariano: "Lasanha de Berinjela",
    guarnicao: "Purê de Batatas",
    acompanhamentos: "Arroz Branco e Feijão Carioca",
    sobremesa: "Fruta da Estação",
  },
  {
    id: 2,
    dia: "Terça-feira",
    diaSemana: 2,
    pratoPrincipal: "Carne de Panela com Batatas",
    vegetariano: "Estrogonofe de Grão de Bico",
    guarnicao: "Macarrão Alho e Óleo",
    acompanhamentos: "Arroz Branco e Feijão Preto",
    sobremesa: "Gelatina de Morango",
  },
  {
    id: 3,
    dia: "Quarta-feira",
    diaSemana: 3,
    pratoPrincipal: "Feijoada Tradicional",
    vegetariano: "Feijoada Vegana",
    guarnicao: "Couve Refogada e Farofa",
    acompanhamentos: "Arroz Branco e Laranja",
    sobremesa: "Doce de Leite",
  },
  {
    id: 4,
    dia: "Quinta-feira",
    diaSemana: 4,
    pratoPrincipal: "Iscas de Suíno Aceboladas",
    vegetariano: "Hambúrguer de Lentilha",
    guarnicao: "Polenta Cremosa",
    acompanhamentos: "Arroz Branco e Feijão Carioca",
    sobremesa: "Pudim de Chocolate",
  },
  {
    id: 5,
    dia: "Sexta-feira",
    diaSemana: 5,
    pratoPrincipal: "Peixe ao Molho de Coco",
    vegetariano: "Moqueca de Banana da Terra",
    guarnicao: "Pirão de Peixe",
    acompanhamentos: "Arroz Branco e Feijão Preto",
    sobremesa: "Paçoca",
  },
  {
    id: 6,
    dia: "Sábado",
    diaSemana: 6,
    pratoPrincipal: "Estrogonofe de Frango",
    vegetariano: "Escondidinho de Soja",
    guarnicao: "Batata Palha",
    acompanhamentos: "Arroz Branco e Feijão Carioca",
    sobremesa: "Fruta da Estação",
  },
];

export default function CardapioPage({ cardapio, favoritosSalvos, session }: { cardapio: CardapioSemanal | null; favoritosSalvos: string[]; session: Session }) {

  const hojeSP = new Date(
    new Date().toLocaleString("en-US", {
      timeZone: "America/Sao_Paulo",
    })
  );

  const favoritosDisponiveis = useMemo(
    () =>
      dadosDoCardapio.flatMap((menu) => [
        {
          id: `prato-principal-${menu.id}`,
          titulo: menu.pratoPrincipal,
          descricao: `${menu.dia} - Prato Principal`,
          tipo: "prato" as const,
        },
        {
          id: `vegetariano-${menu.id}`,
          titulo: menu.vegetariano,
          descricao: `${menu.dia} - Vegetariano`,
          tipo: "prato" as const,
        },
        {
          id: `sobremesa-${menu.id}`,
          titulo: menu.sobremesa,
          descricao: `${menu.dia} - Sobremesa`,
          tipo: "prato" as const,
        },
      ]),
    [],
  );

  const favoritosSelecionados = favoritosDisponiveis.filter((favorito) =>
    favoritosSalvos.includes(favorito.id),
  );

  const alternarFavorito = (id: string) => {
    console.log("Alterando o id: " + id)

    try {
      if (favoritosSalvos.includes(id)) {
        removerFavorito(id, session);
        myAlert.success("Favorito removido com sucesso!");
        return
      }
      
      adicionarFavorito(id, session);
      myAlert.success("Favorito adicionado com sucesso!");
    } catch (error) {
      myAlert.error("Erro ao realizar a operação. Tente novamente. " + error);
    } finally {
      console.log("Lista de favoritos atualizada:", favoritosSalvos);
    }


  };

  const printarCardapio = () => {
    console.log("Cardápio da Semana:", favoritosSalvos);
  };

  return (
    <main className={styles.paginaCardapio}>
      <h1 className={styles.tituloPrincipal}>Cardápio da Semana - FGA</h1>

      <button onClick={printarCardapio}>Printar cardapio</button>

      <section className={styles.resumoFavoritos} aria-live="polite">
        <div>
          <span className={styles.resumoRotulo}>Favoritos</span>
          <p className={styles.resumoTexto}>
            {favoritosSelecionados.length === 0
              ? "Marque proteínas, opções vegetarianas e sobremesas para acompanhar seus preferidos."
              : `${favoritosSelecionados.length} favorito(s) salvo(s) neste navegador.`}
          </p>
        </div>

        {favoritosSelecionados.length > 0 && (
          <div className={styles.listaFavoritos}>
            {favoritosSelecionados.map((favorito) => (
              <span key={favorito.id} className={styles.favoritoResumo}>
                {favorito.titulo}
              </span>
            ))}
          </div>
        )}
      </section>

      <div className={styles.container}>
        {cardapio?.map((cardapioDia) => (
          <CardapioCard
            key={cardapioDia.data.dia}
            cardapio={cardapioDia}
            isHoje={cardapioDia.data.dia === hojeSP.getDate() &&
              cardapioDia.data.mes === hojeSP.getMonth() + 1 &&
              cardapioDia.data.ano === hojeSP.getFullYear()}
            favoritos={favoritosSalvos}
            onAlternarFavorito={alternarFavorito}
          />
        ))}
      </div>
    </main>
  );
}
