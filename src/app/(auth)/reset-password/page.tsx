"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Lock, Eye, EyeOff, CheckCircle2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { resetPasswordSchema, ResetPasswordInput } from "@/lib/validation/auth";
import { SupabaseAuthService } from "@/services/supabase-auth-service";

const authService = new SupabaseAuthService();

export default function ResetPasswordPage() {
  const router = useRouter();

  const [formData, setFormData] = React.useState<ResetPasswordInput>({
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = React.useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = React.useState(false);
  const [errors, setErrors] = React.useState<Record<string, string>>({});
  const [authError, setAuthError] = React.useState<string | null>(null);
  const [isSuccess, setIsSuccess] = React.useState(false);
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    setAuthError(null);

    const result = resetPasswordSchema.safeParse(formData);

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
      await authService.resetPassword(formData);
      setIsSuccess(true);
    } catch (err: any) {
      setIsSubmitting(false);
      setAuthError(err.message || "Failed to reset password. The link may have expired.");
    }
  };

  return (
    <div className="space-y-6">
      <div className="space-y-1 text-center sm:text-left">
        <h1 className="text-xl font-bold tracking-tight text-foreground">Set New Password</h1>
        <p className="text-xs text-muted-foreground">
          Create a strong password for your repository account.
        </p>
      </div>

      {isSuccess ? (
        <div className="space-y-4">
          <div className="rounded-md border border-green-200 bg-green-50/80 p-4 text-xs text-green-900 flex items-start gap-3">
            <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
            <div className="space-y-1">
              <p className="font-semibold">Password Updated</p>
              <p className="leading-relaxed">
                Your password has been successfully reset. You can now sign in with your new credentials.
              </p>
            </div>
          </div>

          <Button
            asChild
            className="w-full h-9 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold"
          >
            <Link href="/login">Proceed to Sign In</Link>
          </Button>
        </div>
      ) : (
        <>
          {authError && (
            <div className="rounded-md border border-destructive/40 bg-destructive/10 p-3.5 text-xs text-destructive flex items-start gap-2.5">
              <AlertCircle className="h-4 w-4 flex-shrink-0 mt-0.5" />
              <div className="space-y-1">
                <p className="font-semibold">Reset Failed</p>
                <p className="leading-relaxed">{authError}</p>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            {/* New Password Field */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground block" htmlFor="password">
                New Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Min. 8 chars, 1 uppercase, 1 number"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
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

            {/* Confirm Password Field */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground block" htmlFor="confirmPassword">
                Confirm New Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Re-enter new password"
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
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
              className="w-full h-9 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Updating..." : "Reset Password"}
            </Button>
          </form>
        </>
      )}

      {/* Link back to Sign In */}
      <div className="border-t border-border pt-4 text-center text-xs text-muted-foreground">
        Remembered your password?{" "}
        <Link href="/login" className="font-semibold text-blue-600 hover:underline">
          Sign In
        </Link>
      </div>
    </div>
  );
}
