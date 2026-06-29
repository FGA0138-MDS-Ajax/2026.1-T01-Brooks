import { beforeEach, describe, expect, test, vi } from "vitest";
import { buscarRankingAvaliacoes } from "../buscarRankingAvaliacoes";
import { db } from "@/lib/db/db";

vi.mock("@/lib/db/db", () => ({
	db: { select: vi.fn() },
}));

describe("Testes Unitários: buscarRankingAvaliacoes", () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	test("deve montar categorias, estatísticas e distribuição corretamente", async () => {
		const avaliacoesPurasMock = [
			{ nota: 5 }, { nota: 4 }, { nota: 3 }, { nota: 2 }, { nota: 2 }
		];

		const resultadosMock = [
			{ campo: "prato_principal_padrao_almoco", idPrato: "p1", nome: "Feijoada", nota: 5 },
			{ campo: "prato_principal_padrao_almoco", idPrato: "p1", nome: "Feijoada", nota: 4 },
			{ campo: "sobremesa_almoco", idPrato: "p2", nome: "Lasanha", nota: 3 },
			{ campo: "sobremesa_almoco", idPrato: "p2", nome: "Lasanha", nota: 2 },
			{ campo: "sobremesa_almoco", idPrato: "p2", nome: "Lasanha", nota: 2 },
		];

		// Mock da Primeira Query (avaliacoes puras)
		const fromAvaliacoesMock = vi.fn().mockResolvedValueOnce(avaliacoesPurasMock);
		
		// Mock da Segunda Query (Joins)
		const innerJoinPratoMock = vi.fn().mockResolvedValueOnce(resultadosMock);
		const innerJoinCardapioMock = vi.fn().mockReturnValueOnce({ innerJoin: innerJoinPratoMock });
		const fromResultadosMock = vi.fn().mockReturnValueOnce({ innerJoin: innerJoinCardapioMock });

		// Aplica os mocks na ordem em que são chamados no código
		vi.mocked(db.select)
			.mockReturnValueOnce({ from: fromAvaliacoesMock } as never)
			.mockReturnValueOnce({ from: fromResultadosMock } as never);

		const result = await buscarRankingAvaliacoes();

		expect(db.select).toHaveBeenCalledTimes(2);

		// Valida se agrupou corretamente as categorias
		expect(result.categorias).toEqual([
			{
				campo: "prato_principal_padrao_almoco",
				rotulo: "Prato Principal (Almoço)",
				ranking: [{ idPrato: "p1", nome: "Feijoada", media: 4.5, totalAvaliacoes: 2 }],
			},
			{
				campo: "sobremesa_almoco",
				rotulo: "Sobremesa (Almoço)",
				ranking: [{ idPrato: "p2", nome: "Lasanha", media: 2.3, totalAvaliacoes: 3 }],
			}
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
		const fromAvaliacoesMock = vi.fn().mockResolvedValueOnce([]);
		
		const innerJoinPratoMock = vi.fn().mockResolvedValueOnce([]);
		const innerJoinCardapioMock = vi.fn().mockReturnValueOnce({ innerJoin: innerJoinPratoMock });
		const fromResultadosMock = vi.fn().mockReturnValueOnce({ innerJoin: innerJoinCardapioMock });

		vi.mocked(db.select)
			.mockReturnValueOnce({ from: fromAvaliacoesMock } as never)
			.mockReturnValueOnce({ from: fromResultadosMock } as never);

		const result = await buscarRankingAvaliacoes();

		expect(result.categorias).toEqual([]);
		expect(result.estatisticas).toEqual({
			mediaGeral: 0,
			totalAvaliacoes: 0,
			totalPratos: 0,
			melhorAvaliado: "—", // Atualizado para corresponder ao novo fallback no código ("—")
		});
	});

	test("deve propagar erro quando a consulta ao banco falhar", async () => {
		const erro = new Error("falha no banco");
		const fromAvaliacoesMock = vi.fn().mockRejectedValueOnce(erro);
		
		vi.mocked(db.select).mockReturnValueOnce({ from: fromAvaliacoesMock } as never);

		await expect(buscarRankingAvaliacoes()).rejects.toThrow("falha no banco");
	});
});