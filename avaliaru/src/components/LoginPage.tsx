import Link from 'next/link'
import { User, Lock } from 'lucide-react';

export default function LoginPage() {
    return (
        <div id="login-form">
            <div className="form-header">
                <h2 className="login-title">Bem-vindo de volta!</h2>
                <p>Acesse sua conta para ver o cardápio de hoje.</p>
            </div>

            <form onSubmit={(e) => e.preventDefault() }>
                <div className="form-group">
                    <label>E-mail</label>
                    <div className="input-container">
                        <span className="input-icon"><User size={18} /></span>
                        <input type="text" placeholder="usuario@aluno.unb.br" />
                    </div>
                </div>

                <div className="form-group">
                    <div className="form-label-row">
                        <label>Senha</label>
                        <Link href="/forgot-password" className="form-link">Esqueceu a senha?</Link>
                    </div>
                    <div className="input-container">
                        <span className="input-icon"><Lock size={18} /></span>
                        <input type="password" placeholder="••••••••" />
                    </div>
                </div>

                <button type="submit" className="btn btn-login">Entrar</button>
            </form>

            <div className="switch-form-text">
                Não tem uma conta?{' '}
                < Link href="/register" className="switch-btn switch-btn-login">
                    Cadastre-se
                </ Link>
            </div>
        </div>
    );
}
