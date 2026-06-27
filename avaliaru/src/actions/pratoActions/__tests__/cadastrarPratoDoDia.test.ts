/* eslint-disable @typescript-eslint/no-explicit-any */
import { inserirPratoNoBanco } from "../cadastrarPrato";
import { inserirPratoDoDiaNoBanco } from "../cadastrarPratoDoDia";
import { db } from "@/lib/db/db";
import { cardapioDiario, cardapioDiarioItem } from "@/lib/db/schema";
import { eq, and } from "drizzle-orm";

async function testCadastrarPratoDoDia() {
    console.log("Iniciando teste de cadastrarPratoDoDia...");

    try {
        // runMigrations(); // Comentado para evitar conflitos com o histórico do drizzle push

        // 1. Gerar a data de hoje no formato YYYY-MM-DD para o teste bater com a Action
        const hoje = new Date();
        const dia = String(hoje.getDate()).padStart(2, '0');
        const mes = String(hoje.getMonth() + 1).padStart(2, '0');
        const ano = hoje.getFullYear();
        const dataFormatada = `${ano}-${mes}-${dia}`;
        
        const testPratoId = "PRATO_TESTE_001";
        const refeicaoTeste = "almoço";

        // 2. Criar o registro do dia na tabela pai para evitar o erro de FOREIGN KEY
        try {
            await db.insert(cardapioDiario).values({ data: dataFormatada });
        } catch (e) {
            // Ignora se a data já estiver cadastrada no dev.db
        }

        // 3. Criar o prato base no banco de dados
        console.log("Tentando cadastrar prato base no banco...");
        try {
            await inserirPratoNoBanco(testPratoId, "Prato de Teste Automatizado");
            console.log(`Prato base "${testPratoId}" verificado/cadastrado.`);
        } catch (e: any) {
            // Ignora se o prato com ID único já existir no banco de desenvolvimento
        }

        // 4. Limpa qualquer registro prévio correspondente a este teste para torná-lo idempotente
        console.log(`Limpando registro antigo para o teste rodar limpo...`);
        await db.delete(cardapioDiarioItem).where(
            and(
                eq(cardapioDiarioItem.data, dataFormatada),
                eq(cardapioDiarioItem.campo, refeicaoTeste)
            )
        );

        // 5. Chamar a função de lógica interna do banco
        const result = await inserirPratoDoDiaNoBanco(
            testPratoId, 
            refeicaoTeste
        );

        if (result.success) {
            console.log("Sucesso: Prato do Dia cadastrado com sucesso no banco de dados!");
        }
    } catch (error: any) {
        console.error("Falha no teste:", error.message);
    }
}

testCadastrarPratoDoDia();