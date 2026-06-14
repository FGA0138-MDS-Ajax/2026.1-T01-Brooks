"use client";

import { useState } from "react";
import styles from "./AvaliacaoModal.module.css";
import { Star } from "lucide-react";

type AvaliacaoModalProps = {
  dia?: string;
  pratoPrincipal: string;
  onClose: () => void;
};

export default function AvaliacaoModal(props: AvaliacaoModalProps) {
  const [nota, setNota] = useState(0);
  const [comentario, setComentario] = useState("");
  const [enviado, setEnviado] = useState(false);

  const handleEnviar = () => {
    if (nota === 0) return;
    setEnviado(true);
    setTimeout(() => {
      props.onClose();
    }, 2000);
  };

  const handleCliqueEstrela = (
    e: React.MouseEvent<HTMLButtonElement>,
    n: number,
  ) => {
    const tamanhoBotao = e.currentTarget.getBoundingClientRect();
    const cliqueNaEsquerda =
      e.clientX - tamanhoBotao.left < tamanhoBotao.width / 2;
    setNota(cliqueNaEsquerda ? n - 0.5 : n);
  };

  if (enviado) {
    return (
      <div className={styles.overlay}>
        <div className={styles.modal}>
          <p>Avaliação enviada! Obrigado.</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.overlay} onClick={props.onClose}>
      <svg width="0" height="0" style={{ position: "absolute" }}>
        <defs>
          <linearGradient id="cor-metade" x1="0" y1="0" x2="1" y2="0">
            <stop offset="50%" stopColor="#fbbf24" />
            <stop offset="50%" stopColor="transparent" />
          </linearGradient>
        </defs>
      </svg>

      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <h2 className={styles.titulo}>Avaliar Almoço</h2>
        <p className={styles.subtitulo}>
          {props.dia
            ? `${props.dia} — ${props.pratoPrincipal}`
            : props.pratoPrincipal}
        </p>

        <div className={styles.estrelas}>
          {[1, 2, 3, 4, 5].map((n) => {
            const isCheia = nota >= n;
            const isMeia = nota === n - 0.5;

            return (
              <button
                key={n}
                onClick={(e) => handleCliqueEstrela(e, n)}
                className={
                  isCheia || isMeia ? styles.estrelaSelecionada : styles.estrela
                }
              >
                <Star
                  size={32}
                  fill={
                    isCheia
                      ? "currentColor"
                      : isMeia
                        ? "url(#cor-metade)"
                        : "none"
                  }
                />
              </button>
            );
          })}
        </div>

        <textarea
          className={styles.textarea}
          placeholder="Comentário (opcional)..."
          value={comentario}
          onChange={(e) => setComentario(e.target.value)}
          rows={3}
        />

        <div className={styles.botoesContainer}>
          <button className={styles.btnCancelar} onClick={props.onClose}>
            Cancelar
          </button>
          <button
            className={styles.btnEnviar}
            onClick={handleEnviar}
            disabled={nota === 0}
          >
            Enviar
          </button>
        </div>
      </div>
    </div>
  );
}
