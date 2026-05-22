"use client"; // Diz ao Next.js que este componente precisa rodar no navegador (Cliente)

import LoginPage from '@/components/LoginPage';
import LeftBar from '../components/LeftBar';

export default function Home() {
    return (
        <div className="container">
            {/* Barra Esquerda: Identidade Visual */}
            < LeftBar />

            {/* Barra Direita: Formulários Dinâmicos */}
            <div className="form-side">
                < LoginPage />
            </div>
        </div>
    );
}