import { beforeEach, describe, expect, test, vi } from "vitest";
import { cadastrarPrato } from "../cadastrarPrato";
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
    insert: vi.fn(() => ({
      values: vi.fn().mockResolvedValue(true),
    })),
  },
}));
vi.mock("next/cache", () => ({ revalidatePath: vi.fn() }));

describe("Testes Unitários: cadastrarPrato", () => {
  beforeEach(() => { vi.clearAllMocks(); });

  function criarFormData(codigo: string, nome: string) {
    const formData = new FormData();
    formData.append("codigo", codigo);
    formData.append("nome", nome);
    return formData;
  }

  test("deve bloquear o acesso se não houver sessão", async () => {
    vi.mocked(auth as unknown as () => Promise<Session | null>).mockResolvedValueOnce(null);
    
    await expect(cadastrarPrato(criarFormData("p1", "Prato 1"))).rejects.toThrow("Não autorizado.");
  });

  test("deve bloquear acesso para perfil aluno", async () => {
    const mockSession: CustomSession = {
      user: { id: "123", perfil: "aluno", name: "Aluno" },
      expires: "9999-12-31T23:59:59.999Z"
    };

    vi.mocked(auth as unknown as () => Promise<Session | null>).mockResolvedValueOnce(mockSession);
    
    await expect(cadastrarPrato(criarFormData("p1", "Prato 1"))).rejects.toThrow("Acesso negado: você não tem permissão.");
  });

  test("deve permitir cadastro para gestorru e revalidar a rota", async () => {
    const mockSession: CustomSession = {
      user: { id: "123", perfil: "gestorru", name: "Gestor" },
      expires: "9999-12-31T23:59:59.999Z"
    };

    vi.mocked(auth as unknown as () => Promise<Session | null>).mockResolvedValueOnce(mockSession);

    const resultado = await cadastrarPrato(criarFormData("p-novo", "Lasanha"));

    expect(db.insert).toHaveBeenCalled();
    expect(revalidatePath).toHaveBeenCalledWith("/gestao/pratos");
    expect(resultado).toEqual({ success: true });
  });
});