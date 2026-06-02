import { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      role?: "gestorru" | "aluno" | "adm";
    } & DefaultSession["user"];
  }

  interface User {
    perfil?: "gestorru" | "aluno" | "adm";
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    role?: "gestorru" | "aluno" | "adm";
  }
}
