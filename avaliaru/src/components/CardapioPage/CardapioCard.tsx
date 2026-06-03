"use client";

import { useState } from "react";
import { Heart } from "lucide-react";
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
  favoritos: string[];
  onAlternarFavorito: (id: string) => void;
};

export default function CardapioCard(props: CardapioProps) {
  const [modalAberto, setModalAberto] = useState(false);

  const itensCardapio = [
    {
      id: `prato-principal-${props.id}`,
      rotulo: "Prato Principal",
      valor: props.pratoPrincipal,
      destaque: styles.badgePrincipal,
    },
    {
      id: `vegetariano-${props.id}`,
      rotulo: "Vegetariano",
      valor: props.vegetariano,
      destaque: styles.badgeVegetariano,
    },
    {
      rotulo: "Guarnição",
      valor: props.guarnicao,
    },
    {
      rotulo: "Acompanhamentos",
      valor: props.acompanhamentos,
    },
    {
      id: `sobremesa-${props.id}`,
      rotulo: "Sobremesa",
      valor: props.sobremesa,
    },
  ];

  const renderBotaoFavorito = (id: string, label: string) => {
    const estaFavorito = props.favoritos.includes(id);

    return (
      <button
        type="button"
        className={`${styles.btnFavorito} ${
          estaFavorito ? styles.btnFavoritoAtivo : ""
        }`}
        aria-label={
          estaFavorito ? `Remover ${label} dos favoritos` : `Favoritar ${label}`
        }
        aria-pressed={estaFavorito}
        title={estaFavorito ? "Remover dos favoritos" : "Favoritar"}
        onClick={(e) => {
          e.stopPropagation();
          props.onAlternarFavorito(id);
        }}
      >
        <Heart size={18} fill={estaFavorito ? "currentColor" : "none"} />
      </button>
    );
  };

  return (
    <div className={styles.cardDia}>
      <div className={styles.cardHeader}>
        {props.isHoje && <span className={styles.badgeHoje}>Hoje</span>}
        <h2>{props.dia}</h2>
      </div>

      <div className={styles.cardapioConteudo}>
        <h3 className={styles.refeicaoTitulo}>Almoço</h3>

        <div className={styles.listaItens}>
          {itensCardapio.map((item) => (
            <div
              key={item.rotulo}
              className={`${styles.itemCardapio} ${
                item.id ? "" : styles.itemSemFavorito
              }`}
            >
              <p>
                <strong>{item.rotulo}: </strong>
                {item.destaque ? (
                  <span className={`${styles.badge} ${item.destaque}`}>
                    {item.valor}
                  </span>
                ) : (
                  item.valor
                )}
              </p>
              {item.id && renderBotaoFavorito(item.id, item.valor)}
            </div>
          ))}
        </div>

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
