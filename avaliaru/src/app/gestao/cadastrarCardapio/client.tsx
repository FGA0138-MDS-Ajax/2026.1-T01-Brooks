"use client";

import { Prato } from "@/lib/db/schema";

export default function CadastrarPratosDoDia({ pratos }: { pratos: Prato[] }) {
    //implementar essa página (estilo e lógica)
    
    return (
        <div>
            <h1>Cadastrar Prato do Dia</h1>

            <form action="">
                {/*
                Campos do formulário. 
                Deve ter os itens do cardápio daquele dia. 
                Ao clicar no item, deve exibir um modal com todos os itens do cardápio,
                incluindo um campo de pesquisa para facilitar a busca.
                    
                    data:
                       
                    panificacao:
                    opcao_extra: 
                    complemento_padrao_cafe:
                    complemento_ovolactovegetariano_cafe: 
                    complemento_vegetariano_estrito_cafe: 
                    fruta: 

                    prato_principal_padrao_almoco:
                    prato_principal_ovolactovegetariano_almoco: 
                    prato_principal_vegetariano_estrito_almoco:
                    guarnicao: 
                    sobremesa_almoco:

                    prato_principal_padrão_jantar: 
                    prato_principal_ovolactovegetariano_jantar: 
                    prato_principal_vegetariano_estrito_jantar: 
                    sopa: 
                    sobremesa_jantar: 
                     */   
                    }
            </form>
        </div>

    )
}