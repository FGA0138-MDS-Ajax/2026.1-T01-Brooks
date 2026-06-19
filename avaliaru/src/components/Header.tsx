"use client";

import type { UsuarioPerfil } from "@/types/types";
import { LogOut, UserRound } from "lucide-react";
import Image from "next/image";
import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import styles from "./Header.module.css";

const ROTA_PERFIL: Record<UsuarioPerfil, string> = {
  aluno: "/dashboard/aluno",
  gestorru: "/gestao/gestor",
  adm: "/admin/adm",
};

export default function Header({ perfil }: { perfil: UsuarioPerfil | undefined }) {
  const router = useRouter();

  if (!perfil) return null;

  return (
    <header className={styles.header}>
      <div className={styles.brand}>
        <span className={styles.logoWrapper}>
          <Image src="/logo-avaliaru.png" alt="" width={42} height={42} priority />
        </span>
        <span className={styles.brandText}>
          <strong>AvaliaRU</strong>
          <small>Restaurante Universitário - FCTE</small>
        </span>
      </div>

      <nav className={styles.actions} aria-label="Ações da conta">
        <button
          type="button"
          className={styles.profileButton}
          onClick={() => router.push(ROTA_PERFIL[perfil])}
        >
          <UserRound size={18} aria-hidden="true" />
          Meus dados
        </button>

        <button
          type="button"
          className={styles.logoutButton}
          onClick={() => signOut({ callbackUrl: "/login" })}
        >
          <LogOut size={18} aria-hidden="true" />
          Sair
        </button>
      </nav>
    </header>
  );
}
