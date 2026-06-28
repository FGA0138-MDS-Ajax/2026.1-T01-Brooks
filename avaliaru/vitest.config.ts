import { defineConfig } from "vitest/config";
import { loadEnv } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig(({ mode }) => {
	// Carrega as variáveis de ambiente do arquivo .env.local para o processo de teste.
	// Isso garante que o DATABASE_URL esteja disponível quando o `db` for inicializado.
	const env = loadEnv(mode, process.cwd(), "");

	return {
		plugins: [tsconfigPaths()],
		test: {
			include: ["**/*.{test,tests,spec}.?(c|m)[jt]s?(x)"],
			// Disponibiliza as variáveis de ambiente para os testes
			env,
			// Este arquivo roda uma vez antes de todos os testes, garantindo que o BD esteja pronto.
			globalSetup: "./src/test/global-setup.ts",
			// Este arquivo roda antes de cada arquivo de teste, fornecendo mocks e globais.
			setupFiles: ["./src/test/setup.ts"],
		},
	};
});