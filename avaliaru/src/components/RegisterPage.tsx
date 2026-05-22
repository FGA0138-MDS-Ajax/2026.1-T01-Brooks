"use client";

import { useState } from "react";
import Link from "next/link";
import { User, Mail, AlertTriangle, Loader2 } from "lucide-react";
import Input from "./Input";

export default function RegisterPage() {
  const [password, setPassword] = useState("");
  const [confirmedPassword, setConfirmedPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);

    const fullName = formData.get("full-name") as string;
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    // Simulação de cadastro no banco de dados, tempo de espera de 2 segundos
    setIsLoading(true);
    setTimeout(() => {
      console.log("Cadastro Concluido");
      console.log("Nome Completo: " + fullName);
      console.log("Email: " + email);
      console.log("Senha: " + password);

      setIsLoading(false);
    }, 2000);
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
              name="full-name"
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
        <Link href="/" className="switch-btn switch-btn-register">
          Faça Login
        </Link>
      </div>
    </div>
  );
}
