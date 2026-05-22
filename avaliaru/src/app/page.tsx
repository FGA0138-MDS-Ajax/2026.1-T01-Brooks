"use client"; // Diz ao Next.js que este componente precisa rodar no navegador (Cliente)

import LandingPage from "@/components/LandingPage";
import LeftBar from "../components/LeftBar";

export default function Home() {
  //Implementar página inicial com informações sobre o AvaliaRU, como funciona, etc.
  
  return (
    <div className="container">
      {/* Barra Esquerda: Identidade Visual */}
      <LeftBar />

      {/* Barra Direita: Formulários Dinâmicos */}
      <div id="land-side">
        <LandingPage />
      </div>
    </div>
  );
}
