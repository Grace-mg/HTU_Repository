"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { ShieldCheck, Mail, Lock, Eye, EyeOff, AlertCircle, CheckCircle2, User as UserIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SupabaseAuthService } from "@/services/supabase-auth-service";

const authService = new SupabaseAuthService();

export default function AcceptInvitePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const emailParam = searchParams.get("email") || "";
  const nameParam = searchParams.get("name") || "";

  const [fullName, setFullName] = React.useState(nameParam || "");
  const [password, setPassword] = React.useState("");
  const [confirmPassword, setConfirmPassword] = React.useState("");
  const [showPassword, setShowPassword] = React.useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = React.useState(false);

  const [errors, setErrors] = React.useState<Record<string, string>>({});
  const [serverError, setServerError] = React.useState<string | null>(null);
  const [successMessage, setSuccessMessage] = React.useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    setServerError(null);
    setSuccessMessage(null);

    const fieldErrors: Record<string, string> = {};
    if (!fullName.trim()) {
      fieldErrors.fullName = "Full name is required";
    }
    if (password.length < 8) {
      fieldErrors.password = "Password must be at least 8 characters";
    } else if (!/[A-Z]/.test(password) || !/[0-9]/.test(password)) {
      fieldErrors.password = "Password must contain at least 1 uppercase letter and 1 number";
    }
    if (password !== confirmPassword) {
      fieldErrors.confirmPassword = "Passwords do not match";
    }

    if (Object.keys(fieldErrors).length > 0) {
      setErrors(fieldErrors);
      return;
    }

    setIsSubmitting(true);
    try {
      await authService.acceptAdminInvite(password, fullName, emailParam);
      setSuccessMessage("Admin Account Configured! Redirecting to your Admin Control Panel...");
      setTimeout(() => {
        router.push("/admin");
      }, 1200);
    } catch (err: any) {
      setIsSubmitting(false);
      setServerError(err.message || "Failed to set up administrator account. Please try again.");
    }
  };

  return (
    <div className="space-y-6">
      {/* Header section */}
      <div className="space-y-2 text-center sm:text-left">
        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20 text-xs font-semibold">
          <ShieldCheck className="h-3.5 w-3.5" />
          Administrator Account Setup
        </div>
        <h1 className="text-xl font-bold tracking-tight text-foreground">Create Admin Password</h1>
        <p className="text-xs text-muted-foreground">
          You have been invited to manage the HTU Institutional Repository. Complete your profile and set your security credentials to access the Admin Dashboard.
        </p>
      </div>

      {/* Server Error Alert */}
      {serverError && (
        <div className="rounded-md border border-destructive/40 bg-destructive/10 p-3.5 text-xs text-destructive flex items-start gap-2.5">
          <AlertCircle className="h-4 w-4 flex-shrink-0 mt-0.5" />
          <div className="space-y-0.5">
            <p className="font-semibold">Setup Notice</p>
            <p className="leading-relaxed">{serverError}</p>
          </div>
        </div>
      )}

      {/* Success Alert */}
      {successMessage && (
        <div className="rounded-md border border-emerald-500/40 bg-emerald-50/80 dark:bg-emerald-950/40 p-3.5 text-xs text-emerald-700 dark:text-emerald-300 flex items-start gap-2.5">
          <CheckCircle2 className="h-4 w-4 text-emerald-600 flex-shrink-0 mt-0.5" />
          <div className="space-y-0.5">
            <p className="font-semibold">Account Verified</p>
            <p className="leading-relaxed">{successMessage}</p>
          </div>
        </div>
      )}

      {/* Account Setup Form */}
      <form onSubmit={handleSubmit} className="space-y-4" noValidate>
        {/* Email Address (Prefilled/Disabled) */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-foreground block">
            Invited Email Address
          </label>
          <div className="relative">
            <Mail className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="email"
              readOnly
              value={emailParam || "admin.candidate@htu.edu.gh"}
              className="pl-9 text-xs h-9 bg-muted/50 cursor-not-allowed opacity-80"
            />
          </div>
        </div>

        {/* Full Name */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-foreground block" htmlFor="fullName">
            Administrator Full Name
          </label>
          <div className="relative">
            <UserIcon className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              id="fullName"
              type="text"
              placeholder="Dr. Seth Mensah"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="pl-9 text-xs h-9"
            />
          </div>
          {errors.fullName && (
            <p className="text-[11px] font-medium text-destructive">{errors.fullName}</p>
          )}
        </div>

        {/* Password */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-foreground block" htmlFor="password">
            Admin Password
          </label>
          <div className="relative">
            <Lock className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="Min 8 chars, 1 uppercase, 1 number"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="pl-9 pr-9 text-xs h-9"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-2.5 text-muted-foreground hover:text-foreground"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
          {errors.password && (
            <p className="text-[11px] font-medium text-destructive">{errors.password}</p>
          )}
        </div>

        {/* Confirm Password */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-foreground block" htmlFor="confirmPassword">
            Confirm Password
          </label>
          <div className="relative">
            <Lock className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              id="confirmPassword"
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Re-enter password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="pl-9 pr-9 text-xs h-9"
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-2.5 text-muted-foreground hover:text-foreground"
              aria-label={showConfirmPassword ? "Hide confirm password" : "Show confirm password"}
            >
              {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
          {errors.confirmPassword && (
            <p className="text-[11px] font-medium text-destructive">{errors.confirmPassword}</p>
          )}
        </div>

        {/* Submit Button */}
        <Button
          type="submit"
          disabled={isSubmitting}
          className="w-full h-9 bg-purple-600 hover:bg-purple-700 text-white text-xs font-semibold gap-2 mt-2"
        >
          <ShieldCheck className="h-4 w-4" />
          {isSubmitting ? "Configuring Admin Account..." : "Create Admin Account & Enter Control Panel"}
        </Button>
      </form>

      {/* Footer link */}
      <div className="border-t border-border pt-4 text-center text-xs text-muted-foreground">
        Already have an account?{" "}
        <Link href="/login" className="font-semibold text-purple-600 hover:underline">
          Sign In
        </Link>
      </div>
    </div>
  );
}
