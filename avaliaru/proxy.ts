import { auth } from "@/auth";
import { NextResponse } from "next/server";

const PUBLIC_ROUTES = ["/", "/login", "/register", "/forgot-password"];

const AUTH_ROUTES = ["/login", "/register", "/forgot-password"];

export default auth((req) => {
  const session = req.auth;

  const isLoggedIn = !!session;
  const userRole = session?.user?.perfil; 
  const hasValidRole =
    userRole === "aluno" || userRole === "gestorru" || userRole === "adm";

  const { nextUrl } = req;
  const path = nextUrl.pathname;

  const isApiAuthRoute = path.startsWith("/api/auth");
  // --- ADICIONADA: Identificador da nossa rota de cron ---
  const isCronRoute = path.startsWith("/api/cron"); 
  
  const isAuthRoute = AUTH_ROUTES.includes(path);
  const isPublicRoute = PUBLIC_ROUTES.includes(path);

  // --- ALTERADO: Liberar tanto as rotas de auth quanto a de cron ---
  if (isApiAuthRoute || isCronRoute) return NextResponse.next();

  if ((!isLoggedIn || !hasValidRole) && !isPublicRoute) {
    return NextResponse.redirect(new URL("/login", nextUrl));
  }

  if (isLoggedIn && hasValidRole) {
    if (isAuthRoute || path === "/") {
      if (userRole === "aluno") return NextResponse.redirect(new URL("/dashboard", nextUrl));
      if (userRole === "gestorru") return NextResponse.redirect(new URL("/gestao", nextUrl));
      if (userRole === "adm") return NextResponse.redirect(new URL("/admin", nextUrl));

      return NextResponse.redirect(new URL("/", nextUrl));
    }

    if (userRole === "aluno" && !path.startsWith("/dashboard")) {
      return NextResponse.redirect(new URL("/dashboard", nextUrl));
    }

    if (userRole === "gestorru" && !path.startsWith("/gestao")) {
      return NextResponse.redirect(new URL("/gestao", nextUrl));
    }

    if (
      userRole === "adm" &&
      !path.startsWith("/admin") &&
      !path.startsWith("/gestao")
    ) {
      return NextResponse.redirect(new URL("/admin", nextUrl));
    }
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)"],
};