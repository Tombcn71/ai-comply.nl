import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function proxy(request: NextRequest) {
  const protectedRoutes = [
    "/dashboard",
    "/api/tools",
    "/api/employees",
    "/api/dossier",
  ];

  const isProtectedRoute = protectedRoutes.some((route) =>
    request.nextUrl.pathname.startsWith(route)
  );

  if (isProtectedRoute) {
    // Check for auth cookie or session
    const authCookie = request.cookies.get("better-auth.session_token");
    
    if (!authCookie) {
      return NextResponse.redirect(new URL("/login", request.nextUrl.origin));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!api/public|_next/static|_next/image|favicon.ico).*)",
  ],
};
