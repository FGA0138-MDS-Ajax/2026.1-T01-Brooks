import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";

import { DrizzleAdapter } from "@auth/drizzle-adapter";

import { db } from "./lib/db/db";

import {
  users,
  accounts,
  sessions,
  verificationTokens,
} from "./lib/db/schema";
import { eq } from "drizzle-orm";
import { compare } from "bcrypt-ts"
import { UsuarioPerfil } from "./types/types";

export const {
  handlers: { GET, POST },
  auth,
  signIn,
  signOut,
} = NextAuth({
  adapter: DrizzleAdapter(db, {
    usersTable: users,
    accountsTable: accounts,
    sessionsTable: sessions,
    verificationTokensTable: verificationTokens,
  }),

  session: {
    strategy: "jwt",
  },

  callbacks: {
    async jwt({ token, user }) {
      // Quando o usuário fizer login, injeta o perfil no token JWT
      if (user?.perfil) {
        token.perfil = user.perfil;
      }

      // Mantém o perfil sincronizado com o banco para sessões antigas ou após troca de perfil
      if (!token.perfil && token.sub) {
        const [dbUser] = await db
          .select({ perfil: users.perfil })
          .from(users)
          .where(eq(users.id, token.sub));

        if (dbUser?.perfil) {
          token.perfil = dbUser.perfil;
        }
      }

      return token;
    },
    async session({ session, token }) {
      // Repassa a perfil do token para a sessão que o Proxy lê
      if (session.user) {
        session.user.perfil = token.perfil as UsuarioPerfil;
        session.user.name = token.name as string;
        session.user.email = token.email as string;
      }
      return session;
    },
  },

  providers: [
    Credentials({
      credentials: {
        email: {},
        password: {},
      },

      async authorize(credentials) {
        if (!credentials?.email || !credentials.password) return null;

          const [user] = await db
            .select()
            .from(users)
            .where(eq(users.email, credentials.email as string));

          if (!user || !user.passwordHash) return null;

          const passwordMatch = await compare(
            credentials.password as string,
            user.passwordHash
          );

          if (!passwordMatch) return null;

          return {
            id: user.id,
            email: user.email,
            name: user.name,
            image: user.image,
            perfil: user.perfil,
          };
      },
    }),
  ],
});