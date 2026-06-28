import { fileURLToPath } from "node:url";
import { loadEnv } from "vite";
import { defineConfig } from "vitest/config";

export default defineConfig(({ mode }) => {
	const env = loadEnv(mode, process.cwd(), "");

	return {
		resolve: {
			alias: {
				"@": fileURLToPath(new URL("./src", import.meta.url)),
			},
		},
		test: {
			environment: "node",
			include: ["**/*.test.ts", "**/*.tests.ts", "**/*.integration.test.ts"],
			env,
			globalSetup: "./src/test/global-setup.ts",
			setupFiles: ["./src/test/setup.ts"],
			fileParallelism: false,
		},
	};
});