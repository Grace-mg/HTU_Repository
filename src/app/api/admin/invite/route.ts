import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

export async function POST(req: NextRequest) {
  try {
    const { email, fullName } = await req.json();

    if (!email) {
      return NextResponse.json({ error: "Email address is required" }, { status: 400 });
    }

    const adminClient = createAdminClient();
    const origin = req.headers.get("origin") || "http://localhost:3000";

    const { data, error } = await adminClient.auth.admin.inviteUserByEmail(email, {
      redirectTo: `${origin}/auth/callback`,
      data: {
        full_name: fullName || email.split("@")[0],
        role: "ADMIN",
      },
    });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ success: true, user: data.user });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || "Failed to dispatch email invitation" }, { status: 500 });
  }
}
