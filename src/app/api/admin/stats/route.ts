import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

export async function GET() {
  try {
    const adminSupabase = createAdminClient();

    const { count: totalRecords } = await adminSupabase
      .from("repository_records")
      .select("*", { count: "exact", head: true });

    const { count: pendingApprovals } = await adminSupabase
      .from("repository_records")
      .select("*", { count: "exact", head: true })
      .in("status", ["PENDING_HOD", "PENDING_DEAN"]);

    const { count: totalUsers } = await adminSupabase
      .from("profiles")
      .select("*", { count: "exact", head: true });

    const { data: viewsData } = await adminSupabase
      .from("repository_records")
      .select("views_count");

    const totalViews = viewsData ? viewsData.reduce((acc, curr) => acc + (curr.views_count || 0), 0) : 0;

    return NextResponse.json({
      success: true,
      stats: {
        totalRecords: totalRecords || 0,
        pendingApprovals: pendingApprovals || 0,
        totalUsers: totalUsers || 0,
        totalViews: totalViews || 0,
      },
    });
  } catch (err: any) {
    console.error("[API GET Stats Error]", err);
    return NextResponse.json({ error: err.message || "Internal Server Error" }, { status: 500 });
  }
}
