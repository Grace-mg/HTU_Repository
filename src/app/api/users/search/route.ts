import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get("q")?.trim() || "";

    if (!query || query.length < 2) {
      return NextResponse.json({ users: [] });
    }

    const adminSupabase = createAdminClient();

    // 1. Fetch matching profiles from public.profiles
    const { data: profiles } = await adminSupabase
      .from("profiles")
      .select("id, full_name, email, role")
      .or(`full_name.ilike.%${query}%,email.ilike.%${query}%`)
      .limit(10);

    // 2. Fetch auth users as fallback/supplement
    const { data: authData } = await adminSupabase.auth.admin.listUsers();
    const authUsers = authData?.users || [];

    const resultsMap = new Map<string, { id: string; name: string; email: string; studentId?: string }>();

    // Process matching profiles
    if (profiles) {
      profiles.forEach((p) => {
        resultsMap.set(p.id, {
          id: p.id,
          name: p.full_name,
          email: p.email,
        });
      });
    }

    // Process matching auth users
    const lowerQuery = query.toLowerCase();
    authUsers.forEach((u) => {
      const emailMatch = u.email?.toLowerCase().includes(lowerQuery);
      const name = u.user_metadata?.full_name || u.email?.split("@")[0] || "Student User";
      const nameMatch = name.toLowerCase().includes(lowerQuery);
      const studentId = u.user_metadata?.student_id || u.user_metadata?.index_number;

      if ((emailMatch || nameMatch) && u.email) {
        const existing = resultsMap.get(u.id);
        resultsMap.set(u.id, {
          id: u.id,
          name: existing?.name || name,
          email: u.email,
          studentId: studentId || existing?.studentId,
        });
      }
    });

    const users = Array.from(resultsMap.values()).slice(0, 8);

    return NextResponse.json({ users });
  } catch (err: any) {
    console.error("[API GET /api/users/search Error]", err);
    return NextResponse.json({ users: [] });
  }
}
