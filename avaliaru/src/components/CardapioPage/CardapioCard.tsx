"use client";

import { useState } from "react";
import { Heart } from "lucide-react";
import styles from "./CardapioCard.module.css";
import AvaliacaoModal from "./AvaliacaoModal";
import { CardapioDiario } from "@/types/types";
import { Session } from "next-auth";

type CardapioProps = {
  cardapio: CardapioDiario;
  isHoje?: boolean;
  favoritos: string[];
  onAlternarFavorito: (id: string) => void;
  session: Session | null;
};


const destaquesPrimarios = [
  "complemento_padrao_cafe",
  "prato_principal_padrao_almoco",
  "prato_principal_padrao_jantar",
]

const destaquesSecundarios = [
  "complemento_ovolactovegetariano_cafe",
  "complemento_vegetariano_estrito_cafe",
  "prato_principal_ovolactovegetariano_almoco",
  "prato_principal_vegetariano_estrito_almoco",
  "prato_principal_ovolactovegetariano_jantar",
  "prato_principal_vegetariano_estrito_jantar",
]

const categoriasFavoritaveis = new Set([
  ...destaquesPrimarios,
  ...destaquesSecundarios,
  "sobremesa_almoco",
  "sobremesa_jantar",
]);

const itensCafe = [
  "panificacao",
  "opcao_extra",
  "complemento_padrao_cafe",
  "complemento_ovolactovegetariano_cafe",
  "complemento_vegetariano_estrito_cafe",
  "fruta",
]

const itensAlmoco = [
  "prato_principal_padrao_almoco",
  "prato_principal_ovolactovegetariano_almoco",
  "prato_principal_vegetariano_estrito_almoco",
  "guarnicao",
  "sobremesa_almoco",
]

const itensJantar = [
  "prato_principal_padrao_jantar",
  "prato_principal_ovolactovegetariano_jantar",
  "prato_principal_vegetariano_estrito_jantar",
  "sopa",
  "sobremesa_jantar",
]

const BotaoFavorito = ({ id, handleClick, estaFavorito }: { id: string, handleClick: (id: string) => void, estaFavorito: boolean }) => {
  return (
    <button
      type="button"
      className={`${styles.btnFavorito}`}
      onClick={(e) => {
        e.stopPropagation();
        handleClick(id);
      }}
    >
      <Heart size={18} fill={estaFavorito ? "#e53e3e" : "#fff"} />
    </button>
  );
};

const ItemCardapioDiario = ({ item, favoritos, onAlternarFavorito, }: { item: { id: string, rotulo: string, valor: { idPrato: string, nome: string }[], codigo: string }, favoritos: string[], onAlternarFavorito: (id: string) => void }) => {
  return <div key={item.id} className={styles.itemCardapio}>
    <div className="flex flex-col items-start gap-2 w-full">
      <strong>{item.rotulo}:</strong>{" "}
      {item.valor.length > 0 ? (
        item.valor.map(prato => (
          <span key={prato.idPrato} className={styles.badge + " " + (destaquesPrimarios.includes(item.codigo) ? styles.badgePrincipal : (destaquesSecundarios.includes(item.codigo) ? styles.badgeSecundario : ""))}>
            {prato.nome}
            {prato.idPrato && categoriasFavoritaveis.has(item.codigo) && (
              <BotaoFavorito
                id={prato.idPrato}
                estaFavorito={favoritos.includes(prato.idPrato)}
                handleClick={onAlternarFavorito}
              />
            )}
          </span>
        ))
      ) : (
        <span className={styles.badgeVazio}>Não informado</span>
      )}
    </div>
  </div>
}

