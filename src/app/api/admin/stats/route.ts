import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const adminSupabase = createAdminClient();

    const { count: totalRecords } = await adminSupabase
      .from("repository_records")
      .select("id", { count: "exact" });

    const { count: pendingApprovals } = await adminSupabase
      .from("repository_records")
      .select("id", { count: "exact" })
      .in("status", ["PENDING_HOD", "PENDING_DEAN", "PENDING_REVIEW", "PENDING", "SUBMITTED", "DRAFT"]);

    // Count total unique users combining auth.users and public.profiles
    const userIds = new Set<string>();
    try {
      const { data: authData } = await adminSupabase.auth.admin.listUsers();
      if (authData && authData.users) {
        authData.users.forEach((u) => userIds.add(u.id));
      }
    } catch {}

    try {
      const { data: profilesData } = await adminSupabase.from("profiles").select("id");
      if (profilesData) {
        profilesData.forEach((p) => userIds.add(p.id));
      }
    } catch {}

    const { data: viewsData } = await adminSupabase
      .from("repository_records")
      .select("views_count");

    const totalViews = viewsData ? viewsData.reduce((acc, curr) => acc + (curr.views_count || 0), 0) : 0;

    return NextResponse.json({
      success: true,
      stats: {
        totalRecords: totalRecords || 0,
        pendingApprovals: pendingApprovals || 0,
        totalUsers: userIds.size,
        totalViews: totalViews || 0,
      },
    });
  } catch (err: any) {
    console.error("[API GET Stats Error]", err);
    return NextResponse.json({ error: err.message || "Internal Server Error" }, { status: 500 });
  }
}
