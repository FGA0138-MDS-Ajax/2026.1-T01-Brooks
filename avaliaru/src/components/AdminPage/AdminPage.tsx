"use client";

import {
  cadastrarUsuarioAdmin,
  type UsuarioAdmin,
} from "@/actions/adminActions/usuarios";
import myAlert from "@/lib/alert";
import type { UsuarioPerfil } from "@/types/types";
import {
  CircleX,
  ClipboardList,
  Database,
  GraduationCap,
  LoaderCircle,
  LockKeyhole,
  Mail,
  Plus,
  Search,
  ShieldCheck,
  Trash2,
  UserCog,
  UserPlus,
  UserRound,
  Users,
  UtensilsCrossed,
} from "lucide-react";
import type { Session } from "next-auth";
import { useRouter } from "next/navigation";
import { useMemo, useRef, useState } from "react";
import styles from "./AdminPage.module.css";

const PERFIL_ROTULO: Record<UsuarioPerfil, string> = {
  aluno: "Aluno",
  gestorru: "Gestor RU",
  adm: "Administrador",
};

export default function AdminPage({
  session,
  usuariosIniciais,
}: {
  session: Session;
  usuariosIniciais: UsuarioAdmin[];
}) {
  const router = useRouter();
  const formRef = useRef<HTMLFormElement>(null);
  const [usuarios, setUsuarios] = useState<UsuarioAdmin[]>(usuariosIniciais);
  const [busca, setBusca] = useState("");
  const [filtroPerfil, setFiltroPerfil] = useState<"todos" | UsuarioPerfil>("todos");
  const [modalAberto, setModalAberto] = useState(false);
  const [salvandoUsuario, setSalvandoUsuario] = useState(false);

  const fecharModal = () => {
    if (salvandoUsuario) return;
    setModalAberto(false);
    formRef.current?.reset();
  };

  const cadastrarUsuario = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const senha = String(formData.get("senha") || "");
    const confirmarSenha = String(formData.get("confirmarSenha") || "");

    if (senha !== confirmarSenha) {
      myAlert.error("As senhas não coincidem.");
      return;
    }

    try {
      setSalvandoUsuario(true);
      const usuario = await cadastrarUsuarioAdmin({
        nome: String(formData.get("nome") || ""),
        email: String(formData.get("email") || ""),
        senha,
        perfil: String(formData.get("perfil") || "aluno") as UsuarioPerfil,
      });

      setUsuarios((usuariosAtuais) =>
        [...usuariosAtuais, usuario].sort((a, b) =>
          a.nome.localeCompare(b.nome, "pt-BR"),
        ),
      );
      setModalAberto(false);
      formRef.current?.reset();
      myAlert.success("Conta cadastrada com sucesso.");
    } catch (error) {
      myAlert.error(error instanceof Error ? error.message : "Não foi possível cadastrar a conta.");
    } finally {
      setSalvandoUsuario(false);
    }
  };

  const usuariosFiltrados = useMemo(() => {
    const termo = busca.trim().toLocaleLowerCase("pt-BR");

    return usuarios.filter((usuario) => {
      const correspondeBusca =
        termo.length === 0 ||
        usuario.nome.toLocaleLowerCase("pt-BR").includes(termo) ||
        usuario.email.toLocaleLowerCase("pt-BR").includes(termo);
      const correspondePerfil = filtroPerfil === "todos" || usuario.perfil === filtroPerfil;

      return correspondeBusca && correspondePerfil;
    });
  }, [busca, filtroPerfil, usuarios]);

  const totais = useMemo(
    () => ({
      todos: usuarios.length,
      alunos: usuarios.filter((usuario) => usuario.perfil === "aluno").length,
      gestores: usuarios.filter((usuario) => usuario.perfil === "gestorru").length,
      administradores: usuarios.filter((usuario) => usuario.perfil === "adm").length,
    }),
    [usuarios],
  );

  const alterarPerfil = (id: string, perfil: UsuarioPerfil) => {
    setUsuarios((usuariosAtuais) =>
      usuariosAtuais.map((usuario) => (usuario.id === id ? { ...usuario, perfil } : usuario)),
    );
    myAlert.success("Perfil atualizado nesta visualização.");
  };

  const removerUsuario = (usuario: UsuarioAdmin) => {
    if (!window.confirm(`Remover ${usuario.nome} da lista?`)) return;

    setUsuarios((usuariosAtuais) => usuariosAtuais.filter((item) => item.id !== usuario.id));
    myAlert.success("Usuário removido desta visualização.");
  };

  return (
    <main className={styles.pageWrapper}>
      <div className={styles.container}>
        <header className={styles.pageHeader}>
          <div>
            <span className={styles.eyebrow}>Área administrativa</span>
            <h1 className={styles.pageTitle}>Gerenciamento de usuários</h1>
            <p className={styles.pageSubtitle}>
              Consulte contas e organize os perfis de acesso do AvaliaRU.
            </p>
          </div>

          <div className={styles.headerActions}>
            <span className={styles.adminIdentity}>
              <ShieldCheck size={18} aria-hidden="true" />
              {session.user.name || "Administrador"}
            </span>
            <button
              type="button"
              className={styles.primaryButton}
              onClick={() => setModalAberto(true)}
            >
              <UserPlus size={18} aria-hidden="true" />
              Nova conta
            </button>
            <button
              type="button"
              className={styles.secondaryButton}
              onClick={() => router.push("/gestao/listarPratos")}
            >
              <UtensilsCrossed size={18} aria-hidden="true" />
              Gestão de pratos
            </button>
          </div>
        </header>

        <section className={styles.summaryStrip} aria-label="Resumo de usuários">
          <div className={styles.summaryItem}>
            <span className={styles.summaryIcon}>
              <Users size={20} aria-hidden="true" />
            </span>
            <span>Total de contas</span>
            <strong>{totais.todos}</strong>
          </div>
          <div className={styles.summaryItem}>
            <span className={styles.summaryIcon}>
              <GraduationCap size={20} aria-hidden="true" />
            </span>
            <span>Alunos</span>
            <strong>{totais.alunos}</strong>
          </div>
          <div className={styles.summaryItem}>
            <span className={styles.summaryIcon}>
              <ClipboardList size={20} aria-hidden="true" />
            </span>
            <span>Gestores RU</span>
            <strong>{totais.gestores}</strong>
          </div>
          <div className={styles.summaryItem}>
            <span className={styles.summaryIcon}>
              <ShieldCheck size={20} aria-hidden="true" />
            </span>
            <span>Administradores</span>
            <strong>{totais.administradores}</strong>
          </div>
        </section>

        <section className={styles.managementPanel}>
          <div className={styles.panelHeader}>
            <div>
              <h2>Contas cadastradas</h2>
              <p>
                {usuariosFiltrados.length}{" "}
                {usuariosFiltrados.length === 1 ? "resultado encontrado" : "resultados encontrados"}
              </p>
            </div>

            <button
              type="button"
              className={styles.backupButton}
              title="A integração de backup será adicionada com o backend"
              disabled
            >
              <Database size={18} aria-hidden="true" />
              Gerar backup
            </button>
          </div>

          <div className={styles.toolbar}>
            <label className={styles.searchField}>
              <Search size={20} aria-hidden="true" />
              <span className={styles.srOnly}>Buscar usuário</span>
              <input
                type="search"
                value={busca}
                onChange={(event) => setBusca(event.target.value)}
                placeholder="Buscar por nome ou e-mail"
              />
            </label>

            <label className={styles.filterField}>
              <span>Perfil</span>
              <select
                value={filtroPerfil}
                onChange={(event) =>
                  setFiltroPerfil(event.target.value as "todos" | UsuarioPerfil)
                }
              >
                <option value="todos">Todos os perfis</option>
                <option value="aluno">Aluno</option>
                <option value="gestorru">Gestor RU</option>
                <option value="adm">Administrador</option>
              </select>
            </label>
          </div>

          <div className={styles.tableWrapper}>
            <table className={styles.userTable}>
              <thead>
                <tr>
                  <th>Usuário</th>
                  <th>Perfil de acesso</th>
                  <th className={styles.actionsHeader}>Ações</th>
                </tr>
              </thead>
              <tbody>
                {usuariosFiltrados.map((usuario) => (
                  <tr key={usuario.id}>
                    <td>
                      <div className={styles.userCell}>
                        <span className={styles.avatar} aria-hidden="true">
                          {usuario.nome.charAt(0).toLocaleUpperCase("pt-BR")}
                        </span>
                        <span>
                          <strong>{usuario.nome}</strong>
                          <small>{usuario.email}</small>
                        </span>
                      </div>
                    </td>
                    <td>
                      <label className={styles.roleControl}>
                        <UserCog size={17} aria-hidden="true" />
                        <span className={styles.srOnly}>Perfil de {usuario.nome}</span>
                        <select
                          value={usuario.perfil}
                          disabled={usuario.perfil === "adm" && totais.administradores === 1}
                          onChange={(event) =>
                            alterarPerfil(usuario.id, event.target.value as UsuarioPerfil)
                          }
                          aria-label={`Perfil de ${usuario.nome}`}
                        >
                          {Object.entries(PERFIL_ROTULO).map(([valor, rotulo]) => (
                            <option key={valor} value={valor}>
                              {rotulo}
                            </option>
                          ))}
                        </select>
                      </label>
                    </td>
                    <td className={styles.actionsCell}>
                      <button
                        type="button"
                        className={styles.deleteButton}
                        onClick={() => removerUsuario(usuario)}
                        disabled={usuario.perfil === "adm" && totais.administradores === 1}
                        aria-label={`Remover ${usuario.nome}`}
                        title={
                          usuario.perfil === "adm" && totais.administradores === 1
                            ? "O sistema deve manter ao menos um administrador"
                            : `Remover ${usuario.nome}`
                        }
                      >
                        <Trash2 size={18} aria-hidden="true" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {usuariosFiltrados.length === 0 && (
              <div className={styles.emptyState}>
                <Users size={28} aria-hidden="true" />
                <strong>Nenhum usuário encontrado</strong>
                <p>Revise a busca ou selecione outro perfil.</p>
              </div>
            )}
          </div>
        </section>
      </div>

      {modalAberto && (
        <div className={styles.modalBackdrop} onMouseDown={fecharModal}>
          <section
            className={styles.modal}
            role="dialog"
            aria-modal="true"
            aria-labelledby="cadastro-usuario-titulo"
            onMouseDown={(event) => event.stopPropagation()}
          >
            <div className={styles.modalHeader}>
              <span className={styles.modalIcon} aria-hidden="true">
                <UserPlus size={22} />
              </span>
              <div>
                <h2 id="cadastro-usuario-titulo">Cadastrar conta</h2>
                <p>Crie uma conta e defina o perfil de acesso ao AvaliaRU.</p>
              </div>
              <button
                type="button"
                className={styles.closeButton}
                onClick={fecharModal}
                aria-label="Fechar cadastro"
                title="Fechar"
              >
                <CircleX size={21} aria-hidden="true" />
              </button>
            </div>

            <form ref={formRef} className={styles.registrationForm} onSubmit={cadastrarUsuario}>
              <label className={styles.formField}>
                <span>Nome completo</span>
                <span className={styles.formInput}>
                  <UserRound size={18} aria-hidden="true" />
                  <input
                    type="text"
                    name="nome"
                    autoComplete="name"
                    placeholder="Nome do usuário"
                    required
                    autoFocus
                  />
                </span>
              </label>

              <label className={styles.formField}>
                <span>E-mail</span>
                <span className={styles.formInput}>
                  <Mail size={18} aria-hidden="true" />
                  <input
                    type="email"
                    name="email"
                    autoComplete="email"
                    placeholder="usuario@unb.br"
                    required
                  />
                </span>
              </label>

              <label className={styles.formField}>
                <span>Perfil de acesso</span>
                <span className={styles.formInput}>
                  <UserCog size={18} aria-hidden="true" />
                  <select name="perfil" defaultValue="aluno" required>
                    <option value="aluno">Aluno</option>
                    <option value="gestorru">Gestor RU</option>
                    <option value="adm">Administrador</option>
                  </select>
                </span>
              </label>

              <label className={styles.formField}>
                <span>Senha temporária</span>
                <span className={styles.formInput}>
                  <LockKeyhole size={18} aria-hidden="true" />
                  <input
                    type="password"
                    name="senha"
                    autoComplete="new-password"
                    placeholder="Mínimo de 8 caracteres"
                    minLength={8}
                    required
                  />
                </span>
              </label>

              <label className={`${styles.formField} ${styles.confirmPasswordField}`}>
                <span>Confirmar senha</span>
                <span className={styles.formInput}>
                  <LockKeyhole size={18} aria-hidden="true" />
                  <input
                    type="password"
                    name="confirmarSenha"
                    autoComplete="new-password"
                    placeholder="Repita a senha"
                    minLength={8}
                    required
                  />
                </span>
              </label>

              <div className={styles.modalActions}>
                <button type="button" className={styles.cancelButton} onClick={fecharModal}>
                  Cancelar
                </button>
                <button type="submit" className={styles.submitButton} disabled={salvandoUsuario}>
                  {salvandoUsuario ? (
                    <LoaderCircle className={styles.spinner} size={18} aria-hidden="true" />
                  ) : (
                    <Plus size={18} aria-hidden="true" />
                  )}
                  {salvandoUsuario ? "Cadastrando..." : "Cadastrar conta"}
                </button>
              </div>
            </form>
          </section>
        </div>
      )}
    </main>
  );
}
