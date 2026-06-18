import { auth } from "@/auth";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const PUBLIC_ROUTES = ["/", "/login", "/register", "/forgot-password"];

const AUTH_ROUTES = ["/login", "/register", "/forgot-password"];

export default auth((req: NextRequest & { auth: any }) => {
  const session = req.auth;

  const isLoggedIn = !!session;
  const userRole = session?.user?.perfil; // "gestorru" | "aluno" | "adm"

  const { nextUrl } = req;
  const path = nextUrl.pathname;

  const isApiAuthRoute = path.startsWith("/api/auth");
  const isAuthRoute = AUTH_ROUTES.includes(path);
  const isPublicRoute = PUBLIC_ROUTES.includes(path);

  if (isApiAuthRoute) return NextResponse.next();

  if (!isLoggedIn && !isPublicRoute) {
    return NextResponse.redirect(new URL("/login", nextUrl));
  }

  if (isLoggedIn) {
    if (isAuthRoute || path === "/") {
      if (userRole === "aluno") return NextResponse.redirect(new URL("/dashboard", nextUrl));
      if (userRole === "gestorru") return NextResponse.redirect(new URL("/gestao", nextUrl));
      if (userRole === "adm") return NextResponse.redirect(new URL("/admin", nextUrl));

      return NextResponse.redirect(new URL("/", nextUrl));

    }

    if (!userRole) {
      return NextResponse.redirect(new URL("/login", nextUrl));
    }

    if (userRole === "aluno" && !path.startsWith("/dashboard")) {
      return NextResponse.redirect(new URL("/dashboard", nextUrl));
    }

    if (userRole === "gestorru" && !path.startsWith("/gestao")) {
      return NextResponse.redirect(new URL("/gestao", nextUrl));
    }

    if (userRole === "adm" && !path.startsWith("/admin")) {
      return NextResponse.redirect(new URL("/admin", nextUrl));
    }

  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)"],
};