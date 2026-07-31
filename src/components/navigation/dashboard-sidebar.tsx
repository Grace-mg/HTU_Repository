"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  FolderKanban,
  BookOpen,
  Bookmark,
  User,
  Shield,
  FilePlus,
  Building2,
  Building,
  Tags,
  Users,
  BarChart3,
  Settings,
  History,
  GraduationCap,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { NavLinkItem } from "@/components/navigation/mobile-nav-drawer";

export const USER_NAV_ITEMS: NavLinkItem[] = [
  { label: "Overview", href: "/dashboard", icon: LayoutDashboard },
  { label: "Browse Projects", href: "/dashboard/projects", icon: FolderKanban },
  { label: "Browse Theses", href: "/dashboard/theses", icon: BookOpen },
  { label: "Saved Records", href: "/dashboard/saved", icon: Bookmark },
  { label: "Profile", href: "/dashboard/profile", icon: User },
  { label: "Security", href: "/dashboard/security", icon: Shield },
];

export const ADMIN_NAV_ITEMS: NavLinkItem[] = [
  { label: "Overview", href: "/admin", icon: LayoutDashboard },
  { label: "Records", href: "/admin/records", icon: FolderKanban },
  { label: "Add Record", href: "/admin/records/new", icon: FilePlus },
  { label: "Faculties", href: "/admin/faculties", icon: Building2 },
  { label: "Departments", href: "/admin/departments", icon: Building },
  { label: "Categories", href: "/admin/categories", icon: Tags },
  { label: "Users", href: "/admin/users", icon: Users },
  { label: "Reports", href: "/admin/reports", icon: BarChart3 },
  { label: "Settings", href: "/admin/settings", icon: Settings },
  { label: "Audit Logs", href: "/admin/audit-logs", icon: History },
  { label: "Profile", href: "/admin/profile", icon: User },
  { label: "Security", href: "/admin/security", icon: Shield },
];

export interface DashboardSidebarProps {
  mode: "user" | "admin";
}

export function DashboardSidebar({ mode }: DashboardSidebarProps) {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = React.useState(false);
  const items = mode === "admin" ? ADMIN_NAV_ITEMS : USER_NAV_ITEMS;

  return (
    <aside
      className={cn(
        "hidden lg:flex flex-col border-r border-border bg-background transition-all duration-200 sticky top-0 h-screen z-30",
        collapsed ? "w-16" : "w-60"
      )}
    >
      {/* Brand & Collapse Header */}
      <div className="flex h-14 items-center justify-between px-3 border-b border-border">
        <Link
          href="/"
          className={cn(
            "flex items-center gap-2 font-bold text-foreground overflow-hidden whitespace-nowrap",
            collapsed ? "justify-center w-full" : "px-2"
          )}
        >
          <GraduationCap className="h-5 w-5 text-primary flex-shrink-0" />
          {!collapsed && (
            <span className="text-sm tracking-tight truncate">
              {mode === "admin" ? "PROJECT-HUB Admin" : "PROJECT-HUB"}
            </span>
          )}
        </Link>

        <Button
          variant="ghost"
          size="icon"
          className="h-7 w-7 text-muted-foreground hidden lg:flex"
          onClick={() => setCollapsed(!collapsed)}
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {collapsed ? (
            <ChevronRight className="h-4 w-4" />
          ) : (
            <ChevronLeft className="h-4 w-4" />
          )}
        </Button>
      </div>

      {/* Navigation List */}
      <div className="flex-1 overflow-y-auto p-2 space-y-1">
        {items.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              title={collapsed ? item.label : undefined}
              className={cn(
                "flex items-center gap-3 px-3 py-2 text-xs font-medium rounded-md transition-colors",
                isActive
                  ? "bg-primary text-primary-foreground font-semibold"
                  : "text-muted-foreground hover:bg-accent hover:text-foreground",
                collapsed && "justify-center px-0"
              )}
            >
              {Icon && <Icon className="h-4 w-4 flex-shrink-0" />}
              {!collapsed && <span className="truncate">{item.label}</span>}
            </Link>
          );
        })}
      </div>

      {/* Sidebar Footer */}
      <div className="p-3 border-t border-border text-[11px] text-muted-foreground">
        {!collapsed ? (
          <div className="truncate">
            <span className="font-semibold capitalize text-foreground">{mode} Portal</span>
          </div>
        ) : (
          <div className="text-center font-bold uppercase text-[9px]">{mode[0]}</div>
        )}
      </div>
    </aside>
  );
}
