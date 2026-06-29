import { drizzle } from "drizzle-orm/better-sqlite3";
import Database from "better-sqlite3";
import path from "path";

const globalForDrizzle = globalThis as unknown as { conn: Database.Database | null}

const rawUrl = process.env.DATABASE_URL?.replace("file:", "")

const databaseUrl = rawUrl ? rawUrl : path.join(process.cwd(), "dev.db");

export const sqlite = globalForDrizzle.conn || new Database(databaseUrl);

if (process.env.NODE_ENV !== "production") globalForDrizzle.conn = sqlite;

export const db = drizzle(sqlite);