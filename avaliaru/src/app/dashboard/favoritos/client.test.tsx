import { adicionarFavorito } from "@/actions/favoritosActions/adicionarFavorito";
import { removerFavorito } from "@/actions/favoritosActions/removerFavorito";
import myAlert from "@/lib/alert";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import type { Session } from "next-auth";
import { beforeEach, describe, expect, it, vi } from "vitest";
import FavoritosClient from "./client";

vi.mock("@/actions/favoritosActions/adicionarFavorito", () => ({
  adicionarFavorito: vi.fn(),
}));

vi.mock("@/actions/favoritosActions/removerFavorito", () => ({
  removerFavorito: vi.fn(),
}));

vi.mock("@/lib/alert", () => ({
  default: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

const pratos = [
  { idPrato: "pao_queijo", nome: "Pão de queijo" },
  { idPrato: "strogonoff", nome: "Strogonoff de frango" },
  { idPrato: "feijoada", nome: "Feijoada vegana" },
];

const session = {
  user: { id: "aluno-1", perfil: "aluno", name: "Aluno", email: "aluno@unb.br" },
  expires: "2099-01-01",
} as Session;

describe("FavoritosClient", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(adicionarFavorito).mockResolvedValue({ success: true });
    vi.mocked(removerFavorito).mockResolvedValue({ success: true });
  });

  it("pesquisa pratos ignorando acentos", async () => {
    render(
      <FavoritosClient
        pratos={pratos}
        favoritosIniciais={["pao_queijo"]}
        session={session}
      />,
    );

    fireEvent.change(screen.getByRole("searchbox", { name: "Pesquisar prato" }), {
      target: { value: "pao" },
    });

    expect(await screen.findByText("Pão de queijo")).toBeInTheDocument();
    expect(screen.queryByText("Strogonoff de frango")).not.toBeInTheDocument();
    expect(screen.getByText("1 resultado encontrado")).toBeInTheDocument();
  });

  it("filtra somente os pratos favoritos", () => {
    render(
      <FavoritosClient
        pratos={pratos}
        favoritosIniciais={["strogonoff"]}
        session={session}
      />,
    );

    fireEvent.click(screen.getByRole("button", { name: "Favoritos" }));

    expect(screen.getByText("Strogonoff de frango")).toBeInTheDocument();
    expect(screen.queryByText("Pão de queijo")).not.toBeInTheDocument();
  });

  it("adiciona um favorito e atualiza a contagem", async () => {
    render(
      <FavoritosClient pratos={pratos} favoritosIniciais={[]} session={session} />,
    );

    fireEvent.click(
      screen.getByRole("button", { name: "Adicionar Feijoada vegana aos favoritos" }),
    );

    await waitFor(() => {
      expect(adicionarFavorito).toHaveBeenCalledWith("feijoada", session);
    });
    expect(screen.getByText("1", { selector: "strong" })).toBeInTheDocument();
    expect(myAlert.success).toHaveBeenCalledWith("Favorito adicionado com sucesso!");
  });

  it("restaura o estado quando a atualização falha", async () => {
    vi.mocked(removerFavorito).mockRejectedValueOnce(new Error("falha"));
    vi.spyOn(console, "error").mockImplementation(() => undefined);

    render(
      <FavoritosClient
        pratos={pratos}
        favoritosIniciais={["pao_queijo"]}
        session={session}
      />,
    );

    fireEvent.click(
      screen.getByRole("button", { name: "Remover Pão de queijo dos favoritos" }),
    );

    await waitFor(() => {
      expect(
        screen.getByRole("button", { name: "Remover Pão de queijo dos favoritos" }),
      ).toBePressed();
    });
    expect(myAlert.error).toHaveBeenCalled();
  });
});
