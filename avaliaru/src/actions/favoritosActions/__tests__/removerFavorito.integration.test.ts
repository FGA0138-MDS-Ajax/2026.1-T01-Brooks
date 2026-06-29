import { beforeEach, describe, expect, test } from "vitest";
import { db } from "@/lib/db/db";
import { estudanteFavoritaPrato, prato, users } from "@/lib/db/schema";
import { removerFavorito } from "../removerFavorito";
import { Session } from "next-auth";

const IDS = {
	aluno: "aluno-rm-fav",
	prato1: "prato-rm-1",
} as const;

const sessaoMock: Session = {
	user: { id: IDS.aluno, perfil: "aluno", name: "Aluno Rm Fav" },
	expires: "9999-12-31",
} as Session;

describe("Testes de Integração: removerFavorito", () => {
	beforeEach(async () => {
		await db.delete(estudanteFavoritaPrato);
		await db.delete(prato);
		await db.delete(users);

		await db.insert(users).values({ id: IDS.aluno, name: "Aluno Rm Fav", perfil: "aluno" });
		await db.insert(prato).values({ idPrato: IDS.prato1, nome: "Strogonoff" });
	});

	test("deve remover um prato dos favoritos com sucesso", async () => {
		await db.insert(estudanteFavoritaPrato).values({
			fkEstudante: IDS.aluno,
			fkPrato: IDS.prato1,
		});

		const resultado = await removerFavorito(IDS.prato1, sessaoMock);
		expect(resultado.success).toBe(true);

		const favoritos = await db.select().from(estudanteFavoritaPrato);
		expect(favoritos).toHaveLength(0);
	});
});