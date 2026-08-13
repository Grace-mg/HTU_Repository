"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, Sun, Moon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { MobileNavDrawer, NavLinkItem } from "@/components/navigation/mobile-nav-drawer";
import { cn } from "@/lib/utils";
import { applyTheme } from "@/lib/theme";

export const PUBLIC_NAV_LINKS: NavLinkItem[] = [
  { label: "Home", href: "/" },
  { label: "Browse", href: "/browse" },
  { label: "About", href: "/about" },
  { label: "Contact Us", href: "/contact" },
];

function BrandLogo() {
  return (
    <div className="flex items-center gap-2">
      <img
        src="/Repository Assets/LOGO-REPO.png"
        alt="Project HUB Logo"
        className="h-8 sm:h-9 w-auto object-contain flex-shrink-0"
      />
      <span className="text-base sm:text-lg font-bold tracking-tight text-foreground">
        PROJECT-HUB
      </span>
    </div>
  );
}

function HeaderThemeToggle() {
  const [theme, setTheme] = React.useState<"light" | "dark" | "system">("system");

  React.useEffect(() => {
    const savedTheme = (localStorage.getItem("theme") as "light" | "dark" | "system") || "system";
    setTheme(savedTheme);
    applyTheme(savedTheme);
  }, []);

  const handleToggleTheme = () => {
    const nextTheme: "light" | "dark" | "system" =
      theme === "light" ? "dark" : theme === "dark" ? "system" : "light";
    setTheme(nextTheme);
    localStorage.setItem("theme", nextTheme);
    applyTheme(nextTheme);
  };

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={handleToggleTheme}
      className="h-9 w-9 rounded-full cursor-pointer hover:bg-accent transition-colors"
      title={`Current theme: ${theme}. Click to switch theme.`}
    >
      <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0 text-foreground" />
      <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100 text-foreground" />
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
}

export function PublicHeader() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = React.useState(false);

  return (
    <>
      <header className="sticky top-0 z-40 w-full border-b border-border/40 bg-background/95 backdrop-blur-md transition-all pt-[env(safe-area-inset-top,0px)]">
        <div className="mx-auto flex h-16 sm:h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          {/* Brand */}
          <Link href="/" className="flex items-center gap-2 hover:opacity-90 transition-opacity">
            <BrandLogo />
          </Link>

          {/* Desktop Navigation Links with Expanded Margins & Display Font */}
          <nav className="hidden md:flex items-center space-x-12 lg:space-x-16">
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
                    "text-xs font-bold tracking-widest uppercase transition-all duration-200 hover:text-blue-600 hover:scale-105",
                    isActive
                      ? "text-blue-600 font-extrabold"
                      : "text-foreground/75"
                  )}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* Right Action Area (Sign In, Sign Up & Theme Toggle) */}
          <div className="flex items-center gap-3">
            <HeaderThemeToggle />

            <div className="hidden sm:flex items-center gap-3">
              <Link
                href="/login"
                className="text-xs font-bold tracking-wider uppercase text-foreground/80 hover:text-blue-600 transition-colors px-3 py-2"
              >
                Sign In
              </Link>
              <Link
                href="/register"
                className="inline-flex items-center justify-center rounded-full border-2 border-blue-600 px-6 py-2 text-xs font-bold tracking-wider uppercase text-blue-600 transition-all duration-200 hover:bg-blue-600 hover:text-white focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2"
              >
                Sign Up
              </Link>
            </div>

            {/* Mobile Menu Toggle */}
            <Button
              variant="outline"
              size="icon"
              className="md:hidden h-8 w-8"
              onClick={() => setMobileOpen(true)}
              aria-label="Open menu"
            >
              <Menu className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </header>

      {/* Mobile Drawer */}
      <MobileNavDrawer
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
        title="Project HUB"
        links={[
          ...PUBLIC_NAV_LINKS,
          { label: "Log in", href: "/login" },
          { label: "Sign Up", href: "/register" },
        ]}
      />
    </>
  );
}


