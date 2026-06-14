import { DataDMA, usuarioPerfis } from "@/types/types"
import { integer, sqliteTable, text, primaryKey, blob, } from "drizzle-orm/sqlite-core"
import type { AdapterAccount } from "next-auth/adapters"

/*
 *   Modelo Físico do Banco de Dados da aplicação Avaliaru
 */

// Esquema de autenticação do NextAuth.js, adaptado para o Drizzle ORM e SQLite

export const users = sqliteTable("user", {
    id: text("id")
        .primaryKey()
        .$defaultFn(() => crypto.randomUUID()),
    name: text("name").unique(),
    email: text("email").unique(),
    emailVerified: integer("emailVerified", { mode: "timestamp_ms" }),
    image: text("image"),
    passwordHash: text("passwordHash"),
    perfil: text("perfil", {enum: usuarioPerfis}).notNull().default("aluno"),
})

export const accounts = sqliteTable(
    "account",
    {
        userId: text("userId")
            .notNull()
            .references(() => users.id, { onDelete: "cascade" }),
        type: text("type").$type<AdapterAccount["type"]>().notNull(),
        provider: text("provider").notNull(),
        providerAccountId: text("providerAccountId").notNull(),
        refresh_token: text("refresh_token"),
        access_token: text("access_token"),
        expires_at: integer("expires_at"),
        token_type: text("token_type"),
        scope: text("scope"),
        id_token: text("id_token"),
        session_state: text("session_state"),
    },
    (account) => [
        primaryKey({
            columns: [account.provider, account.providerAccountId],
        }),
    ]
)

export const sessions = sqliteTable("session", {
    sessionToken: text("sessionToken").primaryKey(),
    userId: text("userId")
        .notNull()
        .references(() => users.id, { onDelete: "cascade" }),
    expires: integer("expires", { mode: "timestamp_ms" }).notNull(),
})

export const verificationTokens = sqliteTable(
    "verificationToken",
    {
        identifier: text("identifier").notNull(),
        token: text("token").notNull(),
        expires: integer("expires", { mode: "timestamp_ms" }).notNull(),
    },
    (verificationToken) => [
        primaryKey({
            columns: [verificationToken.identifier, verificationToken.token],
        }),
    ]
)

export const authenticators = sqliteTable(
    "authenticator",
    {
        credentialID: text("credentialID").notNull().unique(),
        userId: text("userId")
            .notNull()
            .references(() => users.id, { onDelete: "cascade" }),
        providerAccountId: text("providerAccountId").notNull(),
        credentialPublicKey: text("credentialPublicKey").notNull(),
        counter: integer("counter").notNull(),
        credentialDeviceType: text("credentialDeviceType").notNull(),
        credentialBackedUp: integer("credentialBackedUp", {
            mode: "boolean",
        }).notNull(),
        transports: text("transports"),
    },
    (authenticator) => [
        primaryKey({
            columns: [authenticator.userId, authenticator.credentialID],
        }),
    ]
)

// Modelo físico do banco de dados para a aplicação Avaliaru

export const restricaoAlimentar = sqliteTable(
    "restricaoAlimentar",
    {   
        codigo: text("codigo").primaryKey(),
        nome: text("nome").notNull(),
    }
)

export const prato = sqliteTable(
    "prato",
    {
        idPrato: text("idPrato").primaryKey().notNull(),
        nome: text("nome").notNull(),
    }
)

export const avaliacao = sqliteTable(
    "avaliacao",
    {
        idAvaliacao: integer("idAvaliacao").primaryKey({autoIncrement: true}),
        nota: integer("nota").notNull(),
        dataHoraAvaliacao: integer("dataHoraAvaliacao", { mode: "timestamp_ms" }).notNull(),
        comentario: text("comentario"),
        statusModeracao: integer("statusModeracao", {mode: "boolean"}).notNull(), // true = publico, false = moderado
        fkPratoDoDia: integer("fkPratoDoDia").notNull().references(() => pratoDoDia.idPratoDoDia, { onDelete: "cascade" }),
        fkEstudante: text("fkEstudante").notNull().references(() => users.id, { onDelete: "cascade" }),
    }
)

export const pratoDoDia = sqliteTable(
    "pratoDoDia",
    {
        idPratoDoDia: integer("idPratoDoDia").primaryKey({autoIncrement: true}),
        refeicao: text({enum: ["café", "almoço", "jantar"]}).notNull(),
        data: text("data", { mode: "json" }).$type<DataDMA>().notNull(),
        fkPrato: text("fkPrato").notNull().references(() => prato.idPrato, { onDelete: "cascade" }),
    }
)

export const estudantePossuiRestricao = sqliteTable(
    "estudantePossuiRestricao",
    {
        fkEstudante: text("fkEstudante").notNull().references(() => users.id, { onDelete: "cascade" }),
        fkRestricao: text("fkRestricao").notNull().references(() => restricaoAlimentar.codigo, { onDelete: "cascade" }),
    },
    (estudantePossuiRestricao) => [
        primaryKey({
            columns: [estudantePossuiRestricao.fkEstudante, estudantePossuiRestricao.fkRestricao],
        }),
    ]
)

export const estudanteFavoritaPrato = sqliteTable(
    "estudanteFavoritaPrato",
    {
        fkEstudante: text("fkEstudante").notNull().references(() => users.id, { onDelete: "cascade" }),
        fkPrato: text("fkPrato").notNull().references(() => prato.idPrato, { onDelete: "cascade" }),
    },
    (estudanteFavoritaPrato) => [
        primaryKey({
            columns: [estudanteFavoritaPrato.fkEstudante, estudanteFavoritaPrato.fkPrato],
        }),
    ]
)

export const restricaoContemPrato = sqliteTable(
    "restricaoContemPrato",
    {
        fkRestricao: text("fkRestricao").notNull().references(() => restricaoAlimentar.codigo, { onDelete: "cascade" }),
        fkPrato: text("fkPrato").notNull().references(() => prato.idPrato, { onDelete: "cascade" }),
    },
    (restricaoContemPrato) => [
        primaryKey({
            columns: [restricaoContemPrato.fkRestricao, restricaoContemPrato.fkPrato],
        }),
    ]
)

/*
 *    Configurações para parametrizar a aplicação 
 */

import { InferSelectModel } from "drizzle-orm";

export type Prato = InferSelectModel<typeof prato>;