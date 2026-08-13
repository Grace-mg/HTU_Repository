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
  ChevronLeft,
  ChevronRight,
  CheckSquare,
  LogOut,
  Sun,
  Moon,
  Laptop,
  ChevronDown,
  Check,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { NavLinkItem } from "@/components/navigation/mobile-nav-drawer";
import { SupabaseAuthService } from "@/services/supabase-auth-service";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { applyTheme } from "@/lib/theme";

const authService = new SupabaseAuthService();

export function SidebarThemeToggle({ collapsed }: { collapsed: boolean }) {
  const [theme, setTheme] = React.useState<"light" | "dark" | "system">("light");
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
    const saved = (localStorage.getItem("theme") as "light" | "dark" | "system") || "light";
    setTheme(saved);
    applyTheme(saved);
  }, []);

  const handleSelectTheme = (newTheme: "light" | "dark" | "system") => {
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
    applyTheme(newTheme);
  };

  const getThemeIcon = () => {
    if (theme === "dark") return <Moon className="h-4 w-4 text-blue-400 shrink-0" />;
    if (theme === "system") return <Laptop className="h-4 w-4 text-muted-foreground shrink-0" />;
    return <Sun className="h-4 w-4 text-amber-500 shrink-0" />;
  };

  const getThemeLabel = () => {
    if (theme === "dark") return "Dark Theme";
    if (theme === "system") return "System Theme";
    return "Light Theme";
  };

  if (!mounted) {
    return (
      <div className="h-8 rounded-md bg-muted/40 animate-pulse" />
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="w-full">
        {collapsed ? (
          <div
            title={getThemeLabel()}
            className="flex items-center justify-center px-0 py-2 text-xs font-medium text-muted-foreground hover:bg-blue-600/10 hover:text-blue-600 dark:hover:bg-blue-500/20 dark:hover:text-blue-400 rounded-md transition-colors cursor-pointer"
          >
            {getThemeIcon()}
          </div>
        ) : (
          <div className="flex items-center justify-between w-full px-3 py-2 text-xs font-medium text-muted-foreground hover:bg-blue-600/10 hover:text-blue-600 dark:hover:bg-blue-500/20 dark:hover:text-blue-400 rounded-md transition-colors cursor-pointer">
            <div className="flex items-center gap-3 truncate min-w-0">
              {getThemeIcon()}
              <span className="truncate">{getThemeLabel()}</span>
            </div>
            <ChevronDown className="h-3.5 w-3.5 opacity-60 shrink-0" />
          </div>
        )}
      </DropdownMenuTrigger>
        <DropdownMenuContent align={collapsed ? "center" : "start"} className="w-48 bottom-full mb-2 -mt-1">
          <DropdownMenuItem
            onClick={() => handleSelectTheme("light")}
            className="flex items-center justify-between text-xs cursor-pointer"
          >
            <div className="flex items-center gap-2">
              <Sun className="h-4 w-4 text-amber-500" />
              <span>Light Theme</span>
            </div>
            {theme === "light" && <Check className="h-3.5 w-3.5 text-blue-600 dark:text-blue-400" />}
          </DropdownMenuItem>

          <DropdownMenuItem
            onClick={() => handleSelectTheme("dark")}
            className="flex items-center justify-between text-xs cursor-pointer"
          >
            <div className="flex items-center gap-2">
              <Moon className="h-4 w-4 text-blue-400" />
              <span>Dark Theme</span>
            </div>
            {theme === "dark" && <Check className="h-3.5 w-3.5 text-blue-600 dark:text-blue-400" />}
          </DropdownMenuItem>

          <DropdownMenuItem
            onClick={() => handleSelectTheme("system")}
            className="flex items-center justify-between text-xs cursor-pointer"
          >
            <div className="flex items-center gap-2">
              <Laptop className="h-4 w-4 text-muted-foreground" />
              <span>System Theme</span>
            </div>
            {theme === "system" && <Check className="h-3.5 w-3.5 text-blue-600 dark:text-blue-400" />}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

export const USER_NAV_ITEMS: NavLinkItem[] = [
  { label: "Overview", href: "/dashboard", icon: LayoutDashboard },
  { label: "Submit Project", href: "/dashboard/submit", icon: FilePlus },
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
  { label: "Approvals", href: "/admin/approvals", icon: CheckSquare },
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
  const [currentUser, setCurrentUser] = React.useState<any>(null);

  React.useEffect(() => {
    async function loadUser() {
      const u = await authService.getCurrentUser();
      if (u) {
        setCurrentUser(u);
      }
    }
    loadUser();
  }, []);

  const handleLogout = async () => {
    try {
      await authService.logout();
    } catch (err) {
      console.error("[Logout Error]", err);
    } finally {
      window.location.href = "/login";
    }
  };

  const items = mode === "admin" ? ADMIN_NAV_ITEMS : USER_NAV_ITEMS;

  const displayName =
    currentUser?.name ||
    currentUser?.email?.split("@")[0] ||
    (mode === "admin" ? "System Administrator" : "Student User");

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
          href={mode === "admin" ? "/admin" : "/dashboard"}
          className={cn(
            "flex items-center gap-2 font-bold text-foreground overflow-hidden whitespace-nowrap",
            collapsed ? "justify-center w-full" : "px-2"
          )}
        >
          <img
            src="/Repository Assets/LOGO-REPO.png"
            alt="Project HUB Logo"
            className="h-6 w-auto object-contain flex-shrink-0"
          />
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
                  ? "bg-blue-600 text-white font-semibold shadow-sm"
                  : "text-muted-foreground hover:bg-blue-600/10 hover:text-blue-600 dark:hover:bg-blue-500/20 dark:hover:text-blue-400",
                collapsed && "justify-center px-0"
              )}
            >
              {Icon && <Icon className="h-4 w-4 flex-shrink-0" />}
              {!collapsed && <span className="truncate">{item.label}</span>}
            </Link>
          );
        })}
      </div>

      {/* Pinned Theme Toggle at bottom of sidebar before profile footer */}
      <div className="p-2 shrink-0">
        <SidebarThemeToggle collapsed={collapsed} />
      </div>

      {/* Sidebar Footer with User Profile & Logout Button */}
      <div className="p-3 border-t border-border bg-muted/30 flex items-center justify-between">
        {!collapsed ? (
          <Link
            href={mode === "admin" ? "/admin/profile" : "/dashboard/profile"}
            className="flex items-center gap-2.5 min-w-0 hover:opacity-80 transition-opacity cursor-pointer group"
            title="View Profile Settings"
          >
            <div className="h-8 w-8 rounded-full bg-blue-600/10 text-blue-600 font-bold flex items-center justify-center text-xs shrink-0 border border-blue-600/20 group-hover:bg-blue-600 group-hover:text-white transition-colors">
              {displayName[0]?.toUpperCase()}
            </div>
            <div className="flex flex-col truncate min-w-0">
              <span className="font-bold text-xs text-foreground truncate group-hover:text-blue-600 transition-colors">{displayName}</span>
              <span className="text-[10px] text-muted-foreground capitalize font-medium">
                {mode === "admin" ? "Administrator" : "Student Portal"}
              </span>
            </div>
          </Link>
        ) : (
          <Link
            href={mode === "admin" ? "/admin/profile" : "/dashboard/profile"}
            className="flex justify-center w-full hover:opacity-80 transition-opacity cursor-pointer"
            title="View Profile Settings"
          >
            <div className="h-7 w-7 rounded-full bg-blue-600/10 text-blue-600 font-bold flex items-center justify-center text-[10px]">
              {displayName[0]?.toUpperCase()}
            </div>
          </Link>
        )}

        {!collapsed && (
          <Button
            variant="ghost"
            size="icon"
            onClick={handleLogout}
            title="Log out"
            className="h-7 w-7 text-muted-foreground hover:text-destructive shrink-0"
          >
            <LogOut className="h-4 w-4" />
          </Button>
        )}
      </div>
    </aside>
  );
}
