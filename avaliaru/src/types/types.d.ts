/**
 * Esse arquivo contem as declarações de tipos globais para o projeto Avaliaru. Ele inclui definições de tipos para rotas, propriedades de páginas e layouts. Esses tipos são usados em todo o projeto para garantir a consistência e a segurança de tipo ao trabalhar com rotas, parâmetros e cache.
*/

import { DefaultSession } from "next-auth";
import { UsuarioPerfil } from "./lib/db/schema";

declare module "next-auth" {
    interface Session {
        user: {
            perfil: UsuarioPerfil;
        } & DefaultSession["user"];
    }

    interface User {
        perfil?: UsuarioPerfil;
    }
}

declare module "next-auth/jwt" {
    interface JWT {
        perfil: UsuarioPerfil;
    }
}