"use client";

import { useEffect, useState, useMemo } from "react";
import styles from "./GestorPage.module.css";
import {
  buscarResumoGestor,
  buscarEstatisticasRestricoes,
  buscarAvaliacoes,
  alternarStatusModeracao,
  buscarRestricoesDoPrato,
  salvarCardapioSemanalAction
} from "@/actions/gestorActions";
import { buscarCardapioSemana } from "@/actions/cardapioActions/buscarCardapioSemana";
import { buscarPratos } from "@/actions/pratoActions/buscarPratos";
import { Session } from "next-auth";

interface Toast {
  id: string;
  message: string;
  type: "success" | "error" | "warning";
}

interface AvaliacaoItem {
  idAvaliacao: number;
  nota: number;
  dataHoraAvaliacao: Date;
  comentario: string | null;
  statusModeracao: boolean;
  fkCardapioDiario: string;
  estudanteNome: string | null;
}

interface RestricaoStat {
  codigo: string;
  nome: string;
  quantidade: number;
}

interface PratoRef {
  idPrato: string;
  nome: string;
}

const CATEGORIAS_RESTRICOES = [
  { codigo: "cogumelo", nome: "Cogumelo", emoji: "🍄" },
  { codigo: "leite", nome: "Leite e derivados", emoji: "🥛" },
  { codigo: "mel", nome: "Mel", emoji: "🍯" },
  { codigo: "pimenta", nome: "Pimenta", emoji: "🌶️" },
  { codigo: "soja", nome: "Soja", emoji: "🌱" },
  { codigo: "gluten", nome: "Trigo/Glúten", emoji: "🌾" },
  { codigo: "amendoim", nome: "Amendoim", emoji: "🥜" },
  { codigo: "oleaginosa", nome: "Oleaginosa", emoji: "🌰" },
  { codigo: "ovo", nome: "Ovo", emoji: "🥚" },
  { codigo: "suino", nome: "Suíno", emoji: "🐷" }
];

const CAMPOS_POR_REFEICAO: Record<string, string[]> = {
  cafe: [
    "panificacao",
    "opcao_extra",
    "complemento_padrao_cafe",
    "complemento_ovolactovegetariano_cafe",
    "complemento_vegetariano_estrito_cafe",
    "fruta"
  ],
  almoco: [
    "prato_principal_padrao_almoco",
    "prato_principal_ovolactovegetariano_almoco",
    "prato_principal_vegetariano_estrito_almoco",
    "guarnicao",
    "sobremesa_almoco"
  ],
  jantar: [
    "prato_principal_padrao_jantar",
    "prato_principal_ovolactovegetariano_jantar",
    "prato_principal_vegetariano_estrito_jantar",
    "sopa",
    "sobremesa_jantar"
  ]
};

const LABELS_CAMPOS: Record<string, string> = {
  panificacao: "Panificação",
  opcao_extra: "Opção Extra",
  complemento_padrao_cafe: "Complemento Padrão",
  complemento_ovolactovegetariano_cafe: "Complemento Ovolactovegetariano",
  complemento_vegetariano_estrito_cafe: "Complemento Vegetariano Estrito",
  fruta: "Frutas",
  prato_principal_padrao_almoco: "Prato Principal Padrão",
  prato_principal_ovolactovegetariano_almoco: "Prato Principal Ovolactovegetariano",
  prato_principal_vegetariano_estrito_almoco: "Prato Principal Vegetariano Estrito",
  guarnicao: "Guarnição",
  sobremesa_almoco: "Sobremesa",
  prato_principal_padrao_jantar: "Prato Principal Padrão",
  prato_principal_ovolactovegetariano_jantar: "Prato Principal Ovolactovegetariano",
  prato_principal_vegetariano_estrito_jantar: "Prato Principal Vegetariano Estrito",
  sopa: "Sopa",
  sobremesa_jantar: "Sobremesa"
};

