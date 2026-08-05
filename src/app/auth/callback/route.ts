import { NextResponse, type NextRequest } from "next/server";
import { sanitizeRedirectUrl } from "@/lib/auth/permissions";

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");
  const next = requestUrl.searchParams.get("next") || "/dashboard";

  const safeRedirect = sanitizeRedirectUrl(next);

  if (code) {
    // When Supabase SSR is connected in Phase 19, exchangeCodeForSession(code) runs here
  }

  // Redirect user to their target landing page
  return NextResponse.redirect(new URL(safeRedirect, request.url));
}
