import { auth } from "@/auth";

export default auth((req) => {
  // Protected routes check
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
    return Response.redirect(url);
  }
});

export const config = {
  matcher: [
    "/((?!api/public|_next/static|_next/image|favicon.ico).*)",
  ],
};
