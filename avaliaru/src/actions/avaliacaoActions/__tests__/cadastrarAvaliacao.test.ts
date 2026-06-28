import { beforeEach, describe, expect, test, vi } from "vitest";
import { cadastrarAvaliacao } from "../cadastrarAvaliacao";
import { db } from "@/lib/db/db";
import { avaliacao } from "@/lib/db/schema";

vi.mock("@/lib/db/db", () => ({
	db: {
		insert: vi.fn(),
	},
}));

describe("cadastrarAvaliacao", () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	test("deve lançar erro quando nota não é informada", async () => {
		await expect(
			cadastrarAvaliacao({
				nota: undefined as unknown as number,
				comentario: "comentario teste",
				dataHoraAvaliacao: new Date("2026-06-28T10:00:00.000Z"),
				statusModeracao: false,
				fkEstudante: "estudante-1",
				fkCardapioDiario: "2026-06-28",
			})
		).rejects.toThrow('O campo "nota" é obrigatório.');

		expect(db.insert).not.toHaveBeenCalled();
	});

	test("deve lançar erro quando fkCardapioDiario está vazio", async () => {
		await expect(
			cadastrarAvaliacao({
				nota: 5,
				comentario: "comentario teste",
				dataHoraAvaliacao: new Date("2026-06-28T10:00:00.000Z"),
				statusModeracao: false,
				fkEstudante: "estudante-1",
				fkCardapioDiario: "",
			})
		).rejects.toThrow("O campo ID do cardápio diário é obrigatório.");

		expect(db.insert).not.toHaveBeenCalled();
	});

	test("deve lançar erro quando fkEstudante está vazio", async () => {
		await expect(
			cadastrarAvaliacao({
				nota: 4,
				comentario: "comentario teste",
				dataHoraAvaliacao: new Date("2026-06-28T10:00:00.000Z"),
				statusModeracao: true,
				fkEstudante: "",
				fkCardapioDiario: "2026-06-28",
			})
		).rejects.toThrow("O campo ID do estudante é obrigatório.");

		expect(db.insert).not.toHaveBeenCalled();
	});

	test("deve cadastrar avaliação com sucesso quando os dados são válidos", async () => {
		const retornoEsperado = { success: true };
		const valuesMock = vi.fn().mockResolvedValue(retornoEsperado);
		vi.mocked(db.insert).mockReturnValue({ values: valuesMock } as never);

		const dataHoraAvaliacao = new Date("2026-06-28T10:00:00.000Z");

		const result = await cadastrarAvaliacao({
			nota: 5,
			comentario: "Muito bom",
			dataHoraAvaliacao,
			statusModeracao: false,
			fkEstudante: "estudante-1",
			fkCardapioDiario: "2026-06-28",
		});

		expect(db.insert).toHaveBeenCalledWith(avaliacao);
		expect(valuesMock).toHaveBeenCalledWith({
			nota: 5,
			comentario: "Muito bom",
			dataHoraAvaliacao,
			statusModeracao: false,
			fkEstudante: "estudante-1",
			fkCardapioDiario: "2026-06-28",
		});
		expect(result).toEqual(retornoEsperado);
	});

	test("deve salvar comentário como null quando não for informado", async () => {
		const valuesMock = vi.fn().mockResolvedValue({ success: true });
		vi.mocked(db.insert).mockReturnValue({ values: valuesMock } as never);

		const dataHoraAvaliacao = new Date("2026-06-28T10:00:00.000Z");

		await cadastrarAvaliacao({
			nota: 3,
			dataHoraAvaliacao,
			statusModeracao: true,
			fkEstudante: "estudante-2",
			fkCardapioDiario: "2026-06-29",
		});

		expect(valuesMock).toHaveBeenCalledWith({
			nota: 3,
			comentario: null,
			dataHoraAvaliacao,
			statusModeracao: true,
			fkEstudante: "estudante-2",
			fkCardapioDiario: "2026-06-29",
		});
	});
});