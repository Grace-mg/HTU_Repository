import * as React from "react";
import { DashboardSidebar } from "@/components/navigation/dashboard-sidebar";
import { DashboardTopbar } from "@/components/navigation/dashboard-topbar";

export default function UserDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-background text-foreground">
      {/* Desktop Sidebar */}
      <DashboardSidebar mode="user" />

      {/* Main Content Viewport */}
      <div className="flex flex-1 flex-col min-w-0">
        <DashboardTopbar mode="user" />
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}
