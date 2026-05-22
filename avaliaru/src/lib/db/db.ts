import { drizzle } from "drizzle-orm/better-sqlite3";
import Database from "better-sqlite3";

const globalForDrizzle = globalThis as unknown as { conn: Database.Database | null}

const databaseUrl = process.env.DATABASE_URL?.replace("file:", "") || "./dev.db";

export const sqlite = globalForDrizzle.conn || new Database(databaseUrl);

if (process.env.NODE_ENV !== "production") globalForDrizzle.conn = sqlite;

export const db = drizzle(sqlite);