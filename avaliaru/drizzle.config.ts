import { defineConfig } from "drizzle-kit";
import * as dotenv from "dotenv";

// Carrega variáveis do arquivo .env local para o CLI
dotenv.config({ path: ".env.local" });

export default defineConfig({
  dialect: "sqlite",
  schema: "./src/lib/db/schema.ts",
  out: "./generated",
  dbCredentials: {
    url: process.env.DATABASE_URL?.replace("file:", "") || "dev.db",
  },
});