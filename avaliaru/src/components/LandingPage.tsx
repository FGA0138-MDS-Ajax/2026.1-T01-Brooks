import { Sparkles } from "lucide-react";
import Link from "next/link";

export default function LandingPage() {
  return (
    <div className="landing-content">
      <section className="hero">
        <div className="badge-topo">
          <Sparkles size={16} />
          <span>Feito para a comunidade FGA</span>
        </div>
        <h2 className="hero-title">Bem-Vindo.</h2>
        <p className="hero-description">
          Acompanhe o cardápio do dia, veja a nota das refeições e configure
          alertas sobre ingredientes para a comunidade FGA.
        </p>
        {/* Buttons */}
        <div className="cta-buttons">
          <Link href="/register" className="btn btn-green">
            Criar Conta
          </Link>
          <a href="/dashboard" className="btn btn-outline">
            Ver Cardápio
          </a>
        </div>
      </section>

      <nav className="top-nav">
        <span className="nav-text">Já possui uma conta?</span>
        <Link href="/login" className="nav-link">
          Faça Login
        </Link>
      </nav>
    </div>
  );
}
