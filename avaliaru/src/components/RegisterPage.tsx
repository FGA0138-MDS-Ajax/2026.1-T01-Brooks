"use client";

import { useState } from "react";
import Link from "next/link";
import { User, Mail, AlertTriangle, Loader2 } from "lucide-react";
import Input from "./Input";
import { registerUser } from "@/actions/register";
import alert from "@/lib/alert";
import myAlert from "@/lib/alert";

export default function RegisterPage() {
  const [password, setPassword] = useState("");
  const [confirmedPassword, setConfirmedPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);

    const password = formData.get("password") as string;
    const confirmedPassword = formData.get("confirmed-password") as string;

    if (password !== confirmedPassword) {
      alert.error("As senhas não coincidem. Por favor, verifique e tente novamente.");
      return;
    }

    setIsLoading(true);

    registerUser(formData)
      .then(() => {
        console.log("Usuário registrado com sucesso!");
        alert.success("Usuário registrado com sucesso! ");
      })
      .catch((error) => {
        if (error instanceof Error && error.message.includes("NEXT_REDIRECT")) {
          return;
        }

        // 2. Trata os erros reais de login aqui embaixo
        if (error instanceof Error) {
          console.error("Erro ao fazer login:", error);
          myAlert.error("Ocorreu um erro ao tentar fazer login. Por favor, tente novamente.\n" + error.message);
        } else {
          console.error("Erro desconhecido ao fazer login:", error);
          myAlert.error("Ocorreu um erro desconhecido ao tentar fazer login. Por favor, tente novamente.");
        }

        console.error("Erro ao registrar usuário:", error);
        alert.error("Ocorreu um erro ao registrar. \n" + error.message);
      })
      .finally(() => {
        setIsLoading(false);
      });

  };


  return (
    <div id="register-form">
      <div className="form-header">
        <h2 className="register-title">Criar Conta</h2>
        <p>Configure seu perfil para alertas personalizados.</p>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Nome Completo</label>
          <div className="input-container">
            <Input
              name="name"
              icon={User}
              size={18}
              type="text"
              placeholder="Seu nome"
              required={true}
            />
          </div>
        </div>

        <div className="form-group">
          <label>E-mail</label>
          <div className="input-container">
            <Input
              name="email"
              icon={Mail}
              size={18}
              type="text"
              placeholder="matricula@aluno.unb.br"
              required={true}
            />
          </div>
        </div>

        <div className="form-group">
          <div className="form-grid">
            <div>
              <label>Senha</label>
              <div className="input-container">
                <Input
                  name="password"
                  type="password"
                  placeholder="••••••••"
                  required={true}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    setPassword(e.target.value);
                  }}
                />
              </div>
            </div>
            <div>
              <label>Confirmar Senha</label>
              <div className="input-container">
                <Input
                  name="confirmed-password"
                  type="password"
                  placeholder="••••••••"
                  required={true}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    setConfirmedPassword(e.target.value);
                  }}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="alert-box">
          <AlertTriangle size={16} color="#B45309" style={{ flexShrink: 0 }} />
          <span>
            Você poderá configurar suas restrições alimentares (alérgenos) e
            pratos favoritos logo após o primeiro acesso.
          </span>
        </div>

        <button
          disabled={password !== confirmedPassword || password === ""}
          type="submit"
          className="btn btn-register"
        >
          {isLoading ? (
            <div className="flex items-center justify-center gap-2">
              <Loader2 className="animate-spin" size={18} />
              <span>Carregando...</span>
            </div>
          ) : (
            "Finalizar Cadastro"
          )}
        </button>
      </form>

      <div className="switch-form-text">
        Já possui uma conta?{" "}
        <Link href="/login" className="switch-btn switch-btn-register">
          Faça Login
        </Link>
      </div>
    </div>
  );
}
