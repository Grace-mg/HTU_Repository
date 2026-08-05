import { NextResponse } from "next/server";

export async function POST() {
  const response = NextResponse.json({ success: true });

  // Expire all auth cookies
  response.cookies.set("auth-token", "", { maxAge: 0, path: "/" });
  response.cookies.set("user-role", "", { maxAge: 0, path: "/" });
  response.cookies.set("sb-access-token", "", { maxAge: 0, path: "/" });
  response.cookies.set("sb-refresh-token", "", { maxAge: 0, path: "/" });

  return response;
}
