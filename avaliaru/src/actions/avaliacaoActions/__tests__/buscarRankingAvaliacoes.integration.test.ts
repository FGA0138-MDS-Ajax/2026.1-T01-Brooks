import { beforeEach, describe, expect, test } from "vitest";
import { db } from "@/lib/db/db";
import {
	avaliacao,
	cardapioDiario,
	cardapioDiarioItem,
	prato,
	users,
} from "@/lib/db/schema";
import { buscarRankingAvaliacoes } from "../buscarRankingAvaliacoes";

const IDS = {
	usuario: "user-test-1",
	prato1: "p1",
	prato2: "p2",
	prato3: "p3",
} as const;

const NOMES = {
	usuario: "Aluno Teste",
	prato1: "Feijoada",
	prato2: "Lasanha",
	prato3: "Arroz Doce",
} as const;

const DATAS_CARDAPIO = {
	prato1: "2026-06-28",
	prato2: "2026-06-29",
	prato3: "2026-06-30",
} as const;

const DATA_HORA_AVALIACAO = new Date("2026-06-28T12:00:00.000Z");
const CAMPO_PRATO_PRINCIPAL = "prato_principal_padrao_almoco";
const CAMPO_SOBREMESA = "sobremesa_almoco";

describe("Testes de Integração: buscarRankingAvaliacoes", () => {
	beforeEach(async () => {
		await db.delete(avaliacao);
		await db.delete(cardapioDiarioItem);
		await db.delete(cardapioDiario);
		await db.delete(prato);
		await db.delete(users);
	});

	test("deve retornar categorias vazias quando não houver avaliações", async () => {
		const result = await buscarRankingAvaliacoes();

        // Atualizado para a nova estrutura
		expect(result.categorias).toEqual([]);
		expect(result.estatisticas).toEqual({
			mediaGeral: 0,
			totalAvaliacoes: 0,
			totalPratos: 0,
			melhorAvaliado: "—", // Atualizado para o travessão correto
		});
		expect(result.distribuicao).toEqual([
			{ estrelas: 5, quantidade: 0, percentual: 0 },
			{ estrelas: 4, quantidade: 0, percentual: 0 },
			{ estrelas: 3, quantidade: 0, percentual: 0 },
			{ estrelas: 2, quantidade: 0, percentual: 0 },
			{ estrelas: 1, quantidade: 0, percentual: 0 },
		]);
	});

	test("deve ranquear corretamente múltiplos pratos agrupados por categorias", async () => {
		await db.insert(users).values({ id: IDS.usuario, name: NOMES.usuario });
		await db.insert(prato).values([
			{ idPrato: IDS.prato1, nome: NOMES.prato1 },
			{ idPrato: IDS.prato2, nome: NOMES.prato2 },
			{ idPrato: IDS.prato3, nome: NOMES.prato3 },
		]);
		await db.insert(cardapioDiario).values([
			{ data: DATAS_CARDAPIO.prato1 },
			{ data: DATAS_CARDAPIO.prato2 },
			{ data: DATAS_CARDAPIO.prato3 },
		]);
		
		await db.insert(cardapioDiarioItem).values([
			{ data: DATAS_CARDAPIO.prato1, campo: CAMPO_PRATO_PRINCIPAL, idPrato: IDS.prato1 },
			{ data: DATAS_CARDAPIO.prato2, campo: CAMPO_PRATO_PRINCIPAL, idPrato: IDS.prato2 },
			{ data: DATAS_CARDAPIO.prato3, campo: CAMPO_SOBREMESA, idPrato: IDS.prato3 },
		]);

		await db.insert(avaliacao).values([
			{ nota: 5, dataHoraAvaliacao: DATA_HORA_AVALIACAO, statusModeracao: true, fkEstudante: IDS.usuario, fkCardapioDiario: DATAS_CARDAPIO.prato1 },
			{ nota: 4, dataHoraAvaliacao: DATA_HORA_AVALIACAO, statusModeracao: true, fkEstudante: IDS.usuario, fkCardapioDiario: DATAS_CARDAPIO.prato1 },
			{ nota: 3, dataHoraAvaliacao: DATA_HORA_AVALIACAO, statusModeracao: true, fkEstudante: IDS.usuario, fkCardapioDiario: DATAS_CARDAPIO.prato2 },
			{ nota: 3, dataHoraAvaliacao: DATA_HORA_AVALIACAO, statusModeracao: true, fkEstudante: IDS.usuario, fkCardapioDiario: DATAS_CARDAPIO.prato2 },
			{ nota: 1, dataHoraAvaliacao: DATA_HORA_AVALIACAO, statusModeracao: true, fkEstudante: IDS.usuario, fkCardapioDiario: DATAS_CARDAPIO.prato3 },
			{ nota: 2, dataHoraAvaliacao: DATA_HORA_AVALIACAO, statusModeracao: true, fkEstudante: IDS.usuario, fkCardapioDiario: DATAS_CARDAPIO.prato3 },
		]);

		const result = await buscarRankingAvaliacoes();

        // Atualizado para a nova estrutura
		expect(result.categorias).toEqual([
			{
				campo: CAMPO_PRATO_PRINCIPAL,
				rotulo: "Prato Principal (Almoço)",
				ranking: [
					{ idPrato: IDS.prato1, nome: NOMES.prato1, media: 4.5, totalAvaliacoes: 2 },
					{ idPrato: IDS.prato2, nome: NOMES.prato2, media: 3, totalAvaliacoes: 2 },
				]
			},
			{
				campo: CAMPO_SOBREMESA,
				rotulo: "Sobremesa (Almoço)",
				ranking: [
					{ idPrato: IDS.prato3, nome: NOMES.prato3, media: 1.5, totalAvaliacoes: 2 },
				]
			}
		]);

		expect(result.estatisticas).toEqual({
			mediaGeral: 3,
			totalAvaliacoes: 6,
			totalPratos: 3,
			melhorAvaliado: NOMES.prato1, 
		});
		
		expect(result.distribuicao).toEqual([
			{ estrelas: 5, quantidade: 1, percentual: 50 },
			{ estrelas: 4, quantidade: 1, percentual: 50 },
			{ estrelas: 3, quantidade: 2, percentual: 100 },
			{ estrelas: 2, quantidade: 1, percentual: 50 },
			{ estrelas: 1, quantidade: 1, percentual: 50 },
		]);
	});
});