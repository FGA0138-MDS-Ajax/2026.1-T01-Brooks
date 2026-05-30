"use client";

import { useState } from "react";
import styles from "./AvaliacaoModal.module.css";

type AvaliacaoModalProps = {
  dia: string;
  pratoPrincipal: string;
  onClose: () => void;
};

export default function AvaliacaoModal({ dia, pratoPrincipal, onClose }: AvaliacaoModalProps) {
  const [nota, setNota] = useState(0);
  const [comentario, setComentario] = useState("");
  const [enviado, setEnviado] = useState(false);

  function handleEnviar() {
    if (nota === 0) return;
    setEnviado(true);
    setTimeout(() => {
      onClose();
    }, 2000);
  }

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
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <h2>Avaliar Almoço</h2>
        <p>{dia} — {pratoPrincipal}</p>

        <div className={styles.estrelas}>
          {[1, 2, 3, 4, 5].map((n) => (
            <button
              key={n}
              onClick={() => setNota(n)}
              className={nota >= n ? styles.estrelaSelecionada : styles.estrela}
            >
              ★
            </button>
          ))}
        </div>

        <textarea
          placeholder="Comentário (opcional)..."
          value={comentario}
          onChange={(e) => setComentario(e.target.value)}
          rows={3}
        />

        <button onClick={handleEnviar} disabled={nota === 0}>
          Enviar
        </button>

        <button onClick={onClose}>
          Cancelar
        </button>
      </div>
    </div>
  );
}
