import { beforeEach, describe, expect, test } from "vitest";
import { db } from "@/lib/db/db";
import { avaliacao, cardapioDiario, cardapioDiarioItem, users } from "@/lib/db/schema";
import { cadastrarAvaliacao } from "../cadastrarAvaliacao";
import { eq } from "drizzle-orm";

const IDS = {
	usuario: "user-avaliacao-integration",
	estudanteInexistente: "user-avaliacao-integration-missing",
} as const;

const DATA_HORA_FIXA = new Date("2026-06-28T10:00:00.000Z");
const DATAS_CARDAPIO = {
	sucesso: "2026-06-28",
	comentarioNulo: "2026-06-29",
} as const;

async function prepararDadosBase() {
	await db.insert(users).values({
		id: IDS.usuario,
		name: "Aluno Integração Avaliação",
	});
}

describe("Testes de Integração: cadastrarAvaliacao", () => {

	beforeEach(async () => {
		await db.delete(avaliacao).where(eq(avaliacao.fkCardapioDiario, DATAS_CARDAPIO.sucesso)).catch(() => {});
		await db.delete(avaliacao).where(eq(avaliacao.fkCardapioDiario, DATAS_CARDAPIO.comentarioNulo)).catch(() => {});
		await db.delete(cardapioDiarioItem).where(eq(cardapioDiarioItem.data, DATAS_CARDAPIO.sucesso)).catch(() => {});
		await db.delete(cardapioDiarioItem).where(eq(cardapioDiarioItem.data, DATAS_CARDAPIO.comentarioNulo)).catch(() => {});
		await db.delete(cardapioDiario).where(eq(cardapioDiario.data, DATAS_CARDAPIO.sucesso)).catch(() => {});
		await db.delete(cardapioDiario).where(eq(cardapioDiario.data, DATAS_CARDAPIO.comentarioNulo)).catch(() => {});
		await db.delete(users).where(eq(users.id, IDS.usuario)).catch(() => {});
	});

	test("deve cadastrar uma avaliação com sucesso no banco", async () => {
		await prepararDadosBase();
		await db.insert(cardapioDiario).values({ data: DATAS_CARDAPIO.sucesso });

		const result = await cadastrarAvaliacao({
			nota: 5,
			comentario: "Muito bom",
			dataHoraAvaliacao: DATA_HORA_FIXA,
			statusModeracao: true,
			fkEstudante: IDS.usuario,
			fkCardapioDiario: DATAS_CARDAPIO.sucesso,
		});

		expect(result).toBeTruthy();

		const registros = await db
			.select()
			.from(avaliacao)
			.where(eq(avaliacao.fkEstudante, IDS.usuario));

		expect(registros).toHaveLength(1);
		expect(registros[0]).toMatchObject({
			nota: 5,
			comentario: "Muito bom",
			statusModeracao: true,
			fkEstudante: IDS.usuario,
			fkCardapioDiario: DATAS_CARDAPIO.sucesso,
		});
	});

	test("deve gravar comentario como null quando nao for informado", async () => {
		await prepararDadosBase();
		await db.insert(cardapioDiario).values({ data: DATAS_CARDAPIO.comentarioNulo });

		await cadastrarAvaliacao({
			nota: 4,
			dataHoraAvaliacao: DATA_HORA_FIXA,
			statusModeracao: false,
			fkEstudante: IDS.usuario,
			fkCardapioDiario: DATAS_CARDAPIO.comentarioNulo,
		});

		const registros = await db
			.select()
			.from(avaliacao)
			.where(eq(avaliacao.fkEstudante, IDS.usuario));

		expect(registros).toHaveLength(1);
		expect(registros[0]?.comentario).toBeNull();
	});

	test("deve rejeitar quando o id do cardapio diario estiver vazio", async () => {
		await expect(
			cadastrarAvaliacao({
				nota: 5,
				comentario: "Teste",
				dataHoraAvaliacao: DATA_HORA_FIXA,
				statusModeracao: true,
				fkEstudante: IDS.usuario,
				fkCardapioDiario: "",
			})
		).rejects.toThrow("O campo ID do cardápio diário é obrigatório.");
	});

	test("deve rejeitar quando o estudante nao existir", async () => {
		await db.insert(cardapioDiario).values({ data: DATAS_CARDAPIO.sucesso });

		await expect(
			cadastrarAvaliacao({
				nota: 5,
				comentario: "Teste",
				dataHoraAvaliacao: DATA_HORA_FIXA,
				statusModeracao: true,
				fkEstudante: IDS.estudanteInexistente,
				fkCardapioDiario: DATAS_CARDAPIO.sucesso,
			})
		).rejects.toThrow(/FOREIGN KEY constraint failed/i);
	});
});