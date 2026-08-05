import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, code, facultyId, hodName, hodEmail, isActive } = body;

    if (!name || !code || !facultyId) {
      return NextResponse.json(
        { error: "Department Name, Code, and Faculty are required." },
        { status: 400 }
      );
    }

    const adminSupabase = createAdminClient();

    const rowData = {
      id: code.toLowerCase(),
      name,
      code,
      faculty_id: facultyId,
      hod_name: hodName || null,
      hod_email: hodEmail || null,
      is_active: isActive !== false,
    };

    const { data, error } = await adminSupabase
      .from("departments")
      .upsert(rowData, { onConflict: "id" })
      .select("*, faculties(name)")
      .single();

    if (error) {
      console.error("[API Create Department Error]", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, department: data });
  } catch (err: any) {
    console.error("[API Create Department Exception]", err);
    return NextResponse.json(
      { error: err.message || "Failed to create department" },
      { status: 500 }
    );
  }
}
