import { cadastrarUsuarioAdmin } from "@/actions/adminActions/usuarios";
import myAlert from "@/lib/alert";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import type { Session } from "next-auth";
import { beforeEach, describe, expect, it, vi } from "vitest";
import AdminPage from "./AdminPage";

vi.mock("@/actions/adminActions/usuarios", () => ({
  cadastrarUsuarioAdmin: vi.fn(),
}));

vi.mock("@/lib/alert", () => ({
  default: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

const push = vi.fn();

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push }),
}));

const session = {
  user: {
    id: "admin-1",
    name: "Administrador AvaliaRU",
    email: "admin@avaliaru.local",
    perfil: "adm",
  },
  expires: "2099-01-01",
} as Session;

const usuarios = [
  {
    id: "aluno-1",
    nome: "Ana Costa",
    email: "ana.costa@aluno.unb.br",
    perfil: "aluno" as const,
  },
  {
    id: "gestor-1",
    nome: "Equipe RU",
    email: "gestao.ru@unb.br",
    perfil: "gestorru" as const,
  },
  {
    id: "admin-1",
    nome: "Administrador AvaliaRU",
    email: "admin@avaliaru.local",
    perfil: "adm" as const,
  },
];

describe("AdminPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(cadastrarUsuarioAdmin).mockResolvedValue({
      id: "novo-aluno",
      nome: "Bruno Martins",
      email: "bruno@aluno.unb.br",
      perfil: "aluno",
    });
  });

  it("exibe o resumo de contas e filtra usuarios por busca", () => {
    render(<AdminPage session={session} usuariosIniciais={usuarios} />);

    expect(screen.getByText("Total de contas")).toBeInTheDocument();
    expect(screen.getByText("Alunos")).toBeInTheDocument();
    expect(screen.getByText("Gestores RU")).toBeInTheDocument();
    expect(screen.getByText("Administradores")).toBeInTheDocument();

    fireEvent.change(screen.getByRole("searchbox"), {
      target: { value: "ana" },
    });

    expect(screen.getByText("Ana Costa")).toBeInTheDocument();
    expect(screen.queryByText("Equipe RU")).not.toBeInTheDocument();
    expect(screen.queryByText("admin@avaliaru.local")).not.toBeInTheDocument();
    expect(screen.getByText("1 resultado encontrado")).toBeInTheDocument();
  });

  it("filtra contas por perfil de acesso", () => {
    render(<AdminPage session={session} usuariosIniciais={usuarios} />);

    fireEvent.change(screen.getByDisplayValue("Todos os perfis"), {
      target: { value: "gestorru" },
    });

    expect(screen.getByText("Equipe RU")).toBeInTheDocument();
    expect(screen.queryByText("Ana Costa")).not.toBeInTheDocument();
    expect(screen.queryByText("admin@avaliaru.local")).not.toBeInTheDocument();
  });

  it("valida senhas divergentes antes de cadastrar conta", async () => {
    render(<AdminPage session={session} usuariosIniciais={usuarios} />);

    fireEvent.click(screen.getByRole("button", { name: "Nova conta" }));
    fireEvent.change(screen.getByPlaceholderText("Nome do usuário"), {
      target: { value: "Bruno Martins" },
    });
    fireEvent.change(screen.getByPlaceholderText("usuario@unb.br"), {
      target: { value: "bruno@aluno.unb.br" },
    });
    fireEvent.change(screen.getByPlaceholderText("Mínimo de 8 caracteres"), {
      target: { value: "senha123" },
    });
    fireEvent.change(screen.getByPlaceholderText("Repita a senha"), {
      target: { value: "senha456" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Cadastrar conta" }));

    await waitFor(() => {
      expect(myAlert.error).toHaveBeenCalledWith("As senhas não coincidem.");
    });
    expect(cadastrarUsuarioAdmin).not.toHaveBeenCalled();
  });

  it("cadastra uma nova conta e atualiza a lista", async () => {
    render(<AdminPage session={session} usuariosIniciais={usuarios} />);

    fireEvent.click(screen.getByRole("button", { name: "Nova conta" }));
    fireEvent.change(screen.getByPlaceholderText("Nome do usuário"), {
      target: { value: "Bruno Martins" },
    });
    fireEvent.change(screen.getByPlaceholderText("usuario@unb.br"), {
      target: { value: "bruno@aluno.unb.br" },
    });
    fireEvent.change(screen.getByPlaceholderText("Mínimo de 8 caracteres"), {
      target: { value: "senha123" },
    });
    fireEvent.change(screen.getByPlaceholderText("Repita a senha"), {
      target: { value: "senha123" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Cadastrar conta" }));

    await waitFor(() => {
      expect(cadastrarUsuarioAdmin).toHaveBeenCalledWith({
        nome: "Bruno Martins",
        email: "bruno@aluno.unb.br",
        senha: "senha123",
        perfil: "aluno",
      });
    });

    expect(await screen.findByText("Bruno Martins")).toBeInTheDocument();
    expect(myAlert.success).toHaveBeenCalledWith("Conta cadastrada com sucesso.");
  });

  it("navega para gestao de pratos pela acao administrativa", () => {
    render(<AdminPage session={session} usuariosIniciais={usuarios} />);

    fireEvent.click(screen.getByRole("button", { name: "Gestão de pratos" }));

    expect(push).toHaveBeenCalledWith("/gestao/listarPratos");
  });
});
