"use client";

import { useState } from 'react';
import Link from 'next/link';
import SuccessPassword from './SuccessPassword';
import { Mail } from 'lucide-react';

export default function ForgotPasswordPage() {
    const [isSent, setIsSent] = useState(false);

    const handleSubmit = (e: React.ChangeEvent) => {
        e.preventDefault();
        // Aqui entrará a chamada para a sua API em Express no futuro
        setIsSent(true);
    };

    // TELA 2: Confirmação de envio
    if (isSent) {
        return (
            < SuccessPassword />
        );
    }

    // TELA 1: Formulário de Solicitação
    return (
        <div id="forgot-password-form">
            <div className="form-header">
                <h2 className="login-title">Recuperar Senha</h2>
                <p>Insira o seu e-mail para receber as instruções de redefinição.</p>
            </div>

            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>E-mail</label>
                    <div className="input-container">
                        <span className="input-icon"><Mail size={18} /></span>
                        <input 
                            type="email" 
                            required 
                            placeholder="matricula@aluno.unb.br" 
                        />
                    </div>
                </div>

                <button type="submit" className="btn btn-login" style={{ marginTop: '24px' }}>
                    Enviar Link de Recuperação
                </button>
            </form>

            <div className="switch-form-text">
                Lembrou a senha?{' '}
                <Link href="/" className="form-link" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', fontWeight: '600' }}>
                    Faça Login
                </Link>
            </div>
        </div>
    );
}