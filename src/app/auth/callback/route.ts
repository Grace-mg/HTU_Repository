import { NextResponse, type NextRequest } from "next/server";
import { sanitizeRedirectUrl } from "@/lib/auth/permissions";
import { createBrowserClient } from "@/lib/supabase/client";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const token_hash = requestUrl.searchParams.get("token_hash");
  const code = requestUrl.searchParams.get("code");
  const type = requestUrl.searchParams.get("type") || "email";
  const nextParam = requestUrl.searchParams.get("next");

  const supabase = createBrowserClient();

  let targetPath = nextParam || "/dashboard";

  if (type === "invite" || type === "recovery" || nextParam?.includes("accept-invite")) {
    targetPath = "/auth/accept-invite";
  }

  // 1. Verify via token_hash (from email link {{ .ConfirmationURL }})
  if (token_hash) {
    const { data, error } = await supabase.auth.verifyOtp({
      token_hash,
      type: type as any,
    });

    if (!error && data.session) {
      const user = data.session.user;
      const role = user.user_metadata?.role || "STUDENT";
      const name = user.user_metadata?.full_name || user.email?.split("@")[0] || "User";

      const safeRedirect = sanitizeRedirectUrl(role === "ADMIN" ? "/admin" : targetPath);
      const response = NextResponse.redirect(new URL(safeRedirect, request.url));

      response.cookies.set("auth-token", data.session.access_token, {
        path: "/",
        httpOnly: false,
        sameSite: "lax",
        maxAge: 60 * 60 * 24 * 7,
      });
      response.cookies.set("user-role", role, {
        path: "/",
        httpOnly: false,
        sameSite: "lax",
        maxAge: 60 * 60 * 24 * 7,
      });
      response.cookies.set("user-name", name, {
        path: "/",
        httpOnly: false,
        sameSite: "lax",
        maxAge: 60 * 60 * 24 * 7,
      });

      return response;
    }
  }

  // 2. Verify via authorization code (if PKCE used)
  if (code) {
    const { data, error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error && data?.session) {
      const user = data.session.user;
      const role = user.user_metadata?.role || "STUDENT";
      const name = user.user_metadata?.full_name || user.email?.split("@")[0] || "User";

      const safeRedirect = sanitizeRedirectUrl(role === "ADMIN" ? "/admin" : targetPath);
      const response = NextResponse.redirect(new URL(safeRedirect, request.url));

      response.cookies.set("auth-token", data.session.access_token, {
        path: "/",
        httpOnly: false,
        sameSite: "lax",
        maxAge: 60 * 60 * 24 * 7,
      });
      response.cookies.set("user-role", role, {
        path: "/",
        httpOnly: false,
        sameSite: "lax",
        maxAge: 60 * 60 * 24 * 7,
      });
      response.cookies.set("user-name", name, {
        path: "/",
        httpOnly: false,
        sameSite: "lax",
        maxAge: 60 * 60 * 24 * 7,
      });

      return response;
    }
  }

  // Fallback redirect if no tokens or error
  const safeRedirect = sanitizeRedirectUrl(targetPath);
  const redirectUrl = new URL(safeRedirect, request.url);
  if (code) redirectUrl.searchParams.set("code", code);
  if (type) redirectUrl.searchParams.set("type", type);

  return NextResponse.redirect(redirectUrl);
}
