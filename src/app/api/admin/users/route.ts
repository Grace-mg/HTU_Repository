import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

export async function GET() {
  try {
    const adminSupabase = createAdminClient();

    // 1. Fetch users directly from Supabase auth.users system table using Service Role key
    const { data: authData, error: authError } = await adminSupabase.auth.admin.listUsers();

    // 2. Fetch profiles from public.profiles table
    const { data: profilesData } = await adminSupabase
      .from("profiles")
      .select("*");

    const profilesMap = new Map<string, any>();
    if (profilesData) {
      profilesData.forEach((p) => profilesMap.set(p.id, p));
    }

    if (authError || !authData || !authData.users) {
      return NextResponse.json({ users: profilesData || [] });
    }

    const mergedUsers = authData.users.map((u) => {
      const profile = profilesMap.get(u.id);
      return {
        id: u.id,
        email: u.email || profile?.email || "N/A",
        full_name: profile?.full_name || u.user_metadata?.full_name || u.email?.split("@")[0] || "User",
        role: profile?.role || u.user_metadata?.role || "USER",
        created_at: u.created_at || profile?.created_at,
        last_sign_in_at: u.last_sign_in_at,
      };
    });

    return NextResponse.json({ users: mergedUsers });
  } catch (err: any) {
    console.error("[API Get Users Error]", err);
    return NextResponse.json(
      { error: err.message || "Failed to fetch users" },
      { status: 500 }
    );
  }
}
