"use client";

import {
  CalendarDays,
  Heart,
  ListChecks,
  LogOut,
  Menu,
  Plus,
  ShieldCheck,
  Star,
  User,
  UtensilsCrossed,
  Wheat,
  X,
  type LucideIcon,
} from "lucide-react";
import { signOut } from "next-auth/react";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import styles from "./Header.module.css";

type Perfil = "aluno" | "gestorru" | "adm";

type MenuOption = {
  label: string;
  rota: string;
  icon: LucideIcon;
};

const ROTAS_PERFIL: Record<Perfil, string> = {
  aluno: "/dashboard/aluno",
  gestorru: "/gestao/gestor",
  adm: "/admin/adm",
};

const ROTAS_INICIAIS: Record<Perfil, string> = {
  aluno: "/dashboard",
  gestorru: "/gestao",
  adm: "/admin",
};

const MENU_OPTIONS: Record<Perfil, MenuOption[]> = {
  aluno: [
    { label: "Cardápio", rota: "/dashboard/cardapio", icon: CalendarDays },
    { label: "Restrições", rota: "/dashboard/restricao", icon: Wheat },
    { label: "Favoritos", rota: "/dashboard/favoritos", icon: Heart },
    { label: "Ranking", rota: "/dashboard/ranking", icon: Star },
  ],
  gestorru: [
    { label: "Lista de pratos", rota: "/gestao/listarPratos", icon: ListChecks },
    { label: "Cadastrar prato", rota: "/gestao/cadastrarPrato", icon: Plus },
    {
      label: "Cardápio semanal",
      rota: "/gestao/cadastrarCardapio",
      icon: CalendarDays,
    },
  ],
  adm: [
    { label: "Usuários", rota: "/admin", icon: ShieldCheck },
    { label: "Lista de pratos", rota: "/gestao/listarPratos", icon: ListChecks },
    { label: "Cadastrar prato", rota: "/gestao/cadastrarPrato", icon: Plus },
    {
      label: "Cardápio semanal",
      rota: "/gestao/cadastrarCardapio",
      icon: CalendarDays,
    },
  ],
};

export default function Header({ perfil }: { perfil: Perfil | undefined }) {
  const [menuAberto, setMenuAberto] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  if (!perfil) return null;

  const navegar = (rota: string) => {
    setMenuAberto(false);
    router.push(rota);
  };

  const handleLogout = () => {
    signOut({ callbackUrl: "/login" });
  };

  return (
    <header className={styles.header}>
      <button
        type="button"
        className={styles.brand}
        onClick={() => navegar(ROTAS_INICIAIS[perfil])}
        aria-label="Ir para o início do AvaliaRU"
      >
        <span className={styles.brandIcon} aria-hidden="true">
          <UtensilsCrossed size={21} />
        </span>
        <span>AvaliaRU</span>
      </button>

      <nav className={styles.desktopNav} aria-label="Navegação principal">
        {MENU_OPTIONS[perfil].map((option) => {
          const Icon = option.icon;
          const ativo = pathname === option.rota;

          return (
            <button
              type="button"
              key={option.rota}
              className={`${styles.navButton} ${ativo ? styles.navButtonActive : ""}`}
              onClick={() => navegar(option.rota)}
              aria-current={ativo ? "page" : undefined}
            >
              <Icon size={16} aria-hidden="true" />
              {option.label}
            </button>
          );
        })}
      </nav>

      <div className={styles.desktopActions}>
        <button
          type="button"
          className={styles.profileButton}
          onClick={() => navegar(ROTAS_PERFIL[perfil])}
        >
          <User size={18} aria-hidden="true" />
          Meus dados
        </button>
        <button type="button" className={styles.logoutButton} onClick={handleLogout}>
          <LogOut size={18} aria-hidden="true" />
          Sair
        </button>
      </div>

      <button
        type="button"
        className={styles.menuToggle}
        onClick={() => setMenuAberto((aberto) => !aberto)}
        aria-expanded={menuAberto}
        aria-controls="menu-mobile"
        aria-label={menuAberto ? "Fechar menu" : "Abrir menu"}
      >
        {menuAberto ? <X size={22} aria-hidden="true" /> : <Menu size={22} aria-hidden="true" />}
      </button>

      {menuAberto && (
        <div className={styles.mobileMenu} id="menu-mobile">
          <nav className={styles.mobileNav} aria-label="Navegação móvel">
            {MENU_OPTIONS[perfil].map((option) => {
              const Icon = option.icon;
              const ativo = pathname === option.rota;

              return (
                <button
                  type="button"
                  key={option.rota}
                  className={ativo ? styles.mobileNavActive : ""}
                  onClick={() => navegar(option.rota)}
                  aria-current={ativo ? "page" : undefined}
                >
                  <Icon size={18} aria-hidden="true" />
                  {option.label}
                </button>
              );
            })}
          </nav>

          <div className={styles.mobileActions}>
            <button type="button" onClick={() => navegar(ROTAS_PERFIL[perfil])}>
              <User size={18} aria-hidden="true" />
              Meus dados
            </button>
            <button type="button" className={styles.mobileLogout} onClick={handleLogout}>
              <LogOut size={18} aria-hidden="true" />
              Sair
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
