"use client";

import * as React from "react";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AccountMenu } from "@/components/navigation/account-menu";
import { MobileNavDrawer } from "@/components/navigation/mobile-nav-drawer";
import { USER_NAV_ITEMS, ADMIN_NAV_ITEMS } from "@/components/navigation/dashboard-sidebar";

import { ThemeToggle } from "@/components/theme-toggle";

export interface DashboardTopbarProps {
  mode: "user" | "admin";
  userEmail?: string;
}

export function DashboardTopbar({ mode, userEmail }: DashboardTopbarProps) {
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const items = mode === "admin" ? ADMIN_NAV_ITEMS : USER_NAV_ITEMS;

  return (
    <>
      <header className="sticky top-0 z-30 flex w-full flex-col border-b border-border bg-background/95 backdrop-blur-sm pt-[env(safe-area-inset-top,0px)]">
        <div className="flex h-14 w-full items-center justify-between px-4">
        {/* Left: Mobile menu toggle button */}
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="icon"
            className="lg:hidden h-8 w-8"
            onClick={() => setMobileOpen(true)}
            aria-label="Open sidebar menu"
          >
            <Menu className="h-4 w-4" />
          </Button>

          <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            {mode === "admin" ? "Admin Control Panel" : "Student Dashboard"}
          </span>
        </div>

        {/* Right: Theme Toggle on Mobile, Full Account Menu on Desktop */}
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="sm:hidden flex items-center">
            <ThemeToggle />
          </div>

          <div className="hidden sm:flex items-center">
            <AccountMenu userEmail={userEmail} userRole={mode} />
          </div>
        </div>
      </div>
      </header>

      {/* Mobile drawer */}
      <MobileNavDrawer
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
        title={mode === "admin" ? "PROJECT-HUB Admin" : "PROJECT-HUB"}
        links={items}
      />
    </>
  );
}
