import "dotenv/config";
import { migrate } from "drizzle-orm/better-sqlite3/migrator";
import { db, sqlite } from "./db";
import path from "path";

export function runMigrations() {
  try {
    migrate(db, { 
      migrationsFolder: path.join(process.cwd(), "generated") 
    });
    console.log("✅ \x1b[32mMigrations executadas com sucesso!\x1b[0m");
  } catch (error) {
    console.error("❌ \x1b[31mErro ao executar as migrations:\x1b[0m", error);
  }
}

if (require.main === module) {
  runMigrations();
  sqlite.close();
}