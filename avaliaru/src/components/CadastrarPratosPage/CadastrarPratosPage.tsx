"use client"
import { cadastrarPrato } from "@/actions/pratoActions/cadastrarPrato"
import myAlert from "@/lib/alert"
import { CheckCircle, CheckCircle2, Key, List, Loader2, Text, XCircle } from "lucide-react"
import { useEffect, useState } from "react"
import Input from "../Input/Input"

import styles from "./CadastrarPratosPage.module.css";
import { useRouter } from "next/navigation"
import { verificarCodigoPrato } from "@/actions/pratoActions/verificarCodigoPrato"

export default function CadastrarPratoPage() {
    const isLoading = useState(false)[0]
    const [inputId, setInputId] = useState("")
    const [valid, setIsValid] = useState<"valid" | "invalid" | null>("valid")

    const router = useRouter()
    
    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault()

        try {
            if (valid === "invalid") {
                myAlert.error("Código do prato já existe! Por favor, escolha outro código.")
                return
            }

            const formData = new FormData(event.currentTarget)
            cadastrarPrato(formData)
            myAlert.success("Prato cadastrado com sucesso!")
        } catch (error) {
            myAlert.error("Erro ao cadastrar o prato!\n" + (error instanceof Error ? error.message : "Erro desconhecido"))
        }
        // Lógica para processar o formulário de cadastro do prato
    }
    
    useEffect(() => {
        async function verificarCodigoHandle() {
            if (inputId === "") {
                setIsValid(null)
                return
            }

            const quantCodigos = await verificarCodigoPrato({ codigo: inputId })

            if (quantCodigos > 0) {
                setIsValid("invalid")
            } else {
                setIsValid("valid")
            }
        }

        const timeout = setTimeout(() => {verificarCodigoHandle()}, 500)

        return () => clearTimeout(timeout)
    }, [inputId])

    return (
        <main className={styles.pageWrapper}>
            <div className={styles.container}>
                <header className={styles.pageHeader}>
                    <div>
                        <h1 className={styles.pageTitle}>Cadastrar Prato</h1>
                        <p className={styles.pageSubtitle}>
                            Cadastre o prato no sistema para que ele possa ser avaliado pelos usuários.
                        </p>
                    </div>

                    <button className={styles.addButton} onClick={() => router.push("/gestao/listarPratos")}>
                        <List /> Lista de Pratos
                    </button>
                </header>

                <div className={styles.card}>
                    <form onSubmit={handleSubmit} className={styles.form}>
                        <div className="form-group">
                            <label>Código do Prato</label>
                            <div className="input-container">
                                <div className="grid grid-cols-[1fr_auto] gap-2 items-center">
                                    <Input
                                        name="codigo"
                                        icon={Key}
                                        type="text"
                                        placeholder="strogonoff_frango"
                                        required={true}
                                        onChange={(e) => setInputId((e.target as HTMLInputElement).value)}
                                    />

                                    {valid === "valid" && (
                                        <CheckCircle className="text-green-500 " />
                                    )}

                                    {valid === "invalid" && (
                                        <XCircle className="text-red-500" />
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="form-group">
                            <label>Nome do Prato</label>
                            <div className="input-container">
                                <Input
                                    name="nome"
                                    icon={Text}
                                    type="text"
                                    placeholder="Strogonoff de Frango"
                                    required={true}
                                />
                            </div>
                        </div>


                        <button type="submit" className={styles.addButton + " " + styles.end}>
                            {isLoading ? (
                                <div className="flex items-center justify-center gap-2">
                                    <Loader2 className="animate-spin" size={18} />
                                    <span>Carregando...</span>
                                </div>
                            ) : (
                                "Cadastrar Prato"
                            )}
                        </button>
                    </form>
                </div>
            </div>
        </main>


    )
}