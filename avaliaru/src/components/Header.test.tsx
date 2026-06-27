import { fireEvent, render, screen } from "@testing-library/react";
import { signOut } from "next-auth/react";
import { usePathname, useRouter } from "next/navigation";
import { beforeEach, describe, expect, it, vi } from "vitest";
import Header from "./Header";

vi.mock("next-auth/react", () => ({
  signOut: vi.fn(),
}));

const push = vi.fn();
const usePathnameMock = vi.fn();

vi.mock("next/navigation", () => ({
  usePathname: vi.fn(),
  useRouter: vi.fn(),
}));

describe("Header", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    usePathnameMock.mockReturnValue("/dashboard/cardapio");
    vi.mocked(usePathname).mockImplementation(usePathnameMock);
    vi.mocked(useRouter).mockReturnValue({ push } as unknown as ReturnType<typeof useRouter>);
  });

  it("nao renderiza navegacao quando o perfil nao esta definido", () => {
    const { container } = render(<Header perfil={undefined} />);

    expect(container).toBeEmptyDOMElement();
  });

  it("renderiza menu de aluno e navega para cardapio", () => {
    render(<Header perfil="aluno" />);

    expect(screen.getByRole("navigation", { name: "Navegação principal" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Cardápio" })).toHaveAttribute(
      "aria-current",
      "page",
    );

    fireEvent.click(screen.getByRole("button", { name: "Favoritos" }));

    expect(push).toHaveBeenCalledWith("/dashboard/favoritos");
  });

  it("renderiza acoes administrativas para perfil adm", () => {
    usePathnameMock.mockReturnValue("/admin");

    render(<Header perfil="adm" />);

    expect(screen.getByRole("button", { name: "Usuários" })).toHaveAttribute(
      "aria-current",
      "page",
    );

    fireEvent.click(screen.getByRole("button", { name: "Cardápio semanal" }));

    expect(push).toHaveBeenCalledWith("/gestao/cadastrarCardapio");
  });

  it("abre o menu mobile e navega pelos atalhos", () => {
    render(<Header perfil="gestorru" />);

    fireEvent.click(screen.getByLabelText("Abrir menu"));

    expect(screen.getByLabelText("Fechar menu")).toHaveAttribute(
      "aria-expanded",
      "true",
    );
    expect(screen.getByRole("navigation", { name: "Navegação móvel" })).toBeInTheDocument();

    fireEvent.click(screen.getAllByRole("button", { name: "Cadastrar prato" }).at(-1)!);

    expect(push).toHaveBeenCalledWith("/gestao/cadastrarPrato");
  });

  it("realiza logout enviando o usuario para login", () => {
    render(<Header perfil="aluno" />);

    fireEvent.click(screen.getByRole("button", { name: "Sair" }));

    expect(signOut).toHaveBeenCalledWith({ callbackUrl: "/login" });
  });
});
