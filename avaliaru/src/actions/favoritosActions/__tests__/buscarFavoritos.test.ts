import { beforeEach, describe, expect, test, vi } from "vitest";
import { buscarFavoritos } from "../buscarFavoritos";
import { db } from "@/lib/db/db";
import { Session } from "next-auth";

vi.mock("@/lib/db/db", () => ({
	db: {
		select: vi.fn(),
	},
}));

describe("buscarFavoritos (Testes Unitários)", () => {
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
		await expect(buscarFavoritos(null as unknown as Session)).rejects.toThrow("Não autorizado.");
		expect(db.select).not.toHaveBeenCalled();
	});

	test("deve lançar erro se o perfil não for aluno", async () => {
		await expect(buscarFavoritos(sessaoGestorMock)).rejects.toThrow("Acesso negado: somente alunos podem adicionar favoritos.");
		expect(db.select).not.toHaveBeenCalled();
	});

	test("deve retornar lista de IDs de pratos favoritos com sucesso", async () => {
		const mockResult = [{ fkPrato: "p1" }, { fkPrato: "p2" }];
		
		const executeMock = vi.fn().mockResolvedValueOnce(mockResult);
		const whereMock = vi.fn().mockReturnValue({ execute: executeMock });
		const fromMock = vi.fn().mockReturnValue({ where: whereMock });
		vi.mocked(db.select).mockReturnValue({ from: fromMock } as never);

		const result = await buscarFavoritos(sessaoAlunoMock);

		expect(db.select).toHaveBeenCalledTimes(1);
		expect(fromMock).toHaveBeenCalledTimes(1);
		expect(whereMock).toHaveBeenCalledTimes(1);
		expect(executeMock).toHaveBeenCalledTimes(1);
		expect(result).toEqual(["p1", "p2"]);
	});

	test("deve retornar lista vazia se não houver favoritos", async () => {
		const executeMock = vi.fn().mockResolvedValueOnce([]);
		const whereMock = vi.fn().mockReturnValue({ execute: executeMock });
		const fromMock = vi.fn().mockReturnValue({ where: whereMock });
		vi.mocked(db.select).mockReturnValue({ from: fromMock } as never);

		const result = await buscarFavoritos(sessaoAlunoMock);

		expect(result).toEqual([]);
	});
});