"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { X, User, Shield, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";
import { SupabaseAuthService } from "@/services/supabase-auth-service";
import { User as AuthUser } from "@/types/auth";
import { cn } from "@/lib/utils";

const authService = new SupabaseAuthService();

export interface NavLinkItem {
  label: string;
  href: string;
  icon?: React.ElementType;
}

export interface MobileNavDrawerProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  links: NavLinkItem[];
}

export function MobileNavDrawer({
  open,
  onClose,
  title = "PROJECT-HUB",
  links,
}: MobileNavDrawerProps) {
  const pathname = usePathname();
  const [currentUser, setCurrentUser] = React.useState<AuthUser | null>(null);

  React.useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
      async function loadUser() {
        const u = await authService.getCurrentUser();
        setCurrentUser(u);
      }
      loadUser();
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [open]);

  const handleLogout = async () => {
    try {
      await authService.logout();
    } catch (err) {
      console.error("[Logout Error]", err);
    } finally {
      onClose();
      window.location.href = "/login";
    }
  };

  if (!open) return null;

  const displayName = currentUser?.name || currentUser?.email.split("@")[0] || "Student User";

  return (
    <div className="fixed inset-0 z-50 lg:hidden">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Panel */}
      <div className="fixed inset-y-0 left-0 z-50 w-80 max-w-[85vw] bg-background border-r border-border p-5 shadow-xl flex flex-col justify-between overflow-y-auto">
        <div className="space-y-4">
          {/* Drawer Top Header */}
          <div className="flex items-center justify-between border-b border-border pb-4">
            <Link
              href="/"
              className="flex items-center gap-2 text-base font-bold tracking-tight text-foreground"
              onClick={onClose}
            >
              <img
                src="/Repository Assets/LOGO-REPO.png"
                alt="Project HUB Logo"
                className="h-6 w-auto object-contain flex-shrink-0"
              />
              <span className="truncate">{title}</span>
            </Link>

            <div className="flex items-center gap-1">
              <ThemeToggle />
              <Button
                variant="ghost"
                size="icon"
                onClick={onClose}
                className="h-8 w-8 rounded-full"
                aria-label="Close menu"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="flex flex-col space-y-1">
            {links.map((link) => {
              const Icon = link.icon;
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={onClose}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md transition-colors",
                    isActive
                      ? "bg-primary text-primary-foreground font-semibold"
                      : "text-muted-foreground hover:bg-accent hover:text-foreground"
                  )}
                >
                  {Icon && <Icon className="h-4 w-4" />}
                  <span>{link.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Profile Session Component at Bottom of Navbar Drawer */}
        <div className="border-t border-border pt-4 mt-6 space-y-3">
          {currentUser ? (
            <div className="rounded-xl border border-border bg-card p-3.5 space-y-3 shadow-sm">
              <Link
                href={currentUser.role === "ADMIN" ? "/admin/profile" : "/dashboard/profile"}
                onClick={onClose}
                className="flex items-center gap-3 hover:opacity-80 transition-opacity cursor-pointer"
                title="View profile settings"
              >
                <div className="h-9 w-9 rounded-full bg-blue-600 text-white font-bold flex items-center justify-center text-xs shrink-0 shadow-sm">
                  {displayName[0]?.toUpperCase()}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-bold text-foreground truncate hover:text-blue-600 transition-colors">
                    {displayName}
                  </p>
                  <p className="text-[11px] text-muted-foreground truncate">{currentUser.email}</p>
                  <span className="inline-block text-[9px] font-bold text-blue-600 uppercase tracking-wider mt-0.5">
                    {currentUser.role} Account
                  </span>
                </div>
              </Link>

              <Button
                type="button"
                variant="destructive"
                size="sm"
                onClick={handleLogout}
                className="w-full h-8 text-[11px] font-semibold gap-1.5 justify-center"
              >
                <LogOut className="h-3.5 w-3.5" />
                Sign Out
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-2">
              <Link
                href="/login"
                onClick={onClose}
                className="flex items-center justify-center px-3 py-2 text-xs font-semibold border border-border rounded-md hover:bg-accent text-foreground text-center"
              >
                Sign In
              </Link>
              <Link
                href="/register"
                onClick={onClose}
                className="flex items-center justify-center px-3 py-2 text-xs font-semibold bg-blue-600 text-white rounded-md hover:bg-blue-700 text-center"
              >
                Create Account
              </Link>
            </div>
          )}

          <div className="text-center text-[10px] text-muted-foreground pt-1">
            <p>© {new Date().getFullYear()} PROJECT-HUB • HTU Repository</p>
          </div>
        </div>
      </div>
    </div>
  );
}
