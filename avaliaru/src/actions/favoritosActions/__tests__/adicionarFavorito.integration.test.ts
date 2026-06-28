import { beforeEach, describe, expect, test } from "vitest";
import { db } from "@/lib/db/db";
import { estudanteFavoritaPrato, prato, users } from "@/lib/db/schema";
import { adicionarFavorito } from "../adicionarFavorito";
import { Session } from "next-auth";

const IDS = {
	aluno: "aluno-add-fav",
	prato1: "prato-add-1",
} as const;

const sessaoMock: Session = {
	user: { id: IDS.aluno, perfil: "aluno", name: "Aluno Add Fav" },
	expires: "9999-12-31",
} as Session;

describe("Testes de Integração: adicionarFavorito", () => {
	beforeEach(async () => {
		await db.delete(estudanteFavoritaPrato);
		await db.delete(prato);
		await db.delete(users);

		await db.insert(users).values({ id: IDS.aluno, name: "Aluno Add Fav", perfil: "aluno" });
		await db.insert(prato).values({ idPrato: IDS.prato1, nome: "Strogonoff" });
	});

	test("deve adicionar um prato aos favoritos com sucesso", async () => {
		const resultado = await adicionarFavorito(IDS.prato1, sessaoMock);
		expect(resultado.success).toBe(true);

		const favoritos = await db.select().from(estudanteFavoritaPrato);
		expect(favoritos).toHaveLength(1);
		expect(favoritos[0].fkPrato).toBe(IDS.prato1);
		expect(favoritos[0].fkEstudante).toBe(IDS.aluno);
	});

	test("não deve duplicar registro ao tentar adicionar o mesmo favorito", async () => {
		await adicionarFavorito(IDS.prato1, sessaoMock);
		const resultado = await adicionarFavorito(IDS.prato1, sessaoMock);
		
		expect(resultado.success).toBe(true);
		
		const favoritos = await db.select().from(estudanteFavoritaPrato);
		expect(favoritos).toHaveLength(1);
	});
});