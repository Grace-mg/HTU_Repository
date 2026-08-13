import { NextResponse, type NextRequest } from "next/server";
import { sanitizeRedirectUrl, getHomeRouteForRole } from "@/lib/auth/permissions";

/**
 * Main Next.js Route Protection Middleware
 */
export async function middleware(request: NextRequest) {
  const { pathname, searchParams } = request.nextUrl;

  // Read auth cookie
  const authToken = request.cookies.get("sb-access-token")?.value || request.cookies.get("auth-token")?.value;
  const userRole = request.cookies.get("user-role")?.value as "ADMIN" | "USER" | undefined;
  const isAuthenticated = Boolean(authToken);

  // 1. Protected Admin Routes (/admin/*)
  if (pathname.startsWith("/admin")) {
    if (!isAuthenticated) {
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("redirectTo", sanitizeRedirectUrl(pathname + (request.nextUrl.search || "")));
      return NextResponse.redirect(loginUrl);
    }

    if (userRole !== "ADMIN") {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
  }

  // 2. Protected User Dashboard Routes (/dashboard/*)
  if (pathname.startsWith("/dashboard")) {
    if (!isAuthenticated) {
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("redirectTo", sanitizeRedirectUrl(pathname + (request.nextUrl.search || "")));
      return NextResponse.redirect(loginUrl);
    }
  }

  // 3. Guest-Only Auth Routes (/login, /register)
  if (pathname === "/login" || pathname === "/register") {
    if (isAuthenticated) {
      const redirectToParam = searchParams.get("redirectTo");
      const targetPath = redirectToParam
        ? sanitizeRedirectUrl(redirectToParam)
        : getHomeRouteForRole(userRole);
      return NextResponse.redirect(new URL(targetPath, request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/admin/:path*",
    "/dashboard/:path*",
    "/login",
    "/register",
  ],
};
