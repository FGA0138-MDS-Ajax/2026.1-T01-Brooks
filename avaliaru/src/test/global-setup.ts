// Carrega as variáveis de ambiente do .env.local para este script de setup global.
import { config } from "dotenv";
config({ path: ".env.local" });

import { execSync } from "child_process";
import Database from "better-sqlite3";
import path from "path";

export default async () => {
	console.log("\n[TEST SETUP] Applying Drizzle migrations...");

	try {
		const databaseUrl = process.env.DATABASE_URL?.replace("file:", "") || path.join(process.cwd(), "dev.db");
		const sqlite = new Database(databaseUrl);
		const schemaAlreadyExists = sqlite
			.prepare("SELECT name FROM sqlite_master WHERE type = 'table' AND name = 'users' LIMIT 1")
			.get();
		sqlite.close();

		if (!schemaAlreadyExists) {
			execSync("npx drizzle-kit push", { stdio: "inherit" });
			console.log("[TEST SETUP] Schema applied successfully.");
		} else {
			console.log("[TEST SETUP] Schema already present, skipping push.");
		}
	} catch (error) {
		console.error("[TEST SETUP] Failed to apply schema:", error);
		process.exit(1);
	}
};