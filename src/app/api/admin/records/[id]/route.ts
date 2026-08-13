import { NextResponse, NextRequest } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    if (!id) {
      return NextResponse.json({ error: "Record ID is required." }, { status: 400 });
    }

    const adminSupabase = createAdminClient();
    const { data, error } = await adminSupabase
      .from("repository_records")
      .select("*, faculties(name), departments(name), categories(name)")
      .eq("id", id)
      .single();

    if (error || !data) {
      return NextResponse.json({ error: "Record not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, record: data });
  } catch (err: any) {
    console.error("[API GET Record Error]", err);
    return NextResponse.json({ error: err.message || "Internal Server Error" }, { status: 500 });
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const body = await request.json();
    const { status } = body;

    if (!id || !status) {
      return NextResponse.json(
        { error: "Record ID and status are required." },
        { status: 400 }
      );
    }

    const adminSupabase = createAdminClient();
    const updateData: any = { status };
    if (status === "PUBLISHED") {
      updateData.published_at = new Date().toISOString();
    }

    let notifiedEmails: string[] = [];
    if (status === "REJECTED") {
      const { data: rec } = await adminSupabase
        .from("repository_records")
        .select("student_name, group_members")
        .eq("id", id)
        .single();

      if (rec && Array.isArray(rec.group_members)) {
        notifiedEmails = rec.group_members
          .map((m: any) => m.email)
          .filter((e: string) => Boolean(e) && e.includes("@"));
      }

      console.log(`[API Rejection Notice] Sending rejection email notifications to group members:`, notifiedEmails);
    }

    const { error } = await adminSupabase
      .from("repository_records")
      .update(updateData)
      .eq("id", id);

    if (error) {
      console.error("[API PATCH Record Error]", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, notifiedEmails });
  } catch (err: any) {
    console.error("[API PATCH Record Server Error]", err);
    return NextResponse.json({ error: err.message || "Internal Server Error" }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    if (!id) {
      return NextResponse.json({ error: "Record ID is required." }, { status: 400 });
    }

    const adminSupabase = createAdminClient();
    const { error } = await adminSupabase
      .from("repository_records")
      .delete()
      .eq("id", id);

    if (error) {
      console.error("[API DELETE Record Error]", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error("[API DELETE Record Server Error]", err);
    return NextResponse.json({ error: err.message || "Internal Server Error" }, { status: 500 });
  }
}
