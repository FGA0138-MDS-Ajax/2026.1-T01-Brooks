import { DefaultSession } from "next-auth";
import type { UsuarioPerfil } from "./types";


declare module "next-auth" {
    interface Session {
        user: {
            perfil: UsuarioPerfil;
            name: string;
            email: string;
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