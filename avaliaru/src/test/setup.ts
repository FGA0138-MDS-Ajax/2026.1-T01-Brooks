import "@testing-library/jest-dom/vitest";
// As variáveis de ambiente são carregadas no `vitest.config.ts` (para os testes)
// e no `global-setup.ts` (para o setup global/migrations).

import { cleanup } from "@testing-library/react";
import { afterEach, vi } from "vitest";

afterEach(() => {
  cleanup();
});

// --- Mocks para testes de Server Actions e Next-Auth ---

vi.mock("next/cache", () => ({
  revalidatePath: vi.fn(),
}));

vi.mock("next/server", () => ({
  NextResponse: {
    json: (data: unknown) => ({ 
      ... (data as Record<string, unknown>), // Casting explícito para manter a estrutura
      json: () => Promise.resolve(data) 
    }),
    next: vi.fn(),
  },
}));

// Impede o Next-Auth de buscar variáveis de ambiente internas do Next durante os testes
vi.mock("next-auth", () => {
  return {
    default: () => ({
      handlers: { GET: vi.fn(), POST: vi.fn() },
      auth: vi.fn(),
      signIn: vi.fn(),
      signOut: vi.fn(),
    }),
  };
});