export default function CardapioCard({
  cardapio,
  isHoje,
  favoritos,
  onAlternarFavorito,
  session
}: CardapioProps) {
  const [modalAberto, setModalAberto] = useState(false);

  const idCardapioDia = `cardapio-${cardapio.data.ano}-${cardapio.data.mes}-${cardapio.data.dia}`;

  // ==================== TODOS OS 16 CAMPOS ====================
  const allFields = [
    // === CAFÉ DA MANHÃ ===
    { id: `panificacao-${idCardapioDia}`, rotulo: "Panificação", valor: cardapio.panificacao ?? [], codigo: "panificacao" },
    { id: `opcao-extra-${idCardapioDia}`, rotulo: "Opção Extra", valor: cardapio.opcao_extra ?? [], codigo: "opcao_extra" },
    { id: `complemento-padrao-cafe-${idCardapioDia}`, rotulo: "Complemento Padrão", valor: cardapio.complemento_padrao_cafe ?? [], codigo: "complemento_padrao_cafe" },
    { id: `complemento-ovolactovegetariano-cafe-${idCardapioDia}`, rotulo: "Ovolactovegetariano", valor: cardapio.complemento_ovolactovegetariano_cafe ?? [], codigo: "complemento_ovolactovegetariano_cafe" },
    { id: `complemento-vegetariano-estrito-cafe-${idCardapioDia}`, rotulo: "Vegetariano (Café)", valor: cardapio.complemento_vegetariano_estrito_cafe ?? [], codigo: "complemento_vegetariano_estrito_cafe" },
    { id: `fruta-${idCardapioDia}`, rotulo: "Fruta", valor: cardapio.fruta ?? [], codigo: "fruta" },

    // === ALMOÇO ===
    { id: `prato-principal-padrao-almoco-${idCardapioDia}`, rotulo: "Prato Principal Almoço", valor: cardapio.prato_principal_padrao_almoco ?? [], codigo: "prato_principal_padrao_almoco" },
    { id: `prato-principal-ovolactovegetariano-almoco-${idCardapioDia}`, rotulo: "Ovolactovegetariano", valor: cardapio.prato_principal_ovolactovegetariano_almoco ?? [], codigo: "prato_principal_ovolactovegetariano_almoco" },
    { id: `prato-principal-vegetariano-estrito-almoco-${idCardapioDia}`, rotulo: "Vegetariano", valor: cardapio.prato_principal_vegetariano_estrito_almoco ?? [], codigo: "prato_principal_vegetariano_estrito_almoco" },
    { id: `guarnicao-${idCardapioDia}`, rotulo: "Guarnição", valor: cardapio.guarnicao ?? [], codigo: "guarnicao" },
    { id: `sobremesa-almoco-${idCardapioDia}`, rotulo: "Sobremesa", valor: cardapio.sobremesa_almoco ?? [], codigo: "sobremesa_almoco" },

    // === JANTAR ===
    { id: `prato-principal-padrao-jantar-${idCardapioDia}`, rotulo: "Prato Principal Jantar", valor: cardapio.prato_principal_padrao_jantar ?? [], codigo: "prato_principal_padrao_jantar" },
    { id: `prato-principal-ovolactovegetariano-jantar-${idCardapioDia}`, rotulo: "Ovolactovegetariano", valor: cardapio.prato_principal_ovolactovegetariano_jantar ?? [], codigo: "prato_principal_ovolactovegetariano_jantar" },
    { id: `prato-principal-vegetariano-estrito-jantar-${idCardapioDia}`, rotulo: "Vegetariano", valor: cardapio.prato_principal_vegetariano_estrito_jantar ?? [], codigo: "prato_principal_vegetariano_estrito_jantar" },
    { id: `sopa-${idCardapioDia}`, rotulo: "Sopa", valor: cardapio.sopa ?? [], codigo: "sopa" },
    { id: `sobremesa-jantar-${idCardapioDia}`, rotulo: "Sobremesa", valor: cardapio.sobremesa_jantar ?? [], codigo: "sobremesa_jantar" },
  ];

  const diasSemana = ["Domingo", "Segunda-feira", "Terça-feira", "Quarta-feira", "Quinta-feira", "Sexta-feira", "Sábado"];
  const diaSemanaIndex = new Date(cardapio.data.ano, cardapio.data.mes - 1, cardapio.data.dia).getDay();


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
        <h1 className="text-xl font-bold">Café da Manhã</h1>
        {allFields
          .filter((item) => itensCafe.includes(item.codigo))
          .map((item) => (
            <ItemCardapioDiario
              key={item.id}
              item={item}
              favoritos={favoritos}
              onAlternarFavorito={onAlternarFavorito}
            />
          ))}

        <h1 className="text-xl font-bold mt-4">Almoço</h1>
        {allFields
          .filter((item) => itensAlmoco.includes(item.codigo))
          .map((item) => (
            <ItemCardapioDiario
              key={item.id}
              favoritos={favoritos}
              item={item}
              onAlternarFavorito={onAlternarFavorito}
            />
          ))}

        <h1 className="text-xl font-bold mt-4">Jantar</h1>
        {allFields
          .filter((item) => itensJantar.includes(item.codigo))
          .map((item) => (
            <ItemCardapioDiario
              key={item.id}
              item={item}
              favoritos={favoritos}
              onAlternarFavorito={onAlternarFavorito}
            />
          ))}

        <button className={styles.btnAvaliar} onClick={() => setModalAberto(true)}>
          Avaliar Cardápio
        </button>
      </div>

      {modalAberto && (
        <AvaliacaoModal
          props={{
              dia: `${diasSemana[diaSemanaIndex]}, ${cardapio.data.dia.toString().padStart(2, "0")}/${cardapio.data.mes.toString().padStart(2, "0")}/${cardapio.data.ano}`,
              pratoPrincipal: cardapio.prato_principal_padrao_almoco?.[0]?.nome || "Prato Principal",
              onClose: () => setModalAberto(false)
          }}
          session={session}
          dataCardapio={`${cardapio.data.ano}-${cardapio.data.mes.toString().padStart(2, "0")}-${cardapio.data.dia.toString().padStart(2, "0")}`}
        />
      )}

    </div>
  );
}
