"use client";

import LeftBar from "@/components/LeftBar";
import RegisterPage from "@/components/RegisterPage";

export default function RegisterRoute() {
  return (
    <div className="container">
      {/* O mesmo Lado Esquerdo Fixo */}
      <LeftBar />

      {/* Lado Direito com o Formulário de Cadastro */}
      <div className="form-side">
        <RegisterPage />
      </div>
    </div>
  );
}
