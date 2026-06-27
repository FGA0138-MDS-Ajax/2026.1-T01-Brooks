import Image from "next/image";
import styles from "./LeftBar.module.css";

export default function LeftBar() {
  return (
    <div className={styles["banner-side"]}>
      <div className={styles["banner-content"]}>
        <div className={styles["logo-placeholder"]}>
          <Image
            src="/logo-avaliaru.png"
            alt="Logo AvaliaRU"
            className={styles["logo-img"]}
            width={96}
            height={96}
          />
        </div>
        <h1>AvaliaRU</h1>
        <p>
          Sua plataforma de avaliação do Restaurante Universitário da UnB Gama.
          Favorite pratos e evite alérgenos.
        </p>
      </div>
      <div className={styles["banner-footer"]}>
        FGA - Universidade de Brasília
      </div>
    </div>
  );
}
