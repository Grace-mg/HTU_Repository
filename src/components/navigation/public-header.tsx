"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { MobileNavDrawer, NavLinkItem } from "@/components/navigation/mobile-nav-drawer";
import { cn } from "@/lib/utils";

const PUBLIC_NAV_LINKS: NavLinkItem[] = [
  { label: "Home", href: "/" },
  { label: "Browse", href: "/browse" },
  { label: "About", href: "/about" },
  { label: "Contact Us", href: "/contact" },
];

function BrandLogo() {
  return (
    <div className="flex items-center gap-2.5">
      <img
        src="/Repository Assets/LOGO-REPO.png"
        alt="Final Year Repo Logo"
        className="h-9 w-auto object-contain flex-shrink-0"
      />
      {/* Brand Text */}
      <div className="flex flex-col text-left leading-tight font-extrabold text-foreground text-sm tracking-tight">
        <span>Final Year</span>
        <span>Repo</span>
      </div>
    </div>
  );
}

export function PublicHeader() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = React.useState(false);

  return (
    <>
      <header className="sticky top-0 z-40 w-full border-b border-border/40 bg-background/95 backdrop-blur-sm">
        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          {/* Brand */}
          <Link href="/" className="flex items-center gap-2 hover:opacity-90 transition-opacity">
            <BrandLogo />
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center space-x-8">
            {PUBLIC_NAV_LINKS.map((link) => {
              const isActive =
                link.href === "/"
                  ? pathname === "/"
                  : pathname.startsWith(link.href);

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "text-sm font-semibold transition-colors hover:text-blue-600",
                    isActive
                      ? "text-blue-600 font-bold"
                      : "text-foreground/80"
                  )}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* Right Action Button (Sign Up) */}
          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center">
              <Link
                href="/register"
                className="inline-flex items-center justify-center rounded-md border-2 border-blue-600 px-6 py-2 text-sm font-semibold text-blue-600 transition-colors hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2"
              >
                Sign Up
              </Link>
            </div>

            {/* Mobile Menu Toggle */}
            <Button
              variant="outline"
              size="icon"
              className="md:hidden h-9 w-9"
              onClick={() => setMobileOpen(true)}
              aria-label="Open menu"
            >
              <Menu className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </header>

      {/* Mobile Drawer */}
      <MobileNavDrawer
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
        title="Final Year Repo"
        links={[
          ...PUBLIC_NAV_LINKS,
          { label: "Log in", href: "/login" },
          { label: "Sign Up", href: "/register" },
        ]}
      />
    </>
  );
}
