import { NextResponse, NextRequest } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const pendingOnly = searchParams.get("pending") === "true";

    const adminSupabase = createAdminClient();
    let query = adminSupabase
      .from("repository_records")
      .select("*, faculties(name), departments(name), categories(name)")
      .order("created_at", { ascending: false });

    if (pendingOnly) {
      query = query.in("status", ["PENDING_HOD", "PENDING_DEAN", "PENDING", "SUBMITTED", "DRAFT"]);
    }

    const { data, error } = await query;

    if (error) {
      console.error("[API GET Records Error]", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, records: data || [] });
  } catch (err: any) {
    console.error("[API GET Records Server Error]", err);
    return NextResponse.json({ error: err.message || "Internal Server Error" }, { status: 500 });
  }
}

export async function DELETE() {
  try {
    const adminSupabase = createAdminClient();
    const { error } = await adminSupabase
      .from("repository_records")
      .delete()
      .neq("id", "");

    if (error) {
      console.error("[API DELETE All Records Error]", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, message: "All records cleared" });
  } catch (err: any) {
    console.error("[API DELETE All Records Server Error]", err);
    return NextResponse.json({ error: err.message || "Internal Server Error" }, { status: 500 });
  }
}
