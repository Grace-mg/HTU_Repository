import * as React from "react";
import Link from "next/link";

function BrandLogoLarge() {
  return (
    <div className="flex items-center gap-3">
      {/* Abstract Blue/Orange Swirl Logo Icon — larger for footer */}
      <svg
        viewBox="0 0 36 36"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="h-14 w-14 flex-shrink-0"
      >
        <path
          d="M8.5 28.5C6.5 28.5 5 27 5 25C5 23 6.5 21.5 8.5 21.5C10.5 21.5 12 23 12 25C12 27 10.5 28.5 8.5 28.5Z"
          fill="#EAB308"
        />
        <path
          d="M10 25C12.5 32 20 35 27 30C34 25 33 13 25 7C17 1 9 10 16 18C21 24 28 24 23 31C19 36 12 32 10 25Z"
          fill="#3B82F6"
        />
      </svg>
      <span className="text-xl font-extrabold text-foreground leading-tight">
        Final Year<br />Repo
      </span>
    </div>
  );
}

export function PublicFooter() {
  return (
    <footer className="w-full border-t border-border bg-background py-12 text-sm text-muted-foreground">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-4 pb-10 border-b border-border">
          {/* Brand & Description */}
          <div className="space-y-4">
            <Link href="/">
              <BrandLogoLarge />
            </Link>
            <p className="text-xs text-muted-foreground leading-relaxed max-w-xs">
              Software builds, engineering prototypes, and fashion collections
              from this year&apos;s graduating class reviewed and approved by
              department heads, open for anyone to browse.
            </p>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Link href="/terms" className="hover:text-foreground transition-colors">
                Terms
              </Link>
              <span>|</span>
              <Link href="/privacy" className="hover:text-foreground transition-colors">
                Privacy
              </Link>
              <span>|</span>
              <Link href="/policy" className="hover:text-foreground transition-colors">
                Policy
              </Link>
            </div>
          </div>

          {/* Faculties */}
          <div className="space-y-3">
            <p className="font-semibold text-foreground text-base">
              Faculties
            </p>
            <ul className="space-y-2 text-xs">
              <li className="text-muted-foreground">
                Faculty listings will appear once data is connected.
              </li>
            </ul>
          </div>

          {/* Important Links */}
          <div className="space-y-3">
            <p className="font-semibold text-foreground text-base">
              Important Links
            </p>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/browse" className="hover:text-foreground transition-colors">
                  Browse Records
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-foreground transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-foreground transition-colors">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link href="/login" className="hover:text-foreground transition-colors">
                  User Login
                </Link>
              </li>
              <li>
                <Link href="/register" className="hover:text-foreground transition-colors">
                  Sign Up
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Details */}
          <div className="space-y-3">
            <p className="font-semibold text-foreground text-base">
              Contact Details
            </p>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Contact information will be displayed once the repository settings are configured.
            </p>
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-center gap-4">
          <p className="text-xs text-muted-foreground">
            ©{new Date().getFullYear()}, Final Year Project Repository
          </p>
        </div>
      </div>
    </footer>
  );
}
