"use client";

import { useState } from "react";
import Link from "next/link";
import { User, Lock, Loader2 } from "lucide-react";
import Input from "../Input/Input";
import { loginUser } from "@/actions/login";
import myAlert from "@/lib/alert";

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);

    setIsLoading(true);

    loginUser(formData)
      .catch((error) => {
        if (error instanceof Error && error.message.includes("NEXT_REDIRECT")) {
          return;
        }

        // 2. Trata os erros reais de login aqui embaixo
        if (error instanceof Error) {
          if (error.name === "CredentialsSignin"){
            myAlert.error("E-mail ou senha incorretos. Por favor, tente novamente.");
            return;
          }

          myAlert.error(
            "Ocorreu um erro ao tentar fazer login. Por favor, tente novamente.\n" +
              error.message,
          );
        } else {
          console.error("Erro desconhecido ao fazer login:", error);
          myAlert.error(
            "Ocorreu um erro desconhecido ao tentar fazer login. Por favor, tente novamente.",
          );
        }
      })
      .finally(() => {
        setIsLoading(false);
      });
  };
  return (
    <div id="login-form">
      <div className="form-header">
        <h2 className="page-title">Bem-vindo de volta!</h2>
        <p>Acesse sua conta para ver o cardápio de hoje.</p>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>E-mail</label>
          <Input
            name="email"
            icon={User}
            size={18}
            type="text"
            placeholder="usuario@aluno.unb.br"
            required={true}
          />
        </div>

        <div className="form-group">
          <div className="form-label-row">
            <label>Senha</label>
            <Link href="/forgot-password" className="form-link">
              Esqueceu a senha?
            </Link>
          </div>
          <Input
            name="password"
            icon={Lock}
            size={18}
            type="password"
            placeholder="••••••••"
            required={true}
          />
        </div>

        <button type="submit" className="btn btn-login">
          {isLoading ? (
            <div className="flex items-center justify-center gap-2">
              <Loader2 className="animate-spin" size={18} />
              <span>Carregando...</span>
            </div>
          ) : (
            "Entrar"
          )}
        </button>
      </form>

      <div className="switch-form-text">
        Não tem uma conta?{" "}
        <Link href="/register" className="switch-btn switch-btn-login">
          Cadastre-se
        </Link>
      </div>
    </div>
  );
}
