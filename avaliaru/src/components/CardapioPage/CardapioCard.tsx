"use client";

import { useState } from "react";
import { Heart } from "lucide-react";
import styles from "./CardapioCard.module.css";
import AvaliacaoModal from "./AvaliacaoModal";
import { CardapioDiario } from "@/types/types";

type CardapioProps = {
  cardapio: CardapioDiario;
  isHoje?: boolean;
  favoritos: string[];
  onAlternarFavorito: (id: string) => void;
};

export default function CardapioCard({
  cardapio,
  isHoje,
  favoritos,
  onAlternarFavorito,
}: CardapioProps) {
  const [modalAberto, setModalAberto] = useState(false);

  const idCardapioDia = `cardapio-${cardapio.data.ano}-${cardapio.data.mes}-${cardapio.data.dia}`;

  // ==================== TODOS OS 16 CAMPOS ====================
  const allFields = [
    // === CAFÉ DA MANHÃ ===
    { id: `panificacao-${idCardapioDia}`, rotulo: "Panificação", valor: cardapio.panificacao ?? [] },
    { id: `opcao-extra-${idCardapioDia}`, rotulo: "Opção Extra", valor: cardapio.opcao_extra ?? [] },
    { id: `complemento-padrao-cafe-${idCardapioDia}`, rotulo: "Complemento Padrão", valor: cardapio.complemento_padrao_cafe ?? [] },
    { id: `complemento-ovolactovegetariano-cafe-${idCardapioDia}`, rotulo: "Ovolactovegetariano", valor: cardapio.complemento_ovolactovegetariano_cafe ?? [] },
    { id: `complemento-vegetariano-estrito-cafe-${idCardapioDia}`, rotulo: "Vegetariano (Café)", valor: cardapio.complemento_vegetariano_estrito_cafe ?? [] },
    { id: `fruta-${idCardapioDia}`, rotulo: "Fruta", valor: cardapio.fruta ?? [] },

    // === ALMOÇO ===
    { id: `prato-principal-padrao-almoco-${idCardapioDia}`, rotulo: "Padrão", valor: cardapio.prato_principal_padrao_almoco ?? [] },
    { id: `prato-principal-ovolactovegetariano-almoco-${idCardapioDia}`, rotulo: "Ovolactovegetariano", valor: cardapio.prato_principal_ovolactovegetariano_almoco ?? [] },
    { id: `prato-principal-vegetariano-estrito-almoco-${idCardapioDia}`, rotulo: "Vegetariano", valor: cardapio.prato_principal_vegetariano_estrito_almoco ?? [] },
    { id: `guarnicao-${idCardapioDia}`, rotulo: "Guarnição", valor: cardapio.guarnicao ?? [] },
    { id: `sobremesa-almoco-${idCardapioDia}`, rotulo: "Sobremesa", valor: cardapio.sobremesa_almoco ?? [] },

    // === JANTAR ===
    { id: `prato-principal-padrao-jantar-${idCardapioDia}`, rotulo: "Padrão", valor: cardapio.prato_principal_padrao_jantar ?? [] },
    { id: `prato-principal-ovolactovegetariano-jantar-${idCardapioDia}`, rotulo: "Ovolactovegetariano", valor: cardapio.prato_principal_ovolactovegetariano_jantar ?? [] },
    { id: `prato-principal-vegetariano-estrito-jantar-${idCardapioDia}`, rotulo: "Vegetariano", valor: cardapio.prato_principal_vegetariano_estrito_jantar ?? [] },
    { id: `sopa-${idCardapioDia}`, rotulo: "Sopa", valor: cardapio.sopa ?? [] },
    { id: `sobremesa-jantar-${idCardapioDia}`, rotulo: "Sobremesa", valor: cardapio.sobremesa_jantar ?? [] },
  ];

  const diasSemana = ["Domingo", "Segunda-feira", "Terça-feira", "Quarta-feira", "Quinta-feira", "Sexta-feira", "Sábado"];
  const diaSemanaIndex = new Date(cardapio.data.ano, cardapio.data.mes - 1, cardapio.data.dia).getDay();

  const renderBotaoFavorito = (id: string, label: string) => {
    const estaFavorito = favoritos.includes(id);
    return (
      <button
        type="button"
        className={`${styles.btnFavorito} ${estaFavorito ? styles.btnFavoritoAtivo : ""}`}
        onClick={(e) => {
          e.stopPropagation();
          onAlternarFavorito(id);
        }}
      >
        <Heart size={18} fill={estaFavorito ? "currentColor" : "none"} />
      </button>
    );
  };

  return (
    <div className={styles.cardDia}>
      <div className={styles.cardHeader}>
        {isHoje && <span className={styles.badgeHoje}>Hoje</span>}
        <h2>{diasSemana[diaSemanaIndex]}</h2>
        <span>
          {cardapio.data.dia.toString().padStart(2, "0")}/
          {cardapio.data.mes.toString().padStart(2, "0")}/{cardapio.data.ano}
        </span>
      </div>

      <div className={styles.cardapioConteudo}>
        {allFields.map((item) => (
          <div key={item.id} className={styles.itemCardapio}>
            <p>
              <strong>{item.rotulo}:</strong>{" "}
              {item.valor.length > 0 ? (
                item.valor.map((prato, index) => (
                  <span key={prato.idPrato} className={styles.badge}>
                    {prato.nome}
                    {index < item.valor.length - 1 && ", "}
                  </span>
                ))
              ) : (
                <span className={styles.badgeVazio}>Não informado</span>
              )}
            </p>
            {item.id && renderBotaoFavorito(item.id, item.rotulo)}
          </div>
        ))}

        <button className={styles.btnAvaliar} onClick={() => setModalAberto(true)}>
          Avaliar Cardápio
        </button>
      </div>

      {modalAberto && (
        <AvaliacaoModal
          dia={diasSemana[diaSemanaIndex]}
          pratoPrincipal={cardapio.prato_principal_padrao_almoco?.[0]?.nome || "Prato Principal"}
          onClose={() => setModalAberto(false)}
        />
      )}
    </div>
  );
}