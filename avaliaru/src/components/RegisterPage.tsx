import Link from 'next/link';
import { User, Mail, AlertTriangle } from 'lucide-react';

export default function RegisterPage() {
    return (
    <div id="register-form">
        <div className="form-header">
            <h2 className="register-title">Criar Conta</h2>
            <p>Configure seu perfil para alertas personalizados.</p>
        </div>

        <form onSubmit={(e) => e.preventDefault()}>
            <div className="form-group">
                <label>Nome Completo</label>
                <div className="input-container">
                    <span className="input-icon"><User size={18} /></span>
                    <input type="text" placeholder="Seu nome" />
                </div>
            </div>

            <div className="form-group">
                <label>E-mail</label>
                <div className="input-container">
                    <span className="input-icon"><Mail size={18} /></span>
                    <input type="email" placeholder="matricula@aluno.unb.br" />
                </div>
            </div>

            <div className="form-group">
                <div className="form-grid">
                    <div>
                        <label>Senha</label>
                        <div className="input-container">
                            <input type="password" placeholder="••••••••" />
                        </div>
                    </div>
                    <div>
                        <label>Confirmar Senha</label>
                        <div className="input-container">
                            <input type="password" placeholder="••••••••" />
                        </div>
                    </div>
                </div>
            </div>

            <div className="alert-box">
                <AlertTriangle size={16} color="#B45309" style={{ flexShrink: 0 }} />
                <span>Você poderá configurar suas restrições alimentares (alérgenos) e pratos favoritos logo após o primeiro acesso.</span>
            </div>

            <button type="submit" className="btn btn-register">Finalizar Cadastro</button>
        </form>

        <div className="switch-form-text">
            Já possui uma conta?{' '}
            <Link href="/" className="switch-btn switch-btn-register">
                Faça Login
            </Link>
        </div>
    </div>
    );
}
