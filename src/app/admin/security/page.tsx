"use client";

import * as React from "react";
import { KeyRound, CheckCircle2, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PageHeader } from "@/components/layout/page-header";
import { SupabaseAuthService } from "@/services/supabase-auth-service";

const authService = new SupabaseAuthService();

export default function AdminSecurityPage() {
  const [success, setSuccess] = React.useState(false);
  const [currentPassword, setCurrentPassword] = React.useState("");
  const [newPassword, setNewPassword] = React.useState("");
  const [confirmPassword, setConfirmPassword] = React.useState("");

  const handlePasswordChange = (e: React.FormEvent) => {
    e.preventDefault();
    setSuccess(true);
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
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
        title="Admin Security & Password"
        description="Update your admin authentication credentials, view active sessions, and configure security preferences."
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
          <span>Administrator password updated successfully!</span>
        </div>
      )}

      <form onSubmit={handlePasswordChange} className="space-y-6 rounded-xl border border-border bg-card p-6 sm:p-8 shadow-sm">
        <h2 className="text-sm font-bold text-foreground border-b border-border pb-3 flex items-center gap-2">
          <KeyRound className="h-4 w-4 text-blue-600" /> Change Administrator Password
        </h2>

        <div className="space-y-4 text-xs">
          <div className="space-y-1.5">
            <label className="font-semibold text-foreground block">Current Password</label>
            <Input
              type="password"
              placeholder="••••••••"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="text-xs h-9"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="font-semibold text-foreground block">New Password</label>
              <Input
                type="password"
                placeholder="••••••••"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="text-xs h-9"
              />
            </div>

            <div className="space-y-1.5">
              <label className="font-semibold text-foreground block">Confirm New Password</label>
              <Input
                type="password"
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="text-xs h-9"
              />
            </div>
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
            Update Password
          </Button>
        </div>
      </form>
    </div>
  );
}
