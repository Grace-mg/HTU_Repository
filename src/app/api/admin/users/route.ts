import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET() {
  try {
    const adminSupabase = createAdminClient();

    // 1. Fetch users directly from Supabase auth.users system table using Service Role key
    const { data: authData } = await adminSupabase.auth.admin.listUsers();

    // 2. Fetch profiles from public.profiles table
    const { data: profilesData } = await adminSupabase
      .from("profiles")
      .select("*");

    const userMap = new Map<string, any>();

    // Add profiles
    if (profilesData) {
      profilesData.forEach((p) => {
        userMap.set(p.id, {
          id: p.id,
          email: p.email || "N/A",
          full_name: p.full_name || p.name || (p.email ? p.email.split("@")[0] : "User"),
          role: p.role || "USER",
          created_at: p.created_at,
          is_suspended: p.is_suspended || false,
          last_sign_in_at: null,
        });
      });
    }

    // Merge auth users
    if (authData && authData.users) {
      authData.users.forEach((u) => {
        const existing = userMap.get(u.id);
        userMap.set(u.id, {
          id: u.id,
          email: u.email || existing?.email || "N/A",
          full_name: existing?.full_name || u.user_metadata?.full_name || u.user_metadata?.name || (u.email ? u.email.split("@")[0] : "User"),
          role: existing?.role || u.user_metadata?.role || "USER",
          created_at: u.created_at || existing?.created_at,
          is_suspended: existing?.is_suspended || false,
          last_sign_in_at: u.last_sign_in_at || existing?.last_sign_in_at,
        });
      });
    }

    const mergedUsers = Array.from(userMap.values());

    return NextResponse.json(
      { users: mergedUsers },
      {
        headers: {
          "Cache-Control": "no-store, no-cache, must-revalidate, max-age=0",
        },
      }
    );
  } catch (err: any) {
    console.error("[API Get Users Error]", err);
    return NextResponse.json(
      { error: err.message || "Failed to fetch users" },
      { status: 500 }
    );
  }
}
