"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Lock, Eye, EyeOff, Shield, LogOut, CheckCircle2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PageHeader } from "@/components/layout/page-header";
import { passwordChangeSchema, PasswordChangeInput } from "@/lib/validation/user";
import { SupabaseAuthService } from "@/services/supabase-auth-service";

const authService = new SupabaseAuthService();

export default function SecurityPage() {
  const router = useRouter();

  const [formData, setFormData] = React.useState<PasswordChangeInput>({
    currentPassword: "",
    newPassword: "",
    confirmNewPassword: "",
  });

  const [showCurrent, setShowCurrent] = React.useState(false);
  const [showNew, setShowNew] = React.useState(false);
  const [showConfirm, setShowConfirm] = React.useState(false);

  const [errors, setErrors] = React.useState<Record<string, string>>({});
  const [successMessage, setSuccessMessage] = React.useState<string | null>(null);
  const [authError, setAuthError] = React.useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    setSuccessMessage(null);
    setAuthError(null);

    const result = passwordChangeSchema.safeParse(formData);

    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.issues.forEach((issue) => {
        if (issue.path[0]) {
          fieldErrors[issue.path[0].toString()] = issue.message;
        }
      });
      setErrors(fieldErrors);
      return;
    }

    setIsSubmitting(true);
    try {
      await authService.resetPassword({
        password: formData.newPassword,
        confirmPassword: formData.confirmNewPassword,
      });
      setIsSubmitting(false);
      setSuccessMessage("Your password has been updated successfully.");
      setFormData({ currentPassword: "", newPassword: "", confirmNewPassword: "" });
    } catch (err: any) {
      setIsSubmitting(false);
      setAuthError(err.message || "Failed to update password. Please check your current password.");
    }
  };

  const handleLogout = async () => {
    await authService.logout();
    document.cookie = "auth-token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
    document.cookie = "user-role=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
    router.push("/login");
  };

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <PageHeader
        title="Security & Password"
        description="Manage your password, account credentials, and active session settings."
      />

      {successMessage && (
        <div className="rounded-md border border-green-200 bg-green-50/80 p-3.5 text-xs text-green-900 flex items-center gap-2.5">
          <CheckCircle2 className="h-4 w-4 text-green-600 flex-shrink-0" />
          <span>{successMessage}</span>
        </div>
      )}

      {authError && (
        <div className="rounded-md border border-destructive/40 bg-destructive/10 p-3.5 text-xs text-destructive flex items-center gap-2.5">
          <AlertCircle className="h-4 w-4 flex-shrink-0" />
          <span>{authError}</span>
        </div>
      )}

      {/* Change Password Form */}
      <form onSubmit={handleSubmit} className="space-y-6 rounded-xl border border-border bg-card p-6 sm:p-8 shadow-sm">
        <h2 className="text-sm font-bold text-foreground border-b border-border pb-3 flex items-center gap-2">
          <Shield className="h-4 w-4 text-blue-600" /> Change Account Password
        </h2>

        {/* Current Password */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-foreground block" htmlFor="currentPassword">
            Current Password
          </label>
          <div className="relative">
            <Lock className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              id="currentPassword"
              type={showCurrent ? "text" : "password"}
              placeholder="Enter current password"
              value={formData.currentPassword}
              onChange={(e) => setFormData({ ...formData, currentPassword: e.target.value })}
              className="pl-9 pr-9 text-xs h-9"
            />
            <button
              type="button"
              onClick={() => setShowCurrent(!showCurrent)}
              className="absolute right-3 top-2.5 text-muted-foreground hover:text-foreground"
              aria-label="Toggle password visibility"
            >
              {showCurrent ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
          {errors.currentPassword && (
            <p className="text-[11px] font-medium text-destructive">{errors.currentPassword}</p>
          )}
        </div>

        {/* New Password */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-foreground block" htmlFor="newPassword">
            New Password
          </label>
          <div className="relative">
            <Lock className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              id="newPassword"
              type={showNew ? "text" : "password"}
              placeholder="Min. 8 chars, 1 uppercase, 1 number"
              value={formData.newPassword}
              onChange={(e) => setFormData({ ...formData, newPassword: e.target.value })}
              className="pl-9 pr-9 text-xs h-9"
            />
            <button
              type="button"
              onClick={() => setShowNew(!showNew)}
              className="absolute right-3 top-2.5 text-muted-foreground hover:text-foreground"
              aria-label="Toggle new password visibility"
            >
              {showNew ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
          {errors.newPassword && (
            <p className="text-[11px] font-medium text-destructive">{errors.newPassword}</p>
          )}
        </div>

        {/* Confirm New Password */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-foreground block" htmlFor="confirmNewPassword">
            Confirm New Password
          </label>
          <div className="relative">
            <Lock className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              id="confirmNewPassword"
              type={showConfirm ? "text" : "password"}
              placeholder="Re-enter new password"
              value={formData.confirmNewPassword}
              onChange={(e) => setFormData({ ...formData, confirmNewPassword: e.target.value })}
              className="pl-9 pr-9 text-xs h-9"
            />
            <button
              type="button"
              onClick={() => setShowConfirm(!showConfirm)}
              className="absolute right-3 top-2.5 text-muted-foreground hover:text-foreground"
              aria-label="Toggle confirm password visibility"
            >
              {showConfirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
          {errors.confirmNewPassword && (
            <p className="text-[11px] font-medium text-destructive">{errors.confirmNewPassword}</p>
          )}
        </div>

        {/* Submit Button */}
        <div className="pt-4 border-t border-border flex justify-end">
          <Button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold h-9 px-6"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Updating..." : "Update Password"}
          </Button>
        </div>
      </form>

      {/* Session Management & Logout Panel */}
      <div className="rounded-xl border border-destructive/20 bg-card p-6 sm:p-8 space-y-4">
        <h2 className="text-sm font-bold text-foreground flex items-center gap-2">
          <LogOut className="h-4 w-4 text-destructive" /> Active Session Actions
        </h2>
        <p className="text-xs text-muted-foreground leading-relaxed">
          Sign out of your active repository session on this browser.
        </p>

        <Button
          type="button"
          variant="destructive"
          onClick={handleLogout}
          className="text-xs font-semibold h-9 gap-2"
        >
          <LogOut className="h-4 w-4" /> Sign Out of Account
        </Button>
      </div>
    </div>
  );
}
