"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { X, GraduationCap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

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

  React.useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [open]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 lg:hidden">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Panel */}
      <div className="fixed inset-y-0 left-0 z-50 w-72 bg-background border-r border-border p-6 shadow-xl flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between border-b border-border pb-4 mb-4">
            <Link
              href="/"
              className="flex items-center gap-2 text-base font-bold tracking-tight text-foreground"
              onClick={onClose}
            >
              <img
                src="/Repository Assets/LOGO-REPO.png"
                alt="Final Year Repo Logo"
                className="h-6 w-auto object-contain flex-shrink-0"
              />
              <span>{title}</span>
            </Link>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="h-8 w-8"
              aria-label="Close menu"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

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

        <div className="border-t border-border pt-4 text-xs text-muted-foreground text-center">
          <p>© {new Date().getFullYear()} PROJECT-HUB</p>
          <p className="text-[10px] mt-0.5">Academic Thesis & Project Repository</p>
        </div>
      </div>
    </div>
  );
}
