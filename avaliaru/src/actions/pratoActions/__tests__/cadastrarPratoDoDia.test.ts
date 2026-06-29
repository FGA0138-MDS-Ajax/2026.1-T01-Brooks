import { beforeEach, describe, expect, test, vi } from "vitest";
import { cadastrarPratoDoDia } from "../cadastrarPratoDoDia";
import { auth } from "@/auth";
import { db } from "@/lib/db/db";
import { revalidatePath } from "next/cache";
import { Session, User } from "next-auth";

// Criamos um tipo local que estende a Session para evitar o uso de 'any'
type CustomSession = Session & {
  user: User & { id: string; perfil: string };
};

vi.mock("@/auth", () => ({ auth: vi.fn() }));
vi.mock("@/lib/db/db", () => ({
  db: {
    insert: vi.fn(() => ({ values: vi.fn().mockResolvedValue(true) })),
    delete: vi.fn(() => ({ where: vi.fn().mockResolvedValue(true) })),
  },
}));
vi.mock("next/cache", () => ({ revalidatePath: vi.fn() }));

describe("Testes Unitários: cadastrarPratoDoDia", () => {
  beforeEach(() => { vi.clearAllMocks(); });

  function criarFormData(idPrato: string, refeicao: string) {
    const formData = new FormData();
    formData.append("idPrato", idPrato);
    formData.append("refeicao", refeicao);
    return formData;
  }

  test("deve bloquear acesso para alunos", async () => {
    const mockSession: CustomSession = {
      user: { id: "123", perfil: "aluno", name: "Aluno" },
      expires: "9999-12-31T23:59:59.999Z"
    };

    vi.mocked(auth as unknown as () => Promise<Session | null>).mockResolvedValueOnce(mockSession);
    
    await expect(cadastrarPratoDoDia(criarFormData("p1", "almoço"))).rejects.toThrow("Acesso negado: você não tem permissão.");
  });

  test("deve lançar erro se faltarem campos obrigatórios", async () => {
    const mockSession: CustomSession = {
      user: { id: "123", perfil: "adm", name: "Admin" },
      expires: "9999-12-31T23:59:59.999Z"
    };

    vi.mocked(auth as unknown as () => Promise<Session | null>).mockResolvedValueOnce(mockSession);

    // Mandando FormData sem a refeição
    const formData = new FormData();
    formData.append("idPrato", "p1");

    await expect(cadastrarPratoDoDia(formData)).rejects.toThrow("Preencha todos os campos obrigatórios.");
  });

  test("deve prosseguir com sucesso e revalidar rotas se for gestor", async () => {
    const mockSession: CustomSession = {
      user: { id: "123", perfil: "gestorru", name: "Gestor" },
      expires: "9999-12-31T23:59:59.999Z"
    };

    vi.mocked(auth as unknown as () => Promise<Session | null>).mockResolvedValueOnce(mockSession);

    const resultado = await cadastrarPratoDoDia(criarFormData("p1", "almoço"));

    expect(db.insert).toHaveBeenCalled();
    expect(revalidatePath).toHaveBeenCalledWith("/gestao/cardapio");
    expect(revalidatePath).toHaveBeenCalledWith("/dashboard");
    expect(resultado).toEqual({ success: true });
  });
});