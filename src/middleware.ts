import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Permettre les routes API d'auth
  if (pathname.startsWith("/api/auth")) {
    return NextResponse.next();
  }

  // Vérifier si c'est une route admin (sauf login)
  if (pathname.startsWith("/admin") && pathname !== "/admin/login") {
    // Vérifier le token de session NextAuth
    const token = request.cookies.get("authjs.session-token")?.value ||
                  request.cookies.get("__Secure-authjs.session-token")?.value;

    if (!token) {
      // Pas de token, rediriger vers login
      return NextResponse.redirect(new URL("/admin/login", request.url));
    }
  }

  // Si sur la page de login avec un token, rediriger vers dashboard
  if (pathname === "/admin/login") {
    const token = request.cookies.get("authjs.session-token")?.value ||
                  request.cookies.get("__Secure-authjs.session-token")?.value;

    if (token) {
      return NextResponse.redirect(new URL("/admin", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/admin/:path*",
    "/api/auth/:path*",
  ],
};
