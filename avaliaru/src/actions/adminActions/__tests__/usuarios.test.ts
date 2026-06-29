import { describe, it, expect, vi, beforeEach } from 'vitest';
import { cadastrarUsuarioAdmin } from '../usuarios';
import { db } from "@/lib/db/db";
import { auth } from "@/auth";

// --- Mocks: Definidos antes das importações para evitar erro de inicialização ---
vi.mock("@/auth", () => ({ auth: vi.fn() }));

vi.mock("@/lib/db/db", () => {
  const mDb = {
    select: vi.fn().mockReturnThis(),
    from: vi.fn().mockReturnThis(),
    where: vi.fn().mockReturnThis(), 
    insert: vi.fn().mockReturnThis(),
    values: vi.fn().mockReturnThis(),
  };
  return { db: mDb as any }; 
});

vi.mock("next/cache", () => ({ revalidatePath: vi.fn() }));
vi.mock("bcryptjs", () => {
  const bcryptMock = {
    hash: vi.fn().mockResolvedValue("hash"),
    compare: vi.fn().mockResolvedValue(true),
  };
  
  return {
    ...bcryptMock,
    default: bcryptMock, // Isso resolve o erro de 'No "default" export'
  };
});

// --- Helper para testes ---
const mockAuthAdmin = () => (auth as any).mockResolvedValue({ user: { perfil: "adm" } });

describe("cadastrarUsuarioAdmin", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("Validações de Entrada", () => {
    it("deve lançar erro se os campos estiverem vazios", async () => {
      mockAuthAdmin();
      await expect(cadastrarUsuarioAdmin({ 
        nome: "", email: "", senha: "", perfil: "adm" as any 
      })).rejects.toThrow("Preencha todos os campos obrigatorios.");
    });

    it("deve lançar erro se o e-mail for inválido", async () => {
      mockAuthAdmin();
      await expect(cadastrarUsuarioAdmin({ 
        nome: "Teste", email: "invalido", senha: "senhaforte", perfil: "adm" as any 
      })).rejects.toThrow("Informe um e-mail valido.");
    });
  });

  describe("Permissões e Banco de Dados", () => {
    it("deve bloquear acesso se não for administrador", async () => {
      (auth as any).mockResolvedValue({ user: { perfil: "aluno" } });
      await expect(cadastrarUsuarioAdmin({ 
        nome: "Teste", email: "a@a.com", senha: "senhaforte", perfil: "adm" as any 
      })).rejects.toThrow("Acesso permitido apenas para administradores.");
    });

    it("deve cadastrar com sucesso quando os dados forem válidos", async () => {
      mockAuthAdmin();
      
      // Acesso ao mock do banco sem erro de TS
      const dbAny = db as any;
      dbAny.where.mockResolvedValueOnce([]);

      await expect(cadastrarUsuarioAdmin({
        nome: "Novo Admin",
        email: "novo@admin.com",
        senha: "senhaforte",
        perfil: "adm"
      })).resolves.toBeDefined();
      
      expect(db.insert).toHaveBeenCalled();
    });
  });
});