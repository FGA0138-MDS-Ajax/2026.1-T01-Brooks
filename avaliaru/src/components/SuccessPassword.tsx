import Link from 'next/link';
import { ArrowLeft, CheckCircle } from 'lucide-react';

export default function SuccessPassword() {
    return (
        <div id="forgot-password-form" style={{ textAlign: 'center' }}>
            <div className="form-header" style={{ alignItems: 'center', display: 'flex', flexDirection: 'column' }}>
                <CheckCircle size={48} color="#3B7A4C" style={{ marginBottom: '16px' }} />
                <h2 className="login-title">Verifique seu e-mail</h2>
                <p style={{ marginTop: '8px', lineHeight: '1.6' }}>
                    Enviamos um link de recuperação para o endereço informado. 
                    Não se esqueça de checar a caixa de spam.
                </p>
            </div>

            <Link href="/" className="form-link" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', marginTop: '24px' }}>
                <ArrowLeft size={16} /> Voltar para o Login
            </Link>
        </div>
    )
}