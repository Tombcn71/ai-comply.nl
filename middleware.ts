import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(request: NextRequest) {
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
    const token = await getToken({
      req: request,
      secret: process.env.NEXTAUTH_SECRET,
    });

    if (!token) {
      const url = new URL("/login", request.nextUrl.origin);
      return NextResponse.redirect(url);
    }

    // Check if user has organization_id
    if (!token.organization_id) {
      const url = new URL("/login", request.nextUrl.origin);
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!api/public|_next/static|_next/image|favicon.ico).*)",
  ],
};
