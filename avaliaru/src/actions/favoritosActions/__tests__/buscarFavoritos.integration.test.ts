import { beforeEach, describe, expect, test } from "vitest";
import { db } from "@/lib/db/db";
import { estudanteFavoritaPrato, prato, users } from "@/lib/db/schema";
import { buscarFavoritos } from "../buscarFavoritos";
import { Session } from "next-auth";

const IDS = {
	aluno: "aluno-busc-fav",
	prato1: "prato-busc-1",
	prato2: "prato-busc-2",
} as const;

const sessaoMock: Session = {
	user: { id: IDS.aluno, perfil: "aluno", name: "Aluno Busc Fav" },
	expires: "9999-12-31",
} as Session;

describe("Testes de Integração: buscarFavoritos", () => {
	beforeEach(async () => {
		await db.delete(estudanteFavoritaPrato);
		await db.delete(prato);
		await db.delete(users);

		await db.insert(users).values({ id: IDS.aluno, name: "Aluno Busc Fav", perfil: "aluno" });
		await db.insert(prato).values([
			{ idPrato: IDS.prato1, nome: "Strogonoff" },
			{ idPrato: IDS.prato2, nome: "Escondidinho" },
		]);
	});

	test("deve retornar lista com os IDs dos pratos favoritados pelo aluno", async () => {
		await db.insert(estudanteFavoritaPrato).values([
			{ fkEstudante: IDS.aluno, fkPrato: IDS.prato1 },
			{ fkEstudante: IDS.aluno, fkPrato: IDS.prato2 },
		]);

		const listaFavoritos = await buscarFavoritos(sessaoMock);

		expect(listaFavoritos).toHaveLength(2);
		expect(listaFavoritos).toContain(IDS.prato1);
		expect(listaFavoritos).toContain(IDS.prato2);
	});

	test("deve retornar lista vazia se o aluno não tiver favoritos", async () => {
		const listaFavoritos = await buscarFavoritos(sessaoMock);
		expect(listaFavoritos).toEqual([]);
	});
});