"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Mail, Lock, Eye, EyeOff, AlertCircle, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { loginSchema, LoginInput } from "@/lib/validation/auth";
import { SupabaseAuthService } from "@/services/supabase-auth-service";
import { sanitizeRedirectUrl, getHomeRouteForRole } from "@/lib/auth/permissions";

const authService = new SupabaseAuthService();

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("redirectTo");

  const [formData, setFormData] = React.useState<LoginInput>({
    email: "",
    password: "",
  });
  const [rememberMe, setRememberMe] = React.useState(false);
  const [showPassword, setShowPassword] = React.useState(false);
  const [errors, setErrors] = React.useState<Record<string, string>>({});
  const [authError, setAuthError] = React.useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    setAuthError(null);

    const result = loginSchema.safeParse(formData);

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
      const session = await authService.login(formData);

      // Set auth cookies for middleware route protection
      document.cookie = `auth-token=${session.accessToken}; path=/; SameSite=Lax`;
      document.cookie = `user-role=${session.user.role}; path=/; SameSite=Lax`;

      const targetPath = redirectTo
        ? sanitizeRedirectUrl(redirectTo)
        : getHomeRouteForRole(session.user.role);

      router.push(targetPath);
    } catch (err: any) {
      setIsSubmitting(false);
      setAuthError(err.message || "Failed to sign in. Please verify your credentials.");
    }
  };

  return (
    <div className="space-y-6">
      <div className="space-y-1 text-center sm:text-left">
        <h1 className="text-xl font-bold tracking-tight text-foreground">Sign In</h1>
        <p className="text-xs text-muted-foreground">
          Enter your email address and password to access your account.
        </p>
      </div>

      {authError && (
        <div className="rounded-md border border-destructive/40 bg-destructive/10 p-3.5 text-xs text-destructive flex items-start gap-2.5">
          <AlertCircle className="h-4 w-4 flex-shrink-0 mt-0.5" />
          <div className="space-y-1">
            <p className="font-semibold">Authentication Error</p>
            <p className="leading-relaxed">{authError}</p>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4" noValidate>
        {/* Email Field */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-foreground block" htmlFor="email">
            Email Address
          </label>
          <div className="relative">
            <Mail className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              id="email"
              type="email"
              placeholder="name@university.edu"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="pl-9 text-xs h-9"
            />
          </div>
          {errors.email && (
            <p className="text-[11px] font-medium text-destructive">{errors.email}</p>
          )}
        </div>

        {/* Password Field */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label className="text-xs font-semibold text-foreground block" htmlFor="password">
              Password
            </label>
            <Link
              href="/forgot-password"
              className="text-xs text-blue-600 hover:underline font-medium"
            >
              Forgot password?
            </Link>
          </div>
          <div className="relative">
            <Lock className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
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

        {/* Remember Me Checkbox */}
        <div className="flex items-center space-x-2 pt-1">
          <Checkbox
            id="remember"
            checked={rememberMe}
            onCheckedChange={(checked) => setRememberMe(!!checked)}
          />
          <label
            htmlFor="remember"
            className="text-xs font-medium leading-none text-muted-foreground cursor-pointer select-none"
          >
            Remember me on this device
          </label>
        </div>

        {/* Submit Button */}
        <Button
          type="submit"
          className="w-full h-9 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Signing in..." : "Sign In"}
        </Button>
      </form>

      {/* Footer Registration Link */}
      <div className="border-t border-border pt-4 text-center text-xs text-muted-foreground">
        Don&apos;t have an account yet?{" "}
        <Link href="/register" className="font-semibold text-blue-600 hover:underline">
          Create an Account
        </Link>
      </div>
    </div>
  );
}
