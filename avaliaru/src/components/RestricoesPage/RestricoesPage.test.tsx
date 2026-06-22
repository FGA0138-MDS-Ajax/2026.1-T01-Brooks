import { removerRestricao } from "@/actions/restricaoActions/removerRestricao";
import { salvarRestricaoEstudante } from "@/actions/restricaoActions/salvarRestricao";
import myAlert from "@/lib/alert";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import type { Session } from "next-auth";
import { beforeEach, describe, expect, it, vi } from "vitest";
import RestricoesPage from "./RestricoesPage";

vi.mock("@/actions/restricaoActions/removerRestricao", () => ({
  removerRestricao: vi.fn(),
}));

vi.mock("@/actions/restricaoActions/salvarRestricao", () => ({
  salvarRestricaoEstudante: vi.fn(),
}));

vi.mock("@/lib/alert", () => ({
  default: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

const restricoes = [
  {
    codigo: "leite",
    nome: "Leite e derivados",
    descricao: "Leite, queijo e manteiga.",
    emoji: "",
  },
  {
    codigo: "trigo",
    nome: "Trigo/Glúten",
    descricao: "Pães e massas.",
    emoji: "",
  },
];

const session = {
  user: { id: "aluno-1", perfil: "aluno", name: "Aluno", email: "aluno@unb.br" },
  expires: "2099-01-01",
} as Session;

describe("RestricoesPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(salvarRestricaoEstudante).mockResolvedValue({ success: true });
    vi.mocked(removerRestricao).mockResolvedValue({ success: true });
  });

  it("exibe as restrições e a seleção inicial", () => {
    render(
      <RestricoesPage
        restricoes={restricoes}
        restricoesEstudante={["leite"]}
        session={session}
      />,
    );

    expect(screen.getByRole("checkbox", { name: /Leite e derivados/ })).toBeChecked();
    expect(screen.getByRole("checkbox", { name: /Trigo\/Glúten/ })).not.toBeChecked();
    expect(screen.getByText("1 selecionada(s)")).toBeInTheDocument();
  });

  it("salva uma nova restrição e atualiza a contagem", async () => {
    render(
      <RestricoesPage restricoes={restricoes} restricoesEstudante={[]} session={session} />,
    );

    fireEvent.click(screen.getByRole("checkbox", { name: /Trigo\/Glúten/ }));

    await waitFor(() => {
      expect(salvarRestricaoEstudante).toHaveBeenCalledWith({
        restricaoId: "trigo",
        fkEstudante: "aluno-1",
      });
    });
    expect(screen.getByText("1 selecionada(s)")).toBeInTheDocument();
    expect(myAlert.success).toHaveBeenCalledWith("Restrição adicionada com sucesso!");
  });

  it("remove uma restrição selecionada", async () => {
    render(
      <RestricoesPage
        restricoes={restricoes}
        restricoesEstudante={["leite"]}
        session={session}
      />,
    );

    fireEvent.click(screen.getByRole("checkbox", { name: /Leite e derivados/ }));

    await waitFor(() => {
      expect(removerRestricao).toHaveBeenCalledWith({
        restricaoId: "leite",
        fkEstudante: "aluno-1",
      });
    });
    expect(screen.getByText("0 selecionada(s)")).toBeInTheDocument();
  });

  it("restaura a seleção quando a action falha", async () => {
    vi.mocked(salvarRestricaoEstudante).mockRejectedValueOnce(new Error("falha"));

    render(
      <RestricoesPage restricoes={restricoes} restricoesEstudante={[]} session={session} />,
    );

    const checkbox = screen.getByRole("checkbox", { name: /Leite e derivados/ });
    fireEvent.click(checkbox);

    await waitFor(() => {
      expect(checkbox).not.toBeChecked();
    });
    expect(screen.getByText("0 selecionada(s)")).toBeInTheDocument();
    expect(myAlert.error).toHaveBeenCalled();
  });
});
