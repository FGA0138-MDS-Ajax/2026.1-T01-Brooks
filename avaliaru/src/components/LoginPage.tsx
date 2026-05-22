import { useState } from "react";
import Link from "next/link";
import { User, Lock, Loader2 } from "lucide-react";
import Input from "./Input";

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);

    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    // Simulação de cadastro no banco de dados, tempo de espera de 2 segundos
    setIsLoading(true);
    setTimeout(() => {
      console.log("Email: " + email);
      console.log("Senha: " + password);
      setIsLoading(false);
    }, 2000);
  };
  return (
    <div id="login-form">
      <div className="form-header">
        <h2 className="login-title">Bem-vindo de volta!</h2>
        <p>Acesse sua conta para ver o cardápio de hoje.</p>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>E-mail</label>
          <div className="input-container">
            <Input
              name="email"
              icon={User}
              size={18}
              type="text"
              placeholder="usuario@aluno.unb.br"
              required={true}
            />
          </div>
        </div>

        <div className="form-group">
          <div className="form-label-row">
            <label>Senha</label>
            <Link href="/forgot-password" className="form-link">
              Esqueceu a senha?
            </Link>
          </div>
          <div className="input-container">
            <Input
              name="password"
              icon={Lock}
              size={18}
              type="password"
              placeholder="••••••••"
              required={true}
            />
          </div>
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
