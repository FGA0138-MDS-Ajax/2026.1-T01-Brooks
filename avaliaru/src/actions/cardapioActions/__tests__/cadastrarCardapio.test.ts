import { beforeEach, describe, expect, test, vi } from "vitest";
import { cadastrarCardapio } from "../cadastrarCardapio";
import { auth } from "@/auth";
import { db } from "@/lib/db/db";
import { revalidatePath } from "next/cache";
import { Session } from "next-auth";

// Mocks
vi.mock("@/auth", () => ({
  auth: vi.fn(),
}));

vi.mock("@/lib/db/db", () => ({
  db: {
    insert: vi.fn(() => ({
      values: vi.fn().mockResolvedValue(true),
    })),
  },
}));

vi.mock("next/cache", () => ({
  revalidatePath: vi.fn(),
}));

describe("Testes Unitários: cadastrarCardapio", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  function criarFormDataMock() {
    const formData = new FormData();
    formData.append("data", "2026-06-28");
    formData.append("panificacao", "prato-1");
    formData.append("sopa", "prato-2");
    return formData;
  }

  test("deve bloquear o acesso se o usuário não estiver logado", async () => {
    vi.mocked(auth as unknown as () => Promise<Session | null>).mockResolvedValueOnce(null);
    const formData = criarFormDataMock();

    await expect(cadastrarCardapio(formData)).rejects.toThrow("Não autorizado.");
    expect(db.insert).not.toHaveBeenCalled();
  });

  test("deve bloquear o acesso se o perfil for aluno", async () => {
    vi.mocked(auth as unknown as () => Promise<Session | null>).mockResolvedValueOnce({
      user: { id: "123", perfil: "aluno", name: "Aluno Teste" },
      expires: "9999-12-31",
    });
    const formData = criarFormDataMock();

    await expect(cadastrarCardapio(formData)).rejects.toThrow("Acesso negado: você não tem permissão.");
    expect(db.insert).not.toHaveBeenCalled();
  });

  test("deve processar o FormData e chamar a inserção no banco se for gestor", async () => {
    vi.mocked(auth as unknown as () => Promise<Session | null>).mockResolvedValueOnce({
  user: { id: "456", perfil: "gestorru", name: "Gestor RU" },
  expires: "9999-12-31",
});
    const formData = criarFormDataMock();

    const resultado = await cadastrarCardapio(formData);

    expect(db.insert).toHaveBeenCalled(); // Chamado para cardapioDiario e cardapioDiarioItem
    expect(revalidatePath).toHaveBeenCalledWith("/gestao/cardapio");
    expect(resultado).toEqual({ success: true });
  });
});