import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const { email, password, fullName, accessToken, code } = await req.json();

    if (!password) {
      return NextResponse.json({ error: "Password is required" }, { status: 400 });
    }

    const adminClient = createAdminClient();

    // 1. If access_token or code was passed, attempt session resolution or user lookup
    let targetUser: any = null;

    if (accessToken) {
      const { data: userData } = await adminClient.auth.getUser(accessToken);
      if (userData?.user) {
        targetUser = userData.user;
      }
    }

    if (!targetUser && email) {
      const { data: usersData, error: listError } = await adminClient.auth.admin.listUsers();
      if (!listError && usersData?.users) {
        const found = usersData.users.find(
          (u) => u.email?.toLowerCase() === email.trim().toLowerCase()
        );
        if (found) {
          targetUser = found;
        }
      }
    }

    if (!targetUser) {
      return NextResponse.json(
        { error: "Could not locate invited administrator account. Please check the invitation email link." },
        { status: 404 }
      );
    }

    // 2. Update user's password and metadata using Admin Service Role API
    const finalName = fullName || targetUser.user_metadata?.full_name || email?.split("@")[0] || "Admin";
    const { data: updateData, error: updateError } = await adminClient.auth.admin.updateUserById(
      targetUser.id,
      {
        password,
        email_confirm: true,
        user_metadata: {
          ...targetUser.user_metadata,
          full_name: finalName,
          role: "ADMIN",
        },
      }
    );

    if (updateError) {
      return NextResponse.json({ error: updateError.message }, { status: 400 });
    }

    return NextResponse.json({
      success: true,
      user: {
        id: updateData.user.id,
        email: updateData.user.email,
        name: finalName,
        role: "ADMIN",
      },
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: err?.message || "Failed to update administrator credentials" },
      { status: 500 }
    );
  }
}
