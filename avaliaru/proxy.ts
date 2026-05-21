import { auth } from "@/auth";

import { NextRequest } from "next/server";

export default auth((req: NextRequest & {auth: any}) => {
  const isLoggedIn = !!req.auth;
  const userRole = req.auth?.user?.role; // "gestorru" | "aluno" | "adm"
  const { nextUrl } = req;

  const isApiAuthRoute = nextUrl.pathname.startsWith("/api/auth");
  const isPublicRoute = ["/", "/login", "/register"].includes(nextUrl.pathname);

  if (isApiAuthRoute) return;

  // 1. Bloqueia usuários deslogados de acessar qualquer rota privada
  if (!isLoggedIn && !isPublicRoute) {
    return Response.redirect(new URL("/login", nextUrl));
  }

  // 2. Se o usuário estiver logado, aplica as travas estritas da tabela:
  if (isLoggedIn) {
    const path = nextUrl.pathname;

    // REGRAS PARA O ALUNO (Apenas /dashboard)
    if (userRole === "aluno") {
      if (path.startsWith("/gestao") || path.startsWith("/admin")) {
        return Response.redirect(new URL("/dashboard", nextUrl));
      }
    }

    // REGRAS PARA O GESTOR RU (Apenas /gestao)
    if (userRole === "gestorru") {
      if (path.startsWith("/dashboard") || path.startsWith("/admin")) {
        return Response.redirect(new URL("/gestao", nextUrl));
      }
    }

    // REGRAS PARA O ADMIN (Apenas /gestao e /admin)
    if (userRole === "adm") {
      if (path.startsWith("/dashboard")) {
        // Como ele não entra no dashboard, jogamos ele para a rota principal dele (/admin)
        return Response.redirect(new URL("/admin", nextUrl));
      }
    }
  }

  return;
});

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)"],
};