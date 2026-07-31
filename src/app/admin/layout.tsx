import * as React from "react";
import { DashboardSidebar } from "@/components/navigation/dashboard-sidebar";
import { DashboardTopbar } from "@/components/navigation/dashboard-topbar";

export default function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-background text-foreground">
      {/* Desktop Admin Sidebar */}
      <DashboardSidebar mode="admin" />

      {/* Main Admin Viewport */}
      <div className="flex flex-1 flex-col min-w-0">
        <DashboardTopbar mode="admin" />
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}
