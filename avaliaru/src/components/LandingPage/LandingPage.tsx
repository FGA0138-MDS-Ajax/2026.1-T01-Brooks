import { Sparkles } from "lucide-react";
import Link from "next/link";
import styles from "./LandingPage.module.css";

export default function LandingPage() {
  return (
    <div className={styles["landing-content"]}>
      <section className={styles.hero}>
        <div className={styles["badge-topo"]}>
          <Sparkles size={16} />
          <span>Feito para a comunidade FGA</span>
        </div>
        <h2 className={styles["hero-title"]}>Bem-Vindo.</h2>
        <p className={styles["hero-description"]}>
          Acompanhe o cardápio do dia, veja a nota das refeições e configure
          alertas sobre ingredientes para a comunidade FGA.
        </p>

        <div className={styles["cta-buttons"]}>
          <Link
            href="/register"
            className={`${styles["btn-landing"]} ${styles["btn-green"]}`}
          >
            Criar Conta
          </Link>
          <a
            href="/dashboard"
            className={`${styles["btn-landing"]} ${styles["btn-outline"]}`}
          >
            Ver Cardápio
          </a>
        </div>
      </section>

      <nav className={styles["top-nav"]}>
        <span className={styles["nav-text"]}>Já possui uma conta?</span>
        <Link href="/login" className={styles["nav-link"]}>
          Faça Login
        </Link>
      </nav>
    </div>
  );
}
