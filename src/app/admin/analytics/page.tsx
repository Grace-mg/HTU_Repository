"use client";

import * as React from "react";
import {
  Download,
  Eye,
  TrendingUp,
  Building2,
} from "lucide-react";
import { PageHeader } from "@/components/layout/page-header";
import { Badge } from "@/components/ui/badge";
import { adminService } from "@/services/supabase-admin-service";
import { RepositoryRecord } from "@/types/repository";

export default function AdminAnalyticsPage() {
  const [records, setRecords] = React.useState<RepositoryRecord[]>([]);
  const [departments, setDepartments] = React.useState<any[]>([]);

  React.useEffect(() => {
    async function loadAnalytics() {
      const recs = await adminService.getAllRecords();
      const depts = await adminService.getDepartments();
      if (recs && recs.length > 0) setRecords(recs);
      if (depts && depts.length > 0) setDepartments(depts);
    }
    loadAnalytics();
  }, []);

  const totalViews = React.useMemo(() => {
    return records.reduce((acc, r) => acc + (r.viewsCount || 0), 0);
  }, [records]);

  const totalDownloads = React.useMemo(() => {
    return records.reduce((acc, r) => acc + (r.downloadsCount || 0), 0);
  }, [records]);

  const topViewed = React.useMemo(() => {
    return [...records].sort((a, b) => (b.viewsCount || 0) - (a.viewsCount || 0)).slice(0, 4);
  }, [records]);

  const topDownloaded = React.useMemo(() => {
    return [...records].sort((a, b) => (b.downloadsCount || 0) - (a.downloadsCount || 0)).slice(0, 4);
  }, [records]);

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-border pb-5">
        <PageHeader
          title="Repository Analytics & Usage Reports"
          description="Track live record views, download metrics, and department submission distributions."
        />
      </div>


      {/* Analytics Metric Highlights Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="rounded-xl border border-border bg-card p-5 space-y-2">
          <div className="flex items-center justify-between text-xs text-muted-foreground font-semibold">
            <span>Total Record Views</span>
            <Eye className="h-4 w-4 text-blue-600" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-foreground">{totalViews.toLocaleString()}</div>
          <p className="text-xs text-emerald-600 flex items-center gap-1 font-medium">
            <TrendingUp className="h-3.5 w-3.5" /> Live Supabase telemetry
          </p>
        </div>

        <div className="rounded-xl border border-border bg-card p-5 space-y-2">
          <div className="flex items-center justify-between text-xs text-muted-foreground font-semibold">
            <span>Total PDF Downloads</span>
            <Download className="h-4 w-4 text-emerald-600" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-foreground">{totalDownloads.toLocaleString()}</div>
          <p className="text-xs text-emerald-600 flex items-center gap-1 font-medium">
            <TrendingUp className="h-3.5 w-3.5" /> Live Supabase telemetry
          </p>
        </div>

        <div className="rounded-xl border border-border bg-card p-5 space-y-2">
          <div className="flex items-center justify-between text-xs text-muted-foreground font-semibold">
            <span>Active Departments</span>
            <Building2 className="h-4 w-4 text-purple-600" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-foreground">{departments.length || 4}</div>
          <p className="text-xs text-muted-foreground font-medium">Across academic faculties</p>
        </div>
      </div>

      {/* Main Grid: Top Viewed & Top Downloaded Tables */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Top Viewed Records */}
        <div className="space-y-4">
          <h2 className="text-base font-bold text-foreground flex items-center gap-2">
            <Eye className="h-4 w-4 text-blue-600" /> Most Viewed Records
          </h2>

          <div className="rounded-xl border border-border bg-card overflow-hidden shadow-sm">
            <div className="divide-y divide-border text-xs">
              {topViewed.length === 0 ? (
                <div className="p-4 text-muted-foreground">No records currently logged.</div>
              ) : (
                topViewed.map((item, idx) => (
                  <div key={item.id} className="p-4 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <span className="font-bold text-muted-foreground text-sm w-4">#{idx + 1}</span>
                      <div>
                        <div className="font-bold text-foreground line-clamp-1">{item.title}</div>
                        <div className="text-[11px] text-muted-foreground">{item.departmentName || "Engineering"}</div>
                      </div>
                    </div>
                    <Badge variant="outline" className="text-blue-600 border-blue-200 shrink-0">
                      {item.viewsCount || 0} views
                    </Badge>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Top Downloaded Records */}
        <div className="space-y-4">
          <h2 className="text-base font-bold text-foreground flex items-center gap-2">
            <Download className="h-4 w-4 text-emerald-600" /> Most Downloaded Records
          </h2>

          <div className="rounded-xl border border-border bg-card overflow-hidden shadow-sm">
            <div className="divide-y divide-border text-xs">
              {topDownloaded.length === 0 ? (
                <div className="p-4 text-muted-foreground">No records currently logged.</div>
              ) : (
                topDownloaded.map((item, idx) => (
                  <div key={item.id} className="p-4 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <span className="font-bold text-muted-foreground text-sm w-4">#{idx + 1}</span>
                      <div>
                        <div className="font-bold text-foreground line-clamp-1">{item.title}</div>
                        <div className="text-[11px] text-muted-foreground">{item.departmentName || "Engineering"}</div>
                      </div>
                    </div>
                    <Badge variant="outline" className="text-emerald-600 border-emerald-200 shrink-0">
                      {item.downloadsCount || 0} downloads
                    </Badge>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
