"use client"
import { cadastrarPrato } from "@/actions/pratoActions/cadastrarPrato"
import Input from "@/components/Input"
import myAlert from "@/lib/alert"
import { Key, Loader2, Text } from "lucide-react"
import { useState } from "react"

export default function CadastrarPratoPage() {
    const isLoading = useState(false)[0]
    
    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault()

        try {
            const formData = new FormData(event.currentTarget)
            cadastrarPrato(formData)
            myAlert.success("Prato cadastrado com sucesso!")
        } catch (error) {
            myAlert.error("Erro ao cadastrar o prato!\n" + (error instanceof Error ? error.message : "Erro desconhecido"))
        }
        // Lógica para processar o formulário de cadastro do prato
    }

    return (
        <div>
            <h1>Cadastrar Prato</h1>
            {/* Formulário para cadastrar um novo prato */}

            <div id="cadastro-prato-form">
                <div className="form-header">
                    <h2 className="login-title">Cadastrar Prato</h2>
                    <p>Preencha os dados para cadastrar um novo prato.</p>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Código do Prato</label>
                        <div className="input-container">
                            <Input
                                name="codigo"
                                icon={Key}
                                type="text"
                                placeholder="STROGONOFF_FRANGO"
                                required={true}
                            />
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
                    

                    <button type="submit" className="btn btn-login">
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
    )
}