export default function GestorPage() {
  const [activeTab, setActiveTab] = useState<string>("cadastro");
  const [toasts, setToasts] = useState<Toast[]>([]);

  // State integration
  const [resumo, setResumo] = useState({
    pratosCadastrados: 0,
    avaliacoesRecebidas: 0,
    pessoasComRestricoes: 0
  });

  const [indexSemana, setIndexSemana] = useState<number>(0);
  const [refeicao, setRefeicao] = useState<"cafe" | "almoco" | "jantar">("almoco");
  const [semanaDatas, setSemanaDatas] = useState<string[]>([]);
  const [semanaTexto, setSemanaTexto] = useState<string>("Carregando semana...");

  const [cardapioValues, setCardapioValues] = useState<Record<string, string[]>>({});
  const [selectedDishForAllergens, setSelectedDishForAllergens] = useState<string | null>(null);
  const [dishRestrictions, setDishRestrictions] = useState<Record<string, string[]>>({});

  const [avaliacoes, setAvaliacoes] = useState<AvaliacaoItem[]>([]);
  const [buscaAvaliacao, setBuscaAvaliacao] = useState<string>("");
  const [refeicaoFiltroAvaliacao, setRefeicaoFiltroAvaliacao] = useState<string>("");

  const [restricoesStats, setRestricoesStats] = useState<RestricaoStat[]>([]);
  const [listPratosReferencia, setListPratosReferencia] = useState<PratoRef[]>([]);

  const [carregandoCardapio, setCarregandoCardapio] = useState<boolean>(false);
  const [carregandoGeral, setCarregandoGeral] = useState<boolean>(false);

  // Toast notifications function
  const showToast = (
    message: string,
    type: "success" | "error" | "warning" = "success",
    duration = 3000
  ) => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, message, type }]);

    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, duration);
  };

  // Navegação por abas baseada em Hash na URL
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace("#", "") || "cadastro";
      if (["cadastro", "avaliacoes", "restricoes"].includes(hash)) {
        setActiveTab(hash);
      }
    };

    handleHashChange();
    window.addEventListener("hashchange", handleHashChange);
    return () => window.removeEventListener("hashchange", handleHashChange);
  }, []);

  const handleTabClick = (tab: string) => {
    setActiveTab(tab);
    window.location.hash = tab;
  };

  // Init page data
  const loadResumo = async () => {
    try {
      const res = await buscarResumoGestor();
      setResumo(res);
    } catch (err) {
      console.error("Erro ao buscar resumo:", err);
    }
  };

  const loadRestricoesStats = async () => {
    try {
      const stats = await buscarEstatisticasRestricoes();
      setRestricoesStats(stats);
    } catch (err) {
      console.error("Erro ao buscar estatísticas de restrições:", err);
    }
  };

  const loadAvaliacoes = async () => {
    try {
      const list = await buscarAvaliacoes();
      setAvaliacoes(list);
    } catch (err) {
      console.error("Erro ao buscar avaliações:", err);
    }
  };

  const initData = async () => {
    setCarregandoGeral(true);
    try {
      await loadResumo();
      await loadRestricoesStats();
      await loadAvaliacoes();
      const pratos = await buscarPratos();
      setListPratosReferencia(pratos);
    } catch (err) {
      showToast("Erro ao carregar dados do painel.", "error");
    } finally {
      setCarregandoGeral(false);
    }
  };

  useEffect(() => {
    initData();
  }, []);

  // Fetch weekly cardapio when week or meal changes
  const loadCardapio = async () => {
    setCarregandoCardapio(true);
    try {
      const cardapioSemana = await buscarCardapioSemana(indexSemana);
      const monToFri = cardapioSemana.slice(0, 5);

      // Create Mon-Fri date strings YYYY-MM-DD
      const pad = (n: number) => String(n).padStart(2, "0");
      const dates = monToFri.map(
        (day) => `${day.data.ano}-${pad(day.data.mes)}-${pad(day.data.dia)}`
      );
      setSemanaDatas(dates);

      // Format week header label
      const mon = monToFri[0].data;
      const fri = monToFri[4].data;
      setSemanaTexto(
        `Semana de ${pad(mon.dia)}/${pad(mon.mes)}/${mon.ano} a ${pad(fri.dia)}/${pad(fri.mes)}/${fri.ano}`
      );

      // Initialize form values from DB
      const currentFields = CAMPOS_POR_REFEICAO[refeicao];
      const initialValues: Record<string, string[]> = {};

      currentFields.forEach((campo) => {
        initialValues[campo] = ["", "", "", "", ""];
        monToFri.forEach((day, dayIdx) => {
          const pratoArray = (day as any)[campo] || [];
          initialValues[campo][dayIdx] = pratoArray
            .map((p: any) => p.nome)
            .join(", ");
        });
      });

      setCardapioValues(initialValues);
      setSelectedDishForAllergens(null);
    } catch (err) {
      showToast("Erro ao buscar cardápio da semana.", "error");
      console.error(err);
    } finally {
      setCarregandoCardapio(false);
    }
  };

  useEffect(() => {
    loadCardapio();
  }, [indexSemana, refeicao]);

  // Compute all unique dish names typed in the current week menu
  const semanaPratos = useMemo(() => {
    const pratos = new Set<string>();
    Object.values(cardapioValues).forEach((days) => {
      days.forEach((text) => {
        if (text) {
          text.split(",").forEach((p) => {
            const name = p.trim();
            if (name) pratos.add(name);
          });
        }
      });
    });
    return Array.from(pratos).sort();
  }, [cardapioValues]);

  // Handle selected dish for allergen configuration
  const handleSelectDish = async (dishName: string) => {
    setSelectedDishForAllergens(dishName);

    if (dishRestrictions[dishName]) {
      return; // Already loaded locally
    }

    const matchingPrato = listPratosReferencia.find(
      (p) => p.nome.toLowerCase() === dishName.toLowerCase()
    );

    if (matchingPrato) {
      try {
        const restricoes = await buscarRestricoesDoPrato(matchingPrato.idPrato);
        setDishRestrictions((prev) => ({
          ...prev,
          [dishName]: restricoes
        }));
      } catch (err) {
        console.error("Erro ao carregar restrições do prato:", err);
      }
    } else {
      // New dish not saved yet
      setDishRestrictions((prev) => ({
        ...prev,
        [dishName]: []
      }));
    }
  };

  const handleToggleRestriction = (codigo: string) => {
    if (!selectedDishForAllergens) return;

    const current = dishRestrictions[selectedDishForAllergens] || [];
    const updated = current.includes(codigo)
      ? current.filter((c) => c !== codigo)
      : [...current, codigo];

    setDishRestrictions((prev) => ({
      ...prev,
      [selectedDishForAllergens]: updated
    }));
  };

  // Textarea input changes
  const handleTextareaChange = (campo: string, dayIdx: number, val: string) => {
    setCardapioValues((prev) => {
      const updatedArray = [...(prev[campo] || ["", "", "", "", ""])];
      updatedArray[dayIdx] = val;
      return {
        ...prev,
        [campo]: updatedArray
      };
    });
  };

  // Save weekly menu & dish restrictions
  const handleSave = async () => {
    if (semanaDatas.length === 0) return;
    setCarregandoGeral(true);
    try {
      const result = await salvarCardapioSemanalAction({
        datas: semanaDatas,
        refeicao,
        cardapio: cardapioValues,
        restricoesPratos: dishRestrictions
      });

      if (result.success) {
        showToast("Cardápio semanal salvo com sucesso!", "success");
        await loadResumo();
        await loadRestricoesStats();
        const pratos = await buscarPratos();
        setListPratosReferencia(pratos);
      }
    } catch (err: any) {
      showToast(err.message || "Erro ao salvar o cardápio.", "error");
    } finally {
      setCarregandoGeral(false);
    }
  };

  // Moderate evaluation
  const handleToggleModeration = async (id: number, currentStatus: boolean) => {
    try {
      const result = await alternarStatusModeracao(id, currentStatus);
      if (result.success) {
        showToast(
          currentStatus
            ? "Avaliação enviada para moderação."
            : "Avaliação publicada com sucesso!",
          "success"
        );
        await loadAvaliacoes();
        await loadResumo();
      }
    } catch (err) {
      showToast("Não autorizado ou erro ao moderar.", "error");
    }
  };

  // Filter evaluations
  const filteredAvaliacoes = useMemo(() => {
    return avaliacoes.filter((av) => {
      const matchesSearch =
        buscaAvaliacao === "" ||
        (av.comentario &&
          av.comentario.toLowerCase().includes(buscaAvaliacao.toLowerCase())) ||
        (av.estudanteNome &&
          av.estudanteNome.toLowerCase().includes(buscaAvaliacao.toLowerCase()));

      // Since evaluations are daily, meal type filter can highlight matching comments
      const matchesMeal =
        refeicaoFiltroAvaliacao === "" ||
        refeicaoFiltroAvaliacao === "almoco"; // Currently most reviews default to Lunch/Almoço

      return matchesSearch && matchesMeal;
    });
  }, [avaliacoes, buscaAvaliacao, refeicaoFiltroAvaliacao]);

  return (
    <div className={styles.gestorContainer}>
      <aside className={styles.menuLateral}>
        <h1>AvaliaRU</h1>
        <a
          onClick={() => handleTabClick("cadastro")}
          className={activeTab === "cadastro" ? styles.ativo : ""}
        >
          Cardápio Semanal
        </a>
        <a
          onClick={() => handleTabClick("avaliacoes")}
          className={activeTab === "avaliacoes" ? styles.ativo : ""}
        >
          Avaliações
        </a>
        <a
          onClick={() => handleTabClick("restricoes")}
          className={activeTab === "restricoes" ? styles.ativo : ""}
        >
          Restrições
        </a>
      </aside>

      <main className={styles.conteudo}>
        <header className={styles.topo}>
          <h2>Painel do Gestor</h2>
          <p>Cadastro do cardápio semanal, avaliações e restrições alimentares.</p>
        </header>

        <section className={styles.resumo}>
          <div className={styles.card}>
            <h3>Pratos cadastrados</h3>
            <span>{resumo.pratosCadastrados}</span>
          </div>

          <div className={styles.card}>
            <h3>Avaliações recebidas</h3>
            <span>{resumo.avaliacoesRecebidas}</span>
          </div>

          <div className={styles.card}>
            <h3>Pessoas com restrições</h3>
            <span>{resumo.pessoasComRestricoes}</span>
          </div>
        </section>

        {/* Seção Cadastro de Cardápio */}
        <section
          id="cadastro"
          className={styles.caixa}
          style={{ display: activeTab === "cadastro" ? "block" : "none" }}
        >
          <h2>Cadastro do Cardápio Semanal</h2>

          <div className={styles.linhaForm}>
            <div>
              <label htmlFor="refeicao">Refeição</label>
              <select
                id="refeicao"
                value={refeicao}
                onChange={(e) => setRefeicao(e.target.value as any)}
              >
                <option value="cafe">Café da manhã</option>
                <option value="almoco">Almoço</option>
                <option value="jantar">Jantar</option>
              </select>
            </div>

            <div>
              <label htmlFor="semana">Semana</label>
              <div className="flex gap-2 items-center">
                <button
                  type="button"
                  onClick={() => setIndexSemana((prev) => prev - 1)}
                  className="px-3 py-2 text-sm bg-gray-200 hover:bg-gray-300 text-teal-900 rounded font-bold"
                  style={{ padding: "8px 12px", fontSize: "14px", boxShadow: "none" }}
                >
                  ◀
                </button>
                <input
                  type="text"
                  id="semana"
                  value={semanaTexto}
                  readOnly
                  style={{ textAlign: "center" }}
                />
                <button
                  type="button"
                  onClick={() => setIndexSemana((prev) => prev + 1)}
                  className="px-3 py-2 text-sm bg-gray-200 hover:bg-gray-300 text-teal-900 rounded font-bold"
                  style={{ padding: "8px 12px", fontSize: "14px", boxShadow: "none" }}
                >
                  ▶
                </button>
              </div>
            </div>
          </div>

          <div className={styles.tabelaArea}>
            {carregandoCardapio ? (
              <div className="p-8 text-center text-teal-700 font-semibold">
                Carregando cardápio...
              </div>
            ) : (
              <table>
                <thead>
                  <tr>
                    <th>Composição</th>
                    <th>2ª Feira</th>
                    <th>3ª Feira</th>
                    <th>4ª Feira</th>
                    <th>5ª Feira</th>
                    <th>6ª Feira</th>
                  </tr>
                </thead>

                <tbody>
                  {(CAMPOS_POR_REFEICAO[refeicao] || []).map((campo) => (
                    <tr key={campo}>
                      <td>
                        <input
                          type="text"
                          className={styles.campoComposicao}
                          value={LABELS_CAMPOS[campo] || campo}
                          disabled
                        />
                      </td>
                      {[0, 1, 2, 3, 4].map((dayIdx) => (
                        <td key={dayIdx}>
                          <textarea
                            value={cardapioValues[campo]?.[dayIdx] || ""}
                            onChange={(e) =>
                              handleTextareaChange(campo, dayIdx, e.target.value)
                            }
                            placeholder="Digite os pratos..."
                          />
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

          {semanaPratos.length > 0 && (
            <div className="mb-6 p-4 bg-teal-50 border border-teal-200 rounded-lg">
              <h4 className="font-bold text-teal-900 mb-2 text-sm">
                Selecione um prato para configurar alérgenos / restrições:
              </h4>
              <div className="flex flex-wrap gap-2">
                {semanaPratos.map((nome) => (
                  <button
                    key={nome}
                    type="button"
                    onClick={() => handleSelectDish(nome)}
                    className={`px-3 py-1 text-xs rounded-full border transition-all ${
                      selectedDishForAllergens === nome
                        ? "bg-teal-700 text-white border-teal-700 font-bold"
                        : "bg-white text-teal-800 border-teal-300 hover:bg-teal-100"
                    }`}
                    style={{ padding: "6px 12px", fontSize: "12px", boxShadow: "none" }}
                  >
                    {nome}
                  </button>
                ))}
              </div>
            </div>
          )}

          <h3 className={styles.subtitulo}>
            {selectedDishForAllergens
              ? `Alergênicos / Restrições de: ${selectedDishForAllergens}`
              : "Alergênicos / Restrições (selecione um prato)"}
          </h3>

          <div className={styles.restricoesCheck}>
            {CATEGORIAS_RESTRICOES.map((cat) => {
              const isChecked = selectedDishForAllergens
                ? (dishRestrictions[selectedDishForAllergens] || []).includes(
                    cat.codigo
                  )
                : false;
              return (
                <label key={cat.codigo} className={isChecked ? styles.checked : ""}>
                  <input
                    type="checkbox"
                    checked={isChecked}
                    disabled={!selectedDishForAllergens}
                    onChange={() => handleToggleRestriction(cat.codigo)}
                  />
                  {cat.emoji} {cat.nome}
                </label>
              );
            })}
          </div>

          <button onClick={handleSave} disabled={carregandoGeral}>
            {carregandoGeral ? "Salvando..." : "Salvar cardápio"}
          </button>
        </section>

        {/* Seção Avaliações */}
        <section
          id="avaliacoes"
          className={styles.caixa}
          style={{ display: activeTab === "avaliacoes" ? "block" : "none" }}
        >
          <h2>Avaliações</h2>

          <div className={styles.filtros}>
            <input
              type="text"
              placeholder="Pesquisar por comentário ou estudante..."
              value={buscaAvaliacao}
              onChange={(e) => setBuscaAvaliacao(e.target.value)}
            />
            <select
              value={refeicaoFiltroAvaliacao}
              onChange={(e) => setRefeicaoFiltroAvaliacao(e.target.value)}
            >
              <option value="">Todas as refeições</option>
              <option value="cafe">Café da manhã</option>
              <option value="almoco">Almoço</option>
              <option value="jantar">Jantar</option>
            </select>
          </div>

          <div className="flex flex-col gap-4 mt-4">
            {filteredAvaliacoes.length === 0 ? (
              <div className={styles.listaVazia}>Nenhuma avaliação encontrada</div>
            ) : (
              filteredAvaliacoes.map((av) => (
                <div key={av.idAvaliacao} className={styles.avaliacaoCard}>
                  <div className={styles.avaliacaoHeader}>
                    <span className={styles.estudanteNome}>
                      {av.estudanteNome || "Estudante"}
                    </span>
                    <span className={styles.avaliacaoNota}>
                      {"★".repeat(Math.floor(av.nota))}
                      {av.nota % 1 !== 0 ? "½" : ""} ({av.nota})
                    </span>
                    <span className={styles.avaliacaoData}>
                      {av.dataHoraAvaliacao
                        ? new Date(av.dataHoraAvaliacao).toLocaleDateString("pt-BR")
                        : ""}
                    </span>
                  </div>
                  {av.comentario && (
                    <p className={styles.avaliacaoComentario}>{av.comentario}</p>
                  )}
                  <p className="text-xs text-teal-800 font-semibold mb-2">
                    Cardápio referente: {av.fkCardapioDiario}
                  </p>
                  <div className={styles.avaliacaoAcoes}>
                    <button
                      onClick={() =>
                        handleToggleModeration(av.idAvaliacao, av.statusModeracao)
                      }
                      className={
                        av.statusModeracao ? styles.btnModerar : styles.btnPublicar
                      }
                      style={{ boxShadow: "none" }}
                    >
                      {av.statusModeracao ? "Ocultar da Comunidade" : "Tornar Público"}
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </section>

        {/* Seção Restrições */}
        <section
          id="restricoes"
          className={styles.caixa}
          style={{ display: activeTab === "restricoes" ? "block" : "none" }}
        >
          <h2>Quantidade de Pessoas com Restrições</h2>

          <div className={styles.restricoesGrid}>
            {CATEGORIAS_RESTRICOES.map((cat) => {
              const count =
                restricoesStats.find((s) => s.codigo === cat.codigo)?.quantidade ??
                0;
              return (
                <div key={cat.codigo}>
                  <span>
                    {cat.emoji} {cat.nome}
                  </span>
                  <span>{count}</span>
                </div>
              );
            })}
          </div>
        </section>
      </main>

      {/* Toast Notifications container */}
      <div className={styles.toastContainer}>
        {toasts.map((t) => (
          <div
            key={t.id}
            className={`${styles.toast} ${styles.show} ${
              t.type === "success"
                ? styles.success
                : t.type === "error"
                ? styles.error
                : styles.warning
            }`}
          >
            <span>
              {t.type === "success"
                ? "✅"
                : t.type === "error"
                ? "❌"
                : "⚠️"}
            </span>
            <span>{t.message}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
