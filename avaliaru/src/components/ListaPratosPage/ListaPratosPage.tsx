"use client";

import { useState } from "react";
import { Search } from "lucide-react";
import styles from "./ListaPratosPage.module.css";

// Consulta no Banco de Dados
const pratos = [
  { id: 1, nome: "Estrogonofe de Frango", codigo: "PRT-001" },
  { id: 2, nome: "Feijoada", codigo: "PRT-002" },
  { id: 3, nome: "Lasanha", codigo: "PRT-003" },
  { id: 4, nome: "Frango Grelhado", codigo: "PRT-004" },
  { id: 5, nome: "Bife Acebolado", codigo: "PRT-005" },
];

export default function ListaPratosPage() {
  const [input, setInput] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
  }
  
  return (
    <main className={styles.pageWrapper}>
      <div className={styles.container}>
        <header className={styles.pageHeader}>
          <h1 className={styles.pageTitle}>Todos os Pratos</h1>
          <p className={styles.pageSubtitle}>
            Consulte o catálogo de opções cadastradas no sistema
          </p>
        </header>

        <div className={styles.searchBar}>
          <Search className={styles.searchIcon} size={20} strokeWidth={1.5} />
          <input onChange={handleChange} type="text" placeholder="Pesquisar prato ou código..." />
        </div>

        <div className={styles.card}>
          {pratos.map((prato) => (
            <div key={prato.id} className={styles.dishItem}>
              <div className={styles.dishInfo}>
                <span className={styles.dishName}>{prato.nome}</span>
                <span className={styles.dishCode}>Código: {prato.codigo}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
