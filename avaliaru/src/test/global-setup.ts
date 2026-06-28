// Carrega as variáveis de ambiente do .env.local para este script de setup global.
import { config } from "dotenv";
config({ path: ".env.local" });

import { execSync } from "child_process";

export default async () => {
	console.log("\n[TEST SETUP] Applying Drizzle migrations...");

	try {
		// Use the existing CLI command to apply migrations.
		// This ensures the database defined in `.env.local` is migrated.
		execSync("npx drizzle-kit migrate", { stdio: "inherit" });
		console.log("[TEST SETUP] Migrations applied successfully.");
	} catch (error) {
		console.error("[TEST SETUP] Failed to apply migrations:", error);
		process.exit(1);
	}
};