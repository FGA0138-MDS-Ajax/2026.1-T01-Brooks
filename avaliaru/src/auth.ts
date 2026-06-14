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
      if (user) {
        token.role = user.perfil;
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      // Repassa a role do token para a sessão que o Proxy lê
      if (session.user) {
        session.user.role = token.role as UsuarioPerfil;
        session.user.id = token.id as string;
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
        console.log(credentials.email, credentials.password);
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