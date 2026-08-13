"use client";

import * as React from "react";
import { User, Mail, Shield, CheckCircle2, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PageHeader } from "@/components/layout/page-header";
import { Badge } from "@/components/ui/badge";
import { SupabaseAuthService } from "@/services/supabase-auth-service";

const authService = new SupabaseAuthService();

export default function AdminProfilePage() {
  const [success, setSuccess] = React.useState(false);
  const [profile, setProfile] = React.useState({
    fullName: "System Administrator",
    email: "wonderdogbe595@gmail.com",
    role: "ADMIN",
    registeredAt: "2026-08-01",
  });

  React.useEffect(() => {
    async function loadCurrentUser() {
      const u = await authService.getCurrentUser();
      if (u) {
        setProfile({
          fullName: u.name || "System Administrator",
          email: u.email || "wonderdogbe595@gmail.com",
          role: u.role || "ADMIN",
          registeredAt: u.createdAt ? new Date(u.createdAt).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" }) : "2026-08-01",
        });
      }
    }
    loadCurrentUser();
  }, []);

  const handleUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    setSuccess(true);
    setTimeout(() => setSuccess(false), 3000);
  };

  const handleLogout = async () => {
    try {
      await authService.logout();
    } catch (err) {
      console.error("[Logout Error]", err);
    } finally {
      window.location.href = "/login";
    }
  };

  return (
    <div className="w-full space-y-6">
      {/* Header Card with Log Out Button inside Card */}
      <PageHeader
        title="Admin Profile Settings"
        description="Manage your administrator account credentials, profile details, and system session."
        actions={
          <Button
            type="button"
            variant="destructive"
            onClick={handleLogout}
            className="text-xs font-semibold h-9 px-4 gap-1.5 shrink-0"
          >
            <LogOut className="h-4 w-4" /> Log Out
          </Button>
        }
      />

      {success && (
        <div className="rounded-md border border-green-200 bg-green-50/80 p-3.5 text-xs text-green-900 flex items-center gap-2.5">
          <CheckCircle2 className="h-4 w-4 text-green-600 flex-shrink-0" />
          <span>Admin profile updated successfully!</span>
        </div>
      )}

      <form onSubmit={handleUpdate} className="space-y-6 rounded-xl border border-border bg-card p-6 sm:p-8 shadow-sm">
        <div className="flex items-center gap-4 border-b border-border pb-5">
          <div className="h-14 w-14 rounded-full bg-blue-600 text-white font-bold flex items-center justify-center text-xl shrink-0">
            {profile.fullName[0]?.toUpperCase() || "A"}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-foreground">{profile.fullName}</h2>
              <Badge className="bg-purple-600 text-white text-[10px]">ADMIN</Badge>
            </div>
            <p className="text-xs text-muted-foreground mt-0.5">{profile.email}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div className="space-y-1.5">
            <label className="font-semibold text-foreground block">Full Name</label>
            <Input
              value={profile.fullName}
              onChange={(e) => setProfile({ ...profile, fullName: e.target.value })}
              className="text-xs h-9"
            />
          </div>

          <div className="space-y-1.5">
            <label className="font-semibold text-foreground block">Email Address</label>
            <Input value={profile.email} disabled className="text-xs h-9 bg-muted/50" />
          </div>
        </div>

        <div className="pt-4 border-t border-border flex items-center justify-between gap-4">
          <Button
            type="button"
            variant="outline"
            onClick={handleLogout}
            className="text-xs font-semibold text-destructive hover:bg-destructive/10 border-destructive/30 h-9 px-4 gap-1.5"
          >
            <LogOut className="h-4 w-4" /> Sign Out of Admin Panel
          </Button>

          <Button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold h-9 px-6">
            Update Profile
          </Button>
        </div>
      </form>
    </div>
  );
}
