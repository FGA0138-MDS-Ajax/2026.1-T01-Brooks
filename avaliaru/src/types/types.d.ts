import { DefaultSession } from "next-auth";
import type { UsuarioPerfil } from "./lib/db/schema";

declare module "next-auth" {
    interface Session {
        user: {
            perfil: UsuarioPerfil;
        } & DefaultSession["user"];
    }

    interface User {
        perfil: UsuarioPerfil;
    }
}

declare module "next-auth/jwt" {
    interface JWT {
        perfil: UsuarioPerfil;
    }
}