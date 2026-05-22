import { Sparkles } from 'lucide-react';
import Link from "next/link";

export default function LandingPage() {
  return (
    <div className="landing-content">
      {/* Navegação do Topo */}

      {/* Hero Section */}
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

      {/* Mini-grid de Funcionalidades */}
      {/* <section className="features">
        <div className="feature-item">
          <div className="feature-icon text-blue">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2" />
              <path d="M7 2v20" />
              <path d="M21 15V2a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3Zm0 0v7" />
            </svg>
          </div>
          <div>
            <h3>Cardápio</h3>
            <p>Almoço e jantar diário.</p>
          </div>
        </div>

        <div className="feature-item">
          <div className="feature-icon text-green">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
            </svg>
          </div>
          <div>
            <h3>Avaliações</h3>
            <p>Notas reais de alunos.</p>
          </div>
        </div>

        <div className="feature-item">
          <div className="feature-icon text-orange">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" />
              <path d="M12 9v4" />
              <path d="M12 17h.01" />
            </svg>
          </div>
          <div>
            <h3>Alérgenos</h3>
            <p>Alertas de ingredientes.</p>
          </div>
        </div>
      </section> */}
    </div>
  );
}
