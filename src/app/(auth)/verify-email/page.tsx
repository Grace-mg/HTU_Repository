"use client";

import * as React from "react";
import Link from "next/link";
import { Mail, CheckCircle2, ArrowRight, RefreshCw, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function VerifyEmailPage() {
  const [isResending, setIsResending] = React.useState(false);
  const [resendNotice, setResendNotice] = React.useState<string | null>(null);

  const handleResend = () => {
    setIsResending(true);
    setResendNotice(null);

    setTimeout(() => {
      setIsResending(false);
      setResendNotice(
        "Verification email trigger requested. Backend Auth parameters will transmit live verification tokens when configured."
      );
    }, 600);
  };

  return (
    <div className="space-y-6 text-center">
      {/* Icon badge */}
      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-blue-50 text-blue-600 border border-blue-200">
        <Mail className="h-6 w-6" />
      </div>

      <div className="space-y-1">
        <h1 className="text-xl font-bold tracking-tight text-foreground">Verify Your Email</h1>
        <p className="text-xs text-muted-foreground max-w-sm mx-auto">
          We&apos;ve sent a verification link to your institutional email address. Please click the link to confirm your account.
        </p>
      </div>

      {resendNotice && (
        <div className="rounded-md border border-blue-200 bg-blue-50/80 p-3.5 text-xs text-blue-900 flex items-start gap-2.5 text-left">
          <AlertCircle className="h-4 w-4 text-blue-600 flex-shrink-0 mt-0.5" />
          <div className="space-y-0.5">
            <p className="font-semibold">Verification System Notice</p>
            <p className="leading-relaxed">{resendNotice}</p>
          </div>
        </div>
      )}

      {/* Primary Actions */}
      <div className="space-y-3 pt-2">
        <Button
          type="button"
          onClick={handleResend}
          disabled={isResending}
          variant="outline"
          className="w-full h-9 text-xs font-semibold gap-2 border-border"
        >
          <RefreshCw className={`h-3.5 w-3.5 ${isResending ? "animate-spin" : ""}`} />
          {isResending ? "Sending link..." : "Resend Verification Email"}
        </Button>

        <Button
          asChild
          className="w-full h-9 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold gap-2"
        >
          <Link href="/login">
            Proceed to Sign In
          </Link>
        </Button>
      </div>

      {/* Support footer */}
      <div className="border-t border-border pt-4 text-xs text-muted-foreground">
        Need help? Contact the repository administrator at{" "}
        <a href="mailto:support@htu.edu.gh" className="text-blue-600 hover:underline">
          support@htu.edu.gh
        </a>
      </div>
    </div>
  );
}
