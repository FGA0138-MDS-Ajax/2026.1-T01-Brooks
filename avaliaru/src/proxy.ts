import { auth } from "@/auth";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const PUBLIC_ROUTES = ["/", "/login", "/register", "/forgot-password"];

export default async function proxy(req: NextRequest){
  const session = await auth()

  const isLoggedIn = !!session;
  const userRole = session?.user?.role; // "gestorru" | "aluno" | "adm"

  const { nextUrl } = req;
  const path = nextUrl.pathname;

  const isApiAuthRoute = path.startsWith("/api/auth");
  const isPublicRoute = PUBLIC_ROUTES.includes(path);

  if (isApiAuthRoute) return NextResponse.next();

  if (!isLoggedIn && !isPublicRoute) {
    return NextResponse.redirect(new URL("/login", nextUrl));
  }

  // 2. Proteção contra Loop: Usuário já logado tentando ir para telas de Auth
  if (isLoggedIn && ["/login", "/register", "/forgot-password"].includes(path)) {
    if (userRole === "aluno") return NextResponse.redirect(new URL("/dashboard", nextUrl));
    if (userRole === "gestorru") return NextResponse.redirect(new URL("/gestao", nextUrl));
    if (userRole === "adm") return NextResponse.redirect(new URL("/admin", nextUrl));
    
    return NextResponse.redirect(new URL("/", nextUrl));
  }

  if (isLoggedIn) {

    if (userRole === "aluno") {
      // Acessa apenas a rota dashboard
      if (!path.startsWith("/dashboard")) {
        return NextResponse.redirect(new URL("/dashboard", nextUrl));
      }
    }

    if (userRole === "gestorru") {
      // Acessa apenas a rota gestao
      if (!path.startsWith("/gestao")) {
        return NextResponse.redirect(new URL("/gestao", nextUrl));
      }
    }

    if (userRole === "adm") {
      // Acessa admin, gestao, mas não a dashboard
      if (path.startsWith("/dashboard")) {
        return NextResponse.redirect(new URL("/admin", nextUrl));
      }
    }
  }

  return NextResponse.next();
};

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)"],
};