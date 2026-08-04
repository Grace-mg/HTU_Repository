import * as React from "react";
import Link from "next/link";

function BrandLogoLarge() {
  return (
    <div className="flex items-center gap-3">
      <img
        src="/Repository Assets/LOGO-REPO.png"
        alt="Final Year Repo Logo"
        className="h-14 w-auto object-contain flex-shrink-0"
      />
      <div className="flex flex-col text-xl font-extrabold text-foreground leading-tight">
        <span>Final Year</span>
        <span>Repo</span>
      </div>
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
              <li>
                <Link href="/browse?faculty=fast" className="hover:text-foreground transition-colors">
                  Faculty of Applied Sciences and Technology
                </Link>
              </li>
              <li>
                <Link href="/browse?faculty=hbs" className="hover:text-foreground transition-colors">
                  HTU Business School
                </Link>
              </li>
              <li>
                <Link href="/browse?faculty=eng" className="hover:text-foreground transition-colors">
                  Faculty of Engineering
                </Link>
              </li>
              <li>
                <Link href="/browse?faculty=art" className="hover:text-foreground transition-colors">
                  Faculty of Art and Design
                </Link>
              </li>
              <li>
                <Link href="/browse?faculty=bne" className="hover:text-foreground transition-colors">
                  Faculty of Built and Natural Environment
                </Link>
              </li>
              <li>
                <Link href="/browse?faculty=fass" className="hover:text-foreground transition-colors">
                  Faculty of Applied Social Sciences
                </Link>
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
                <Link href="/browse" className="underline hover:text-foreground transition-colors">
                  Ho Technical University Academic Departments
                </Link>
              </li>
              <li>
                <Link href="/browse" className="hover:text-foreground transition-colors">
                  Browse Records
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
