"use client";

import * as React from "react";
import Link from "next/link";
import {
  FileText,
  Clock,
  Building2,
  Users,
  Plus,
  CheckCircle2,
  ShieldCheck,
  Activity,
  FolderPlus,
  UserCheck,
  Eye,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/layout/page-header";
import { Badge } from "@/components/ui/badge";
import { adminService, AdminStats } from "@/services/supabase-admin-service";
import { RepositoryRecord } from "@/types/repository";

export default function AdminDashboardPage() {
  const [stats, setStats] = React.useState<AdminStats>({
    totalRecords: 0,
    pendingApprovals: 0,
    totalUsers: 0,
    totalViews: 0,
  });

  const [pendingQueue, setPendingQueue] = React.useState<RepositoryRecord[]>([]);

  React.useEffect(() => {
    async function loadData() {
      const liveStats = await adminService.getAdminStats();
      setStats(liveStats);

      const pending = await adminService.getPendingApprovals();
      setPendingQueue(pending);
    }
    loadData();
  }, []);

  const metrics = [
    {
      title: "Total Records",
      value: stats.totalRecords.toString(),
      description: "Approved projects & research theses",
      icon: FileText,
      color: "text-blue-600 dark:text-blue-400",
      bgColor: "bg-blue-50 dark:bg-blue-950/50 border-blue-200 dark:border-blue-800",
    },
    {
      title: "Pending Approvals",
      value: stats.pendingApprovals.toString(),
      description: "Submissions awaiting HOD review",
      icon: Clock,
      color: "text-amber-600 dark:text-amber-400",
      bgColor: "bg-amber-50 dark:bg-amber-950/50 border-amber-200 dark:border-amber-800",
    },
    {
      title: "User Accounts",
      value: stats.totalUsers.toString(),
      description: "Registered students & faculty members",
      icon: Users,
      color: "text-purple-600 dark:text-purple-400",
      bgColor: "bg-purple-50 dark:bg-purple-950/50 border-purple-200 dark:border-purple-800",
    },
    {
      title: "Total Views",
      value: stats.totalViews.toString(),
      description: "Aggregated record view impressions",
      icon: Building2,
      color: "text-emerald-600 dark:text-emerald-400",
      bgColor: "bg-emerald-50 dark:bg-emerald-950/50 border-emerald-200 dark:border-emerald-800",
    },
  ];

  return (
    <div className="w-full space-y-8">
      {/* Header Banner Card with Add New Record Button inside Card */}
      <PageHeader
        title="Admin Control Panel"
        description="System metrics overview, record approvals queue, and repository management tools."
        actions={
          <Button
            asChild
            className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold gap-1.5 shrink-0 h-9"
          >
            <Link href="/admin/records/new">
              <Plus className="h-4 w-4" /> Add New Record
            </Link>
          </Button>
        }
      />

      {/* 4 Metric Summary Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map((m) => {
          const Icon = m.icon;
          return (
            <div
              key={m.title}
              className={`rounded-xl border p-5 bg-card shadow-sm space-y-3 transition-all hover:shadow-md ${m.bgColor}`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                  {m.title}
                </span>
                <Icon className={`h-5 w-5 ${m.color}`} />
              </div>
              <div className="text-2xl font-black tracking-tight text-foreground">
                {m.value}
              </div>
              <p className="text-[11px] text-muted-foreground">{m.description}</p>
            </div>
          );
        })}
      </div>

      {/* Main Grid: Pending Approvals Queue & Quick Admin Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column (2 Cols): Pending Approval Queue */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between border-b border-border pb-3">
            <h2 className="text-sm font-bold text-foreground flex items-center gap-2">
              <Clock className="h-4 w-4 text-amber-500" /> Pending Record Approvals ({pendingQueue.length})
            </h2>
            <Button asChild variant="ghost" size="sm" className="text-xs text-muted-foreground hover:text-foreground">
              <Link href="/admin/approvals">View All Approvals</Link>
            </Button>
          </div>

          <div className="rounded-xl border border-border bg-card overflow-hidden shadow-sm">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-border bg-muted/50 text-muted-foreground font-semibold">
                <tr>
                  <th className="p-3.5">Submission Details</th>
                  <th className="p-3.5">Type & Year</th>
                  <th className="p-3.5">Status</th>
                  <th className="p-3.5 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {pendingQueue.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="p-8 text-center text-xs text-muted-foreground">
                      No pending approvals in queue. All submissions processed!
                    </td>
                  </tr>
                ) : (
                  pendingQueue.slice(0, 5).map((record) => (
                    <tr key={record.id} className="hover:bg-muted/40 transition-colors">
                      <td className="p-3.5">
                        <div className="font-bold text-foreground line-clamp-1">{record.title}</div>
                        <div className="text-[11px] text-muted-foreground">By {record.studentName}</div>
                      </td>
                      <td className="p-3.5 text-muted-foreground">
                        <div>{record.recordType}</div>
                        <div className="text-[10px]">{record.academicYear}</div>
                      </td>
                      <td className="p-3.5">
                        <Badge className="bg-amber-500/10 text-amber-600 border-amber-500/30 text-[10px]">
                          Pending Review
                        </Badge>
                      </td>
                      <td className="p-3.5 text-right">
                        <Button asChild variant="outline" size="sm" className="h-7 text-xs font-semibold">
                          <Link href={`/admin/approvals/${record.id}`}>Review</Link>
                        </Button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right Column (1 Col): Quick Admin Action Links */}
        <div className="space-y-4">
          <div className="border-b border-border pb-3">
            <h2 className="text-sm font-bold text-foreground flex items-center gap-2">
              <Activity className="h-4 w-4 text-blue-500" /> Administrative Operations
            </h2>
          </div>

          <div className="space-y-3">
            <Link
              href="/admin/records/new"
              className="flex items-center justify-between p-4 rounded-xl border border-border bg-card hover:bg-accent/50 transition-all group shadow-sm"
            >
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-lg bg-blue-50 text-blue-600 group-hover:scale-105 transition-transform">
                  <FolderPlus className="h-4 w-4" />
                </div>
                <div>
                  <h3 className="text-xs font-bold text-foreground">Upload Repository Record</h3>
                  <p className="text-[11px] text-muted-foreground">Add new thesis or project directly</p>
                </div>
              </div>
            </Link>

            <Link
              href="/admin/departments"
              className="flex items-center justify-between p-4 rounded-xl border border-border bg-card hover:bg-accent/50 transition-all group shadow-sm"
            >
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-lg bg-purple-50 text-purple-600 group-hover:scale-105 transition-transform">
                  <Building2 className="h-4 w-4" />
                </div>
                <div>
                  <h3 className="text-xs font-bold text-foreground">Manage Departments & HODs</h3>
                  <p className="text-[11px] text-muted-foreground">Configure faculties and department heads</p>
                </div>
              </div>
            </Link>

            <Link
              href="/admin/users"
              className="flex items-center justify-between p-4 rounded-xl border border-border bg-card hover:bg-accent/50 transition-all group shadow-sm"
            >
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-lg bg-emerald-50 text-emerald-600 group-hover:scale-105 transition-transform">
                  <UserCheck className="h-4 w-4" />
                </div>
                <div>
                  <h3 className="text-xs font-bold text-foreground">User & Role Management</h3>
                  <p className="text-[11px] text-muted-foreground">Invite admins and manage accounts</p>
                </div>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
