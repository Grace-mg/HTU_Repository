import { NextResponse, type NextRequest } from "next/server";

/**
 * Middleware session refresher placeholder boundary.
 */
export async function updateSession(request: NextRequest) {
  return NextResponse.next({
    request: {
      headers: request.headers,
    },
  });
}
