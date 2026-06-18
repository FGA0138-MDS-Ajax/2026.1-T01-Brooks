import { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      perfil?: "gestorru" | "aluno" | "adm";
    } & DefaultSession["user"];
  }

  interface User {
    perfil?: "gestorru" | "aluno" | "adm";
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    perfil?: "gestorru" | "aluno" | "adm";
  }
}
