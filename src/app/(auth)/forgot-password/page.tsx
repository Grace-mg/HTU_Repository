"use client";

import * as React from "react";
import Link from "next/link";
import { Mail, ArrowLeft, CheckCircle2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { forgotPasswordSchema } from "@/lib/validation/auth";
import { SupabaseAuthService } from "@/services/supabase-auth-service";

const authService = new SupabaseAuthService();

export default function ForgotPasswordPage() {
  const [email, setEmail] = React.useState("");
  const [error, setError] = React.useState<string | null>(null);
  const [submitted, setSubmitted] = React.useState(false);
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const result = forgotPasswordSchema.safeParse({ email });

    if (!result.success) {
      const issue = result.error.issues[0];
      setError(issue ? issue.message : "Invalid email address");
      return;
    }

    setIsSubmitting(true);
    try {
      await authService.forgotPassword({ email });
    } catch {
      // Intentionally swallow error per security spec (do not reveal if email exists)
    } finally {
      setIsSubmitting(false);
      setSubmitted(true);
    }
  };

  return (
    <div className="space-y-6">
      <div className="space-y-1 text-center sm:text-left">
        <h1 className="text-xl font-bold tracking-tight text-foreground">Forgot Password</h1>
        <p className="text-xs text-muted-foreground">
          Enter your registered email address to receive password recovery instructions.
        </p>
      </div>

      {submitted ? (
        <div className="space-y-4">
          <div className="rounded-md border border-blue-200 bg-blue-50/80 p-4 text-xs text-blue-900 flex items-start gap-3">
            <CheckCircle2 className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <div className="space-y-1">
              <p className="font-semibold">Reset Instructions Sent</p>
              <p className="leading-relaxed">
                If an account exists for <span className="font-semibold">{email}</span>, password reset instructions have been dispatched to that inbox.
              </p>
            </div>
          </div>

          <Button
            type="button"
            variant="outline"
            onClick={() => setSubmitted(false)}
            className="w-full h-9 text-xs"
          >
            Try another email address
          </Button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
          {/* Email Field */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-foreground block" htmlFor="email">
              Registered Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                id="email"
                type="email"
                placeholder="name@university.edu"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="pl-9 text-xs h-9"
              />
            </div>
            {error && <p className="text-[11px] font-medium text-destructive">{error}</p>}
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            className="w-full h-9 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Sending..." : "Send Reset Link"}
          </Button>
        </form>
      )}

      {/* Return to login link */}
      <div className="border-t border-border pt-4 text-center text-xs">
        <Link
          href="/login"
          className="inline-flex items-center gap-1.5 font-semibold text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-3.5 w-3.5" /> Back to Sign In
        </Link>
      </div>
    </div>
  );
}
