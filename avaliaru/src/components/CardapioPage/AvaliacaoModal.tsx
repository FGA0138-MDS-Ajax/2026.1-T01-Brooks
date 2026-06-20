"use client";

import { useState } from "react";
import styles from "./AvaliacaoModal.module.css";
import { Loader, Star } from "lucide-react";
import myAlert from "@/lib/alert";
import { cadastrarAvaliacao } from "@/actions/avaliacaoActions/cadastrarAvaliacao";
import { Session } from "next-auth";

type AvaliacaoModalProps = {
  dia?: string;
  pratoPrincipal: string;
  onClose: () => void;
};

export default function AvaliacaoModal({ props, session, dataCardapio }: { props: AvaliacaoModalProps, session: Session | null, dataCardapio: string }) {
  const [nota, setNota] = useState(0);
  const [comentario, setComentario] = useState("");
  const [enviado, setEnviado] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleEnviar = async () => {
    try {
      setLoading(true);

      const result = await cadastrarAvaliacao({
        dataHoraAvaliacao: new Date(),
        statusModeracao: false,
        nota,
        comentario,
        fkCardapioDiario: dataCardapio,
        fkEstudante: session?.user.id || "",
      });

      console.log(result)

      setEnviado(true);

    } catch (error) {
      myAlert.error("Erro ao enviar avaliação. Tente novamente. " + error);

    } finally {
      setLoading(false);
    }
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

  if (loading) {
    return (
      <div className={styles.overlay}>
        <div className={styles.modal}>
          <Loader size={48} className="animate-spin" />
          <p>Enviando avaliação...</p>
        </div>
      </div>
    );
  }

  if (enviado) {
    return (
      <div className={styles.overlay}>
        <div className={styles.modal}>
          <p>Avaliação enviada! Obrigado.</p>
          <button className={styles.btnFechar} onClick={props.onClose}>
            Fechar
          </button>
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
          {/* {props.dia
            ? `${props.dia} — ${props.pratoPrincipal}`
            : props.pratoPrincipal} */}
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
