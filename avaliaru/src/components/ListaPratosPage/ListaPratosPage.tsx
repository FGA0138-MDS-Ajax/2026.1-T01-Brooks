"use client";

import { useState } from "react";
import { Plus, Search } from "lucide-react";
import styles from "./ListaPratosPage.module.css";
import { Prato } from "@/lib/db/schema";
import { useRouter } from "next/navigation";

export default function ListaPratosPage({ pratos }: { pratos: Prato[]}) {
  const [input, setInput] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
  }
  
  const router = useRouter()

  return (
    <main className={styles.pageWrapper}>
      <div className={styles.container}>
        <header className={styles.pageHeader}>
          <div>
            <h1 className={styles.pageTitle}>Todos os Pratos</h1>
            <p className={styles.pageSubtitle}>
              Consulte o catálogo de opções cadastradas no sistema
            </p>
          </div>

          <button className={styles.addButton} onClick={() => router.push("/gestao/cadastrarPrato")}>
            <Plus /> Cadastrar Prato
          </button>
        </header>

        <div className={styles.searchBar}>
          <Search className={styles.searchIcon} size={20} strokeWidth={1.5} />
          <input onChange={handleChange} type="text" placeholder="Pesquisar prato ou código..." />
        </div>

        <div className={styles.card}>
          {pratos.filter((prato) => prato.nome.includes(input) || prato.idPrato.includes(input)).map((prato) => (
            <div key={prato.idPrato} className={styles.dishItem}>
              <div className={styles.dishInfo}>
                <span className={styles.dishName}>{prato.nome}</span>
                <span className={styles.dishCode}>Código: {prato.idPrato}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
