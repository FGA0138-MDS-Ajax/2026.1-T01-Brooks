"use client";

import { useState } from "react";
import styles from "./CardapioCard.module.css";
import AvaliacaoModal from "./AvaliacaoModal";

type CardapioProps = {
  id: number;
  dia: string;
  pratoPrincipal: string;
  vegetariano: string;
  guarnicao: string;
  acompanhamentos: string;
  sobremesa: string;
  isHoje?: boolean;
};

export default function CardapioCard(props: CardapioProps) {
  const [modalAberto, setModalAberto] = useState(false);

  return (
    <div className={styles.cardDia}>
      <div className={styles.cardHeader}>
        {props.isHoje && <span className={styles.badgeHoje}>Hoje</span>}
        <h2>{props.dia}</h2>
      </div>

      <div className={styles.cardapioConteudo}>
        <h3 className={styles.refeicaoTitulo}>Almoço</h3>

        <p className={styles.itemCardapio}>
          <strong>Prato Principal: </strong>
          <span className={`${styles.badge} ${styles.badgePrincipal}`}>
            {props.pratoPrincipal}
          </span>
        </p>

        <p className={styles.itemCardapio}>
          <strong>Vegetariano: </strong>
          <span className={`${styles.badge} ${styles.badgeVegetariano}`}>
            {props.vegetariano}
          </span>
        </p>

        <p className={styles.itemCardapio}>
          <strong>Guarnição: </strong> {props.guarnicao}
        </p>

        <p className={styles.itemCardapio}>
          <strong>Acompanhamentos: </strong> {props.acompanhamentos}
        </p>

        <p className={styles.itemCardapio}>
          <strong>Sobremesa: </strong> {props.sobremesa}
        </p>

        <button
          className={styles.btnAvaliar}
          onClick={(e) => {
            e.stopPropagation();
            setModalAberto(true);
          }}
        >
          Avaliar Almoço
        </button>
      </div>

      {modalAberto && (
        <AvaliacaoModal
          dia={props.dia}
          pratoPrincipal={props.pratoPrincipal}
          onClose={() => setModalAberto(false)}
        />
      )}
    </div>
  );
}
