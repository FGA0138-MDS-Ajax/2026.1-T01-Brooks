import { auth } from "@/auth";
import { NextResponse } from "next/server";
import { NextRequest } from "next/server";

const PUBLIC_ROUTES = ["/", "/login", "/register", "/forgot-password"];

export default async function proxy(req: NextRequest) {
  const session = await auth()

  const isLoggedIn = !!session;
  const userRole = session?.user?.perfil; // "gestorru" | "aluno" | "adm"

  const { nextUrl } = req;
  const path = nextUrl.pathname;

  const isApiAuthRoute = path.startsWith("/api/auth");
  const isPublicRoute = PUBLIC_ROUTES.includes(path);

  if (isApiAuthRoute) return NextResponse.next();

  if (!isLoggedIn && !isPublicRoute) {
    return NextResponse.redirect(new URL("/login", nextUrl));
  }

  if (isLoggedIn && ["/login", "/register", "/forgot-password", "/dashboard"].includes(path)) {
    if (userRole === "gestorru") return NextResponse.redirect(new URL("/gestao", nextUrl));
    if (userRole === "adm") return NextResponse.redirect(new URL("/admin", nextUrl));

    return NextResponse.redirect(new URL("/", nextUrl));
  }

  if (isLoggedIn) {

    if (userRole === "aluno" && !path.startsWith("/dashboard")) {
      return NextResponse.redirect(new URL("/dashboard", nextUrl));
    }

    if (userRole === "gestorru" && !path.startsWith("/gestao")) {
      return NextResponse.redirect(new URL("/gestao", nextUrl));
    }

    if (userRole === "adm" && !path.startsWith("/admin") && !path.startsWith("/gestao")) {
      return NextResponse.redirect(new URL("/admin", nextUrl));
    }
  }

  return NextResponse.next();
};

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)"],
};