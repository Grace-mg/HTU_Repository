import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    if (!id) {
      return NextResponse.json({ error: "Missing department ID" }, { status: 400 });
    }

    const adminSupabase = createAdminClient();

    // First delete any repository records referenced by this department to avoid FK constraint blocks
    await adminSupabase
      .from("repository_records")
      .delete()
      .eq("department_id", id);

    // Now delete the department row itself
    const { error } = await adminSupabase
      .from("departments")
      .delete()
      .eq("id", id);

    if (error) {
      console.error("[API Delete Department Error]", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error("[API Delete Department Exception]", err);
    return NextResponse.json(
      { error: err.message || "Failed to delete department" },
      { status: 500 }
    );
  }
}
