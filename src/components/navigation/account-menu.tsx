"use client";

import * as React from "react";
import Link from "next/link";
import { User, Shield, LogOut } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { SupabaseAuthService } from "@/services/supabase-auth-service";

const authService = new SupabaseAuthService();

export interface AccountMenuProps {
  userName?: string;
  userEmail?: string;
  userRole?: string;
}

export function AccountMenu({ userName, userEmail, userRole }: AccountMenuProps) {
  const [currentUser, setCurrentUser] = React.useState<any>(null);

  React.useEffect(() => {
    async function loadUser() {
      const u = await authService.getCurrentUser();
      if (u) {
        setCurrentUser(u);
      }
    }
    loadUser();

    window.addEventListener("storage", loadUser);
    return () => window.removeEventListener("storage", loadUser);
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

  const displayName =
    userName ||
    currentUser?.name ||
    userEmail ||
    currentUser?.email?.split("@")[0] ||
    (userRole === "admin" ? "System Administrator" : "Student User");

  const displayEmail = userEmail || currentUser?.email || "user@htu.edu.gh";
  const roleTitle = userRole || currentUser?.role?.toLowerCase() || "user";

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2 text-xs font-semibold px-3 h-8 bg-background hover:bg-muted">
          <div className="h-5 w-5 rounded-full bg-primary/10 text-primary font-bold flex items-center justify-center text-[10px]">
            {displayName[0]?.toUpperCase()}
          </div>
          <span className="inline-block truncate max-w-[140px]">{displayName}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56 p-1.5 shadow-lg border border-border bg-card" align="end">
        <DropdownMenuGroup>
          <DropdownMenuLabel className="p-2">
            <div className="flex flex-col space-y-0.5">
              <p className="text-xs font-bold text-foreground truncate max-w-[200px]">
                {displayName}
              </p>
              <p className="text-[11px] font-normal text-muted-foreground truncate max-w-[200px]">
                {displayEmail}
              </p>
              <p className="text-[10px] font-semibold text-blue-600 capitalize pt-0.5">
                Role: {roleTitle}
              </p>
            </div>
          </DropdownMenuLabel>
        </DropdownMenuGroup>
        <DropdownMenuSeparator className="my-1 border-border" />

        <DropdownMenuGroup>
          <DropdownMenuItem className="p-0">
            <Link href="/dashboard/profile" className="flex w-full items-center gap-2.5 px-2.5 py-1.5 text-xs font-medium rounded-md hover:bg-accent">
              <User className="h-3.5 w-3.5 text-muted-foreground" />
              Profile
            </Link>
          </DropdownMenuItem>

          <DropdownMenuItem className="p-0">
            <Link href="/dashboard/security" className="flex w-full items-center gap-2.5 px-2.5 py-1.5 text-xs font-medium rounded-md hover:bg-accent">
              <Shield className="h-3.5 w-3.5 text-muted-foreground" />
              Security
            </Link>
          </DropdownMenuItem>
        </DropdownMenuGroup>

        <DropdownMenuSeparator className="my-1 border-border" />

        <DropdownMenuGroup>
          <DropdownMenuItem
            onClick={handleLogout}
            className="flex w-full items-center gap-2.5 px-2.5 py-1.5 text-xs font-semibold text-destructive rounded-md cursor-pointer hover:bg-destructive/10"
          >
            <LogOut className="h-3.5 w-3.5 text-destructive" />
            Log out
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
