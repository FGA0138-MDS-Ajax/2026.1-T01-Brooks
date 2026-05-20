import Image from "next/image";

export default function LeftBar() {
    return (
        <div className="banner-side">
            <div className="banner-content">
                <div className="logo-placeholder">
                    {/* No Next.js, arquivos na pasta public/ são acessados direto pela barra / */}
                    <Image 
                        src="/logo-avaliaru.png" 
                        alt="Logo AvaliaRU" 
                        className="logo-img"
                        width={96}
                        height={96}
                    />
                </div>
                <h1>AvaliaRU</h1>
                <p>Sua plataforma de avaliação do Restaurante Universitário da UnB Gama. Favorite pratos e evite alérgenos.</p>
            </div>
            <div className="banner-footer">
                FGA - Universidade de Brasília
            </div>
        </div>
    );
}








