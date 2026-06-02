"use client";

import { useState } from "react";
import Link from "next/link";
import SuccessPassword from "./SuccessPassword";
import Input from "../Input/Input";
import { Mail, Loader2 } from "lucide-react";

export default function ForgotPasswordPage() {
  const [isSent, setIsSent] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const handleSubmit = (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;
    // Envio de email feito pela API
    setIsLoading(true);
    setTimeout(() => {
      console.log("email: " + email);
      setIsLoading(false);
      setIsSent(true);
    }, 2000);
  };

  // TELA 2: Confirmação de envio
  if (isSent) {
    return <SuccessPassword />;
  }

  // TELA 1: Formulário de Solicitação
  return (
    <div id="forgot-password-form">
      <div className="form-header">
        <h2 className="page-title">Recuperar Senha</h2>
        <p>Insira o seu e-mail para receber as instruções de redefinição.</p>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>E-mail </label>
          <Input
            name="email"
            required={true}
            icon={Mail}
            size={18}
            type="email"
            placeholder="matricula@aluno.unb.br"
          />
        </div>

        <button
          type="submit"
          className="btn btn-login"
          style={{ marginTop: "24px" }}
        >
          {isLoading ? (
            <div className="flex items-center justify-center gap-2">
              <Loader2 className="animate-spin" size={18} />
              <span>Carregando...</span>
            </div>
          ) : (
            "Enviar Link de Recuperação"
          )}
        </button>
      </form>

      <div className="switch-form-text">
        Lembrou a senha?{" "}
        <Link
          href="/"
          className="form-link"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "4px",
            fontWeight: "600",
          }}
        >
          Faça Login
        </Link>
      </div>
    </div>
  );
}
