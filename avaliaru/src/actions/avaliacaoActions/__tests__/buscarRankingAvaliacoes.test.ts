import { beforeEach, describe, expect, test, vi } from "vitest";
import { buscarRankingAvaliacoes } from "../buscarRankingAvaliacoes";
import { db } from "@/lib/db/db";

vi.mock("@/lib/db/db", () => ({
	db: {
		select: vi.fn(),
	},
}));

describe("buscarRankingAvaliacoes", () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	test("deve montar ranking, estatísticas e distribuição corretamente", async () => {
		const resultadosMock = [
			{ idPrato: "p1", nome: "Feijoada", nota: 5 },
			{ idPrato: "p1", nome: "Feijoada", nota: 4 },
			{ idPrato: "p2", nome: "Lasanha", nota: 3 },
			{ idPrato: "p2", nome: "Lasanha", nota: 2 },
			{ idPrato: "p2", nome: "Lasanha", nota: 2 },
		];

		const innerJoinMock = vi.fn().mockReturnThis();
		const fromMock = vi.fn().mockReturnValue({
			innerJoin: innerJoinMock,
		});

		innerJoinMock
			.mockReturnValueOnce({ innerJoin: innerJoinMock })
			.mockResolvedValueOnce(resultadosMock);

		vi.mocked(db.select).mockReturnValue({ from: fromMock } as never);

		const result = await buscarRankingAvaliacoes();

		expect(db.select).toHaveBeenCalledTimes(1);
		expect(fromMock).toHaveBeenCalledTimes(1);
		expect(innerJoinMock).toHaveBeenCalledTimes(2);

		expect(result.ranking).toEqual([
			{ idPrato: "p1", nome: "Feijoada", media: 4.5, totalAvaliacoes: 2 },
			{ idPrato: "p2", nome: "Lasanha", media: 2.3, totalAvaliacoes: 3 },
		]);

		expect(result.estatisticas).toEqual({
			mediaGeral: 3.2,
			totalAvaliacoes: 5,
			totalPratos: 2,
			melhorAvaliado: "Feijoada",
		});

		expect(result.distribuicao).toEqual([
			{ estrelas: 5, quantidade: 1, percentual: 50 },
			{ estrelas: 4, quantidade: 1, percentual: 50 },
			{ estrelas: 3, quantidade: 1, percentual: 50 },
			{ estrelas: 2, quantidade: 2, percentual: 100 },
			{ estrelas: 1, quantidade: 0, percentual: 0 },
		]);
	});

	test("deve retornar estrutura vazia quando não houver avaliações", async () => {
		const innerJoinMock = vi.fn().mockReturnThis();
		const fromMock = vi.fn().mockReturnValue({
			innerJoin: innerJoinMock,
		});

		innerJoinMock
			.mockReturnValueOnce({ innerJoin: innerJoinMock })
			.mockResolvedValueOnce([]);

		vi.mocked(db.select).mockReturnValue({ from: fromMock } as never);

		const result = await buscarRankingAvaliacoes();

		expect(result.ranking).toEqual([]);
		expect(result.estatisticas).toEqual({
			mediaGeral: 0,
			totalAvaliacoes: 0,
			totalPratos: 0,
			melhorAvaliado: "-",
		});
		expect(result.distribuicao).toEqual([
			{ estrelas: 5, quantidade: 0, percentual: 0 },
			{ estrelas: 4, quantidade: 0, percentual: 0 },
			{ estrelas: 3, quantidade: 0, percentual: 0 },
			{ estrelas: 2, quantidade: 0, percentual: 0 },
			{ estrelas: 1, quantidade: 0, percentual: 0 },
		]);
	});

	test("deve propagar erro quando a consulta ao banco falhar", async () => {
		const erro = new Error("falha no banco");
		const innerJoinMock = vi.fn().mockReturnThis();
		const fromMock = vi.fn().mockReturnValue({
			innerJoin: innerJoinMock,
		});

		innerJoinMock
			.mockReturnValueOnce({ innerJoin: innerJoinMock })
			.mockRejectedValueOnce(erro);

		vi.mocked(db.select).mockReturnValue({ from: fromMock } as never);

		await expect(buscarRankingAvaliacoes()).rejects.toThrow("falha no banco");
	});
});
