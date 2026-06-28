import { beforeEach, describe, expect, test, vi } from "vitest";
import { adicionarFavorito } from "../adicionarFavorito";
import { db } from "@/lib/db/db";
import { revalidatePath } from "next/cache";
import { Session } from "next-auth";

vi.mock("@/lib/db/db", () => ({
	db: {
		insert: vi.fn(),
	},
}));

vi.mock("next/cache", () => ({
	revalidatePath: vi.fn(),
}));

describe("adicionarFavorito (Testes Unitários)", () => {
	const sessaoAlunoMock: Session = {
		user: { id: "aluno-1", perfil: "aluno", name: "Aluno Teste" },
		expires: "9999-12-31",
	} as Session;

	const sessaoGestorMock: Session = {
		user: { id: "gestor-1", perfil: "gestor", name: "Gestor Teste" },
		expires: "9999-12-31",
	} as Session;

	beforeEach(() => {
		vi.clearAllMocks();
	});

	test("deve lançar erro se não houver sessão", async () => {
		await expect(adicionarFavorito("p1", null as unknown as Session)).rejects.toThrow("Não autorizado.");
		expect(db.insert).not.toHaveBeenCalled();
	});

	test("deve lançar erro se o perfil não for aluno", async () => {
		await expect(adicionarFavorito("p1", sessaoGestorMock)).rejects.toThrow("Acesso negado: somente alunos podem adicionar favoritos.");
		expect(db.insert).not.toHaveBeenCalled();
	});

	test("deve adicionar favorito com sucesso e revalidar o cache", async () => {
		const executeMock = vi.fn().mockResolvedValueOnce(true);
		const onConflictDoNothingMock = vi.fn().mockReturnValue({ execute: executeMock });
		const valuesMock = vi.fn().mockReturnValue({ onConflictDoNothing: onConflictDoNothingMock });
		vi.mocked(db.insert).mockReturnValue({ values: valuesMock } as never);

		const result = await adicionarFavorito("p1", sessaoAlunoMock);

		expect(db.insert).toHaveBeenCalledTimes(1);
		expect(valuesMock).toHaveBeenCalledWith({
			fkEstudante: sessaoAlunoMock.user.id,
			fkPrato: "p1",
		});
		expect(onConflictDoNothingMock).toHaveBeenCalledTimes(1);
		expect(executeMock).toHaveBeenCalledTimes(1);
		expect(revalidatePath).toHaveBeenCalledWith("/dashboard/cardapio");
		expect(result).toEqual({ success: true });
	});
});