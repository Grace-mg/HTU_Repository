import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    if (!id) {
      return NextResponse.json({ error: "Missing user ID" }, { status: 400 });
    }

    const adminSupabase = createAdminClient();

    // 1. Delete user bookmarks and records referenced by user
    await adminSupabase.from("user_bookmarks").delete().eq("user_id", id);
    await adminSupabase.from("profiles").delete().eq("id", id);

    // 2. Delete user from Supabase auth.users system table
    const { error: authError } = await adminSupabase.auth.admin.deleteUser(id);

    if (authError) {
      console.error("[API Delete User Auth Error]", authError);
    }

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error("[API Delete User Exception]", err);
    return NextResponse.json(
      { error: err.message || "Failed to delete user" },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const body = await request.json();
    const { is_suspended, role } = body;

    const adminSupabase = createAdminClient();

    const updateData: any = {};
    if (typeof is_suspended === "boolean") updateData.is_suspended = is_suspended;
    if (role) updateData.role = role;

    const { data } = await adminSupabase
      .from("profiles")
      .update(updateData)
      .eq("id", id)
      .select()
      .single();

    // If suspending, ban user in auth.users system table
    if (typeof is_suspended === "boolean") {
      await adminSupabase.auth.admin.updateUserById(id, {
        ban_duration: is_suspended ? "87600h" : "none",
      });
    }

    return NextResponse.json({ success: true, user: data });
  } catch (err: any) {
    console.error("[API Update User Exception]", err);
    return NextResponse.json(
      { error: err.message || "Failed to update user" },
      { status: 500 }
    );
  }
}
