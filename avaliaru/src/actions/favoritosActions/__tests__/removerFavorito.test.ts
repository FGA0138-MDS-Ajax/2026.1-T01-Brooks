import { beforeEach, describe, expect, test, vi } from "vitest";
import { removerFavorito } from "../removerFavorito";
import { db } from "@/lib/db/db";
import { revalidatePath } from "next/cache";
import { Session } from "next-auth";

vi.mock("@/lib/db/db", () => ({
	db: {
		delete: vi.fn(),
	},
}));

vi.mock("next/cache", () => ({
	revalidatePath: vi.fn(),
}));

describe("removerFavorito (Testes Unitários)", () => {
	const sessaoAlunoMock: Session = {
		user: { id: "aluno-1", perfil: "aluno", name: "Aluno Teste" },
		expires: "9999-12-31",
	} as Session;

	const sessaoGestorMock: Session = {
		user: { id: "gestor-1", perfil: "gestorru", name: "Gestor Teste" },
		expires: "9999-12-31",
	} as Session;

	beforeEach(() => {
		vi.clearAllMocks();
	});

	test("deve lançar erro se não houver sessão", async () => {
		await expect(removerFavorito("p1", null as unknown as Session)).rejects.toThrow("Não autorizado.");
		expect(db.delete).not.toHaveBeenCalled();
	});

	test("deve lançar erro se o perfil não for aluno", async () => {
		await expect(removerFavorito("p1", sessaoGestorMock)).rejects.toThrow("Acesso negado: somente alunos podem adicionar favoritos.");
		expect(db.delete).not.toHaveBeenCalled();
	});

	test("deve remover favorito com sucesso e revalidar o cache", async () => {
		const whereMock = vi.fn().mockResolvedValueOnce(true);
		vi.mocked(db.delete).mockReturnValue({ where: whereMock } as never);

		const result = await removerFavorito("p1", sessaoAlunoMock);

		expect(db.delete).toHaveBeenCalledTimes(1);
		expect(whereMock).toHaveBeenCalledTimes(1);
		expect(revalidatePath).toHaveBeenCalledWith("/dashboard/cardapio");
		expect(result).toEqual({ success: true });
	});
});