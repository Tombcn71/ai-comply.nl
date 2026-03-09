import { auth } from "@/auth";
import { NextResponse } from "next/server";

export default auth((req) => {
  const protectedRoutes = [
    "/dashboard",
    "/api/tools",
    "/api/employees",
    "/api/dossier",
  ];

  const isProtectedRoute = protectedRoutes.some((route) =>
    req.nextUrl.pathname.startsWith(route)
  );

  if (isProtectedRoute && !req.auth) {
    const url = new URL("/login", req.nextUrl.origin);
    return NextResponse.redirect(url);
  }

  // Check if user has organization_id
  if (isProtectedRoute && req.auth && !req.auth.user?.organization_id) {
    const url = new URL("/login", req.nextUrl.origin);
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    "/((?!api/public|_next/static|_next/image|favicon.ico).*)",
  ],
};
