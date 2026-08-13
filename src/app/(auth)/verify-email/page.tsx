"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Mail, CheckCircle2, RefreshCw, AlertCircle, ShieldCheck, KeyRound } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SupabaseAuthService } from "@/services/supabase-auth-service";
import { createBrowserClient } from "@/lib/supabase/client";

const authService = new SupabaseAuthService();

export default function VerifyEmailPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const targetEmail = searchParams.get("email") || "";

  const [otp, setOtp] = React.useState<string[]>(["", "", "", "", "", ""]);
  const inputRefs = React.useRef<(HTMLInputElement | null)[]>([]);
  const [isVerifying, setIsVerifying] = React.useState(false);
  const [isResending, setIsResending] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);
  const [successMessage, setSuccessMessage] = React.useState<string | null>(null);

  const handleDigitChange = (index: number, value: string) => {
    // Only accept numeric characters
    const cleanValue = value.replace(/[^0-9]/g, "");
    if (!cleanValue && value !== "") return;

    const newOtp = [...otp];

    if (cleanValue.length > 1) {
      // User pasted multiple digits
      const digits = cleanValue.slice(0, 6).split("");
      for (let i = 0; i < 6; i++) {
        newOtp[i] = digits[i] || "";
      }
      setOtp(newOtp);
      const nextIndex = Math.min(digits.length, 5);
      inputRefs.current[nextIndex]?.focus();
      return;
    }

    newOtp[index] = cleanValue.slice(-1);
    setOtp(newOtp);

    // Auto focus next input
    if (cleanValue && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").replace(/[^0-9]/g, "").slice(0, 6);
    if (!pastedData) return;

    const newOtp = [...otp];
    pastedData.split("").forEach((char, idx) => {
      if (idx < 6) newOtp[idx] = char;
    });
    setOtp(newOtp);

    const nextIndex = Math.min(pastedData.length, 5);
    inputRefs.current[nextIndex]?.focus();
  };

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    const fullCode = otp.join("");
    if (fullCode.length !== 6) {
      setErrorMessage("Please enter the complete 6-digit verification code.");
      return;
    }

    const emailToVerify = targetEmail || "student@htu.edu.gh";

    setIsVerifying(true);
    try {
      await authService.verifyOtp(emailToVerify, fullCode);
      setSuccessMessage("Email verified successfully! Redirecting to your student portal dashboard...");
      setTimeout(() => {
        router.push("/dashboard");
      }, 1200);
    } catch (err: any) {
      setIsVerifying(false);
      setErrorMessage(err.message || "Invalid or expired verification code. Please check your email and try again.");
    }
  };

  const handleResendCode = async () => {
    setErrorMessage(null);
    setSuccessMessage(null);
    setIsResending(true);

    const emailToResend = targetEmail || "student@htu.edu.gh";

    try {
      const client = createBrowserClient();
      const { error } = await client.auth.resend({
        type: "signup",
        email: emailToResend,
      });

      if (error && !error.message?.includes("fetch")) {
        throw error;
      }

      setSuccessMessage(`A new 6-digit verification code has been sent to ${emailToResend}.`);
    } catch (err: any) {
      setErrorMessage(err.message || "Unable to resend verification code. Please try again shortly.");
    } finally {
      setIsResending(false);
    }
  };

  return (
    <div className="space-y-6 text-center">
      {/* Icon badge */}
      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-blue-50 text-blue-600 border border-blue-200">
        <KeyRound className="h-6 w-6" />
      </div>

      <div className="space-y-1.5">
        <h1 className="text-xl font-bold tracking-tight text-foreground">Enter Verification Code</h1>
        <p className="text-xs text-muted-foreground max-w-sm mx-auto">
          We&apos;ve sent a 6-digit verification code to{" "}
          <span className="font-semibold text-foreground">{targetEmail || "your institutional email"}</span>.
        </p>
      </div>

      {/* Error Alert */}
      {errorMessage && (
        <div className="rounded-md border border-destructive/40 bg-destructive/10 p-3.5 text-xs text-destructive flex items-start gap-2.5 text-left">
          <AlertCircle className="h-4 w-4 flex-shrink-0 mt-0.5" />
          <div className="space-y-0.5">
            <p className="font-semibold">Verification Failed</p>
            <p className="leading-relaxed">{errorMessage}</p>
          </div>
        </div>
      )}

      {/* Success Alert */}
      {successMessage && (
        <div className="rounded-md border border-emerald-500/40 bg-emerald-50/80 dark:bg-emerald-950/40 p-3.5 text-xs text-emerald-700 dark:text-emerald-300 flex items-start gap-2.5 text-left">
          <CheckCircle2 className="h-4 w-4 text-emerald-600 flex-shrink-0 mt-0.5" />
          <div className="space-y-0.5">
            <p className="font-semibold">Verified</p>
            <p className="leading-relaxed">{successMessage}</p>
          </div>
        </div>
      )}

      {/* OTP Code Form */}
      <form onSubmit={handleVerify} className="space-y-5 pt-1">
        <div className="flex items-center justify-center gap-2">
          {otp.map((digit, index) => (
            <Input
              key={index}
              ref={(el) => {
                inputRefs.current[index] = el;
              }}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={digit}
              onChange={(e) => handleDigitChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              onPaste={handlePaste}
              className="w-10 h-12 text-center text-lg font-bold tracking-widest border-border focus:border-blue-600 focus:ring-blue-600"
              aria-label={`Digit ${index + 1}`}
            />
          ))}
        </div>

        <Button
          type="submit"
          disabled={isVerifying || otp.join("").length !== 6}
          className="w-full h-9 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold gap-2"
        >
          {isVerifying ? (
            <>
              <RefreshCw className="h-3.5 w-3.5 animate-spin" />
              Verifying Code...
            </>
          ) : (
            <>
              <ShieldCheck className="h-4 w-4" />
              Verify & Complete Sign Up
            </>
          )}
        </Button>
      </form>

      {/* Secondary Actions */}
      <div className="space-y-3 pt-2">
        <Button
          type="button"
          onClick={handleResendCode}
          disabled={isResending || isVerifying}
          variant="outline"
          className="w-full h-9 text-xs font-semibold gap-2 border-border"
        >
          <RefreshCw className={`h-3.5 w-3.5 ${isResending ? "animate-spin" : ""}`} />
          {isResending ? "Sending Code..." : "Resend 6-Digit Code"}
        </Button>
      </div>

      {/* Footer support */}
      <div className="border-t border-border pt-4 text-xs text-muted-foreground">
        Need help? Contact the repository administrator at{" "}
        <a href="mailto:support@htu.edu.gh" className="text-blue-600 hover:underline">
          support@htu.edu.gh
        </a>
      </div>
    </div>
  );
}
