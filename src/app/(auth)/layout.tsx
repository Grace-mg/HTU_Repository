import * as React from "react";
import Link from "next/link";
import { GraduationCap } from "lucide-react";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-muted/20 px-4 py-12">
      <div className="w-full max-w-md space-y-6">
        {/* Brand header */}
        <div className="flex flex-col items-center text-center space-y-2">
          <Link
            href="/"
            className="flex items-center gap-2 text-xl font-bold tracking-tight text-foreground"
          >
            <img
              src="/Repository Assets/LOGO-REPO.png"
              alt="Final Year Repo Logo"
              className="h-10 w-auto object-contain flex-shrink-0"
            />
            <span>PROJECT-HUB</span>
          </Link>
          <p className="text-xs text-muted-foreground">
            University Project and Thesis Repository System
          </p>
        </div>

        {/* Auth form container panel */}
        <div className="rounded-lg border border-border bg-background p-6 shadow-sm sm:p-8">
          {children}
        </div>

        {/* Footer info */}
        <div className="text-center text-xs text-muted-foreground space-y-1">
          <Link href="/" className="hover:underline hover:text-foreground">
            ← Return to Public Repository
          </Link>
        </div>
      </div>
    </div>
  );
}
