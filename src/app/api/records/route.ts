import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { createRepositoryRecordSchema } from "@/lib/validation/repository";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const result = createRepositoryRecordSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { error: "Validation failed", details: result.error.format() },
        { status: 400 }
      );
    }

    const input = result.data;
    const adminSupabase = createAdminClient();

    const slug = input.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "") + "-" + Date.now();
    const status = input.status || "PENDING_HOD";

    // Ensure foreign key references exist in Database
    if (input.facultyId) {
      await adminSupabase.from("faculties").upsert({
        id: input.facultyId,
        name: input.facultyId.toUpperCase(),
        code: input.facultyId.toUpperCase(),
      }, { onConflict: "id" });
    }

    if (input.departmentId) {
      await adminSupabase.from("departments").upsert({
        id: input.departmentId,
        faculty_id: input.facultyId || "fast",
        name: input.departmentId.toUpperCase(),
        code: input.departmentId.toUpperCase(),
      }, { onConflict: "id" });
    }

    if (input.categoryId) {
      await adminSupabase.from("categories").upsert({
        id: input.categoryId,
        name: input.categoryId.toUpperCase(),
        slug: input.categoryId.toLowerCase(),
      }, { onConflict: "id" });
    }

    const rowData: any = {
      title: input.title,
      slug,
      record_type: input.recordType,
      status,
      abstract: input.abstract,
      student_name: input.studentName,
      student_id: input.studentId || null,
      group_members: input.groupMembers || [],
      supervisor_name: input.supervisorName,
      academic_year: input.academicYear || new Date().getFullYear(),
      faculty_id: input.facultyId || null,
      department_id: input.departmentId || null,
      category_id: input.categoryId || null,
      keywords: input.keywords || [],
      file_url: input.fileUrl || null,
      file_name: input.fileName || null,
      file_size: input.fileSize || null,
      mime_type: input.mimeType || null,
    };

    if (input.status === "PUBLISHED") {
      rowData.published_at = new Date().toISOString();
    }

    let { data, error } = await adminSupabase
      .from("repository_records")
      .insert(rowData)
      .select("*, faculties(name), departments(name), categories(name)")
      .single();

    if (error && error.message?.includes("group_members")) {
      delete rowData.group_members;
      const retry = await adminSupabase
        .from("repository_records")
        .insert(rowData)
        .select("*, faculties(name), departments(name), categories(name)")
        .single();
      data = retry.data;
      error = retry.error;
    }

    if (error) {
      console.error("[API Create Record Error]", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, record: data });
  } catch (err: any) {
    console.error("[API Create Record Server Error]", err);
    return NextResponse.json({ error: err.message || "Internal Server Error" }, { status: 500 });
  }
}
