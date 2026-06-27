/* eslint-disable @typescript-eslint/no-explicit-any */
import { inserirPratoNoBanco } from "../cadastrarPrato";
import { inserirPratoDoDiaNoBanco } from "../cadastrarPratoDoDia";
import { runMigrations } from "@/lib/db/migrations";

async function testCadastrarPratoDoDia() {
    console.log("Iniciando teste de cadastrarPratoDoDia...");

    try {
        // Garante que as migrações foram executadas para que as tabelas existam
        runMigrations();

        // 1. Criar um prato de teste usando a lógica de banco
        const testPratoId = "PRATO_TESTE_001";
        
        console.log("Tentando cadastrar prato base no banco...");
        try {
            await inserirPratoNoBanco(testPratoId, "Prato de Teste Automatizado");
            console.log(`Prato base "${testPratoId}" cadastrado com sucesso.`);
        } catch (e: any) {
            console.warn("Nota sobre o cadastro do prato base:", e.message);
        }

        // 2. Chamar a função de lógica do Prato do Dia
        const result = await inserirPratoDoDiaNoBanco(
            testPratoId, 
            "almoço"
        );

        if (result.success) {
            console.log("✅ Sucesso: Prato do Dia cadastrado com sucesso no banco de dados!");
        }
    } catch (error: any) {
        console.error("❌ Falha no teste:", error.message);
    } finally {
        // Opcional: Limpar dados de teste ou fechar a conexão se necessário
        // Para SQLite, a conexão é fechada automaticamente em scripts simples
    }
}

testCadastrarPratoDoDia();