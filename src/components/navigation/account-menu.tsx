"use client";

import * as React from "react";
import Link from "next/link";
import { User, Shield, LogOut, Settings } from "lucide-react";
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

export interface AccountMenuProps {
  userEmail?: string;
  userRole?: string;
}

export function AccountMenu({ userEmail, userRole }: AccountMenuProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2 text-xs">
          <User className="h-4 w-4" />
          <span className="hidden sm:inline-block">Account</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-48" align="end">
        <DropdownMenuGroup>
          <DropdownMenuLabel>
            <div className="flex flex-col space-y-0.5">
              <p className="text-xs font-semibold text-foreground truncate max-w-[180px]">
                {userEmail || "Account Options"}
              </p>
              {userRole && (
                <p className="text-[10px] font-normal text-muted-foreground capitalize">
                  Role: {userRole}
                </p>
              )}
            </div>
          </DropdownMenuLabel>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        
        <DropdownMenuGroup>
          <DropdownMenuItem>
            <Link href="/dashboard/profile" className="flex w-full items-center gap-2 text-xs">
              <User className="h-3.5 w-3.5" />
              Profile
            </Link>
          </DropdownMenuItem>
          
          <DropdownMenuItem>
            <Link href="/dashboard/security" className="flex w-full items-center gap-2 text-xs">
              <Shield className="h-3.5 w-3.5" />
              Security
            </Link>
          </DropdownMenuItem>
        </DropdownMenuGroup>

        <DropdownMenuSeparator />

        <DropdownMenuGroup>
          <DropdownMenuItem destructive>
            <div className="flex w-full items-center gap-2 text-xs">
              <LogOut className="h-3.5 w-3.5" />
              Log out
            </div>
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
