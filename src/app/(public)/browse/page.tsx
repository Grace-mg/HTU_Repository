"use client";

import * as React from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Search, FolderOpen, X, ChevronRight } from "lucide-react";
import { RepositoryRecordCard } from "@/components/projects/repository-record-card";
import { EmptyState } from "@/components/feedback/empty-state";
import { Button } from "@/components/ui/button";
import { RepositoryRecord } from "@/types/repository";
import { repositoryService } from "@/services/supabase-repository-service";
import { HTU_FACULTIES, HTU_DEPARTMENTS, getDepartmentsByFaculty } from "@/lib/constants/faculties-departments";

export default function BrowsePage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const query = searchParams.get("q") || "";
  const facultyParam = searchParams.get("facultyId") || searchParams.get("faculty") || "all";
  const deptParam = searchParams.get("departmentId") || searchParams.get("department") || "all";

  const [records, setRecords] = React.useState<RepositoryRecord[]>([]);

  React.useEffect(() => {
    async function loadPublishedRecords() {
      const res = await repositoryService.getRecords({
        query: query || undefined,
        status: "PUBLISHED",
        facultyId: facultyParam !== "all" ? facultyParam : undefined,
        departmentId: deptParam !== "all" ? deptParam : undefined,
      });
      setRecords(res.records);
    }
    loadPublishedRecords();
  }, [query, facultyParam, deptParam]);

  // Helper to update URL search parameters
  const updateParams = React.useCallback(
    (updates: Record<string, string | null | undefined>) => {
      const params = new URLSearchParams(searchParams.toString());
      Object.entries(updates).forEach(([key, val]) => {
        if (val === null || val === undefined || val === "" || val === "all") {
          params.delete(key);
        } else {
          params.set(key, val);
        }
      });
      router.push(`/browse?${params.toString()}`);
    },
    [router, searchParams]
  );

  // Departments list under currently selected faculty
  const availableDepartments = React.useMemo(() => {
    if (facultyParam === "all") return [];
    return getDepartmentsByFaculty(facultyParam);
  }, [facultyParam]);

  // Active section title label
  const activeSectionTitle = React.useMemo(() => {
    if (query) return `Search Results for "${query}"`;
    if (deptParam !== "all") {
      const d = HTU_DEPARTMENTS.find((dept) => dept.id === deptParam);
      if (d) return d.name;
    }
    if (facultyParam !== "all") {
      const f = HTU_FACULTIES.find((fac) => fac.id === facultyParam);
      if (f) return f.name;
    }
    return "All Approved Projects";
  }, [facultyParam, deptParam, query]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 space-y-8">
      {/* Title & Subtitle Header */}
      <div className="space-y-3">
        <h1 className="text-4xl font-extrabold tracking-tight text-blue-950 dark:text-blue-100 sm:text-5xl lg:text-6xl">
          Browse the archive
        </h1>
        <p className="text-sm sm:text-base font-medium text-slate-600 dark:text-slate-300 max-w-3xl leading-relaxed">
          Filter by faculty and department, or search across every approved project from this year&apos;s graduating class.
        </p>
      </div>

      {/* Top Filter Bar Section */}
      <div className="space-y-4 border-b border-border/40 pb-6">
        {/* Level 1: Faculty Filter Pills & Oval Search Input */}
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="space-y-1">
            <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
              Select Faculty
            </span>
            <div className="flex flex-wrap items-center gap-2 overflow-x-auto py-1 no-scrollbar">
              {/* All Faculties Pill */}
              <button
                type="button"
                onClick={() => updateParams({ faculty: null, department: null })}
                className={`rounded-full px-5 py-2 text-xs font-semibold transition-all duration-200 cursor-pointer shrink-0 border ${
                  facultyParam === "all"
                    ? "bg-blue-950 dark:bg-blue-600 text-white border-blue-950 dark:border-blue-600 shadow-sm"
                    : "bg-background text-slate-700 dark:text-slate-200 border-slate-300 dark:border-slate-700 hover:border-blue-600 hover:text-blue-600 dark:hover:text-blue-400"
                }`}
              >
                All Faculties
              </button>

              {/* Faculty Pills */}
              {HTU_FACULTIES.map((fac) => {
                const isActive = facultyParam === fac.id;
                return (
                  <button
                    key={fac.id}
                    type="button"
                    onClick={() => updateParams({ faculty: fac.id, department: null })}
                    className={`rounded-full px-5 py-2 text-xs font-semibold transition-all duration-200 cursor-pointer shrink-0 border ${
                      isActive
                        ? "bg-blue-950 dark:bg-blue-600 text-white border-blue-950 dark:border-blue-600 shadow-sm"
                        : "bg-background text-slate-700 dark:text-slate-200 border-slate-300 dark:border-slate-700 hover:border-blue-600 hover:text-blue-600 dark:hover:text-blue-400"
                    }`}
                  >
                    {fac.code} - {fac.name.split("(")[0].trim()}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Oval Search Input */}
          <div className="relative w-full sm:w-80 shrink-0 self-end">
            <Search className="absolute left-4 top-2.5 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search by title or keyword.."
              value={query}
              onChange={(e) => updateParams({ q: e.target.value })}
              className="w-full rounded-full border border-slate-300 dark:border-slate-700 bg-background pl-10 pr-9 py-2 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-blue-600 transition-all shadow-xs"
            />
            {query && (
              <button
                type="button"
                onClick={() => updateParams({ q: null })}
                className="absolute right-3 top-2.5 text-slate-400 hover:text-foreground cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>

        {/* Level 2: Sub-Department Pills (Appears when a specific Faculty is selected) */}
        {availableDepartments.length > 0 && (
          <div className="pt-3 border-t border-border/40 space-y-1.5 animate-fadeIn">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-blue-600 dark:text-blue-400">
              <span>Departments under {HTU_FACULTIES.find(f => f.id === facultyParam)?.code}</span>
              <ChevronRight className="h-3.5 w-3.5" />
            </div>
            <div className="flex flex-wrap items-center gap-2 overflow-x-auto py-1 no-scrollbar">
              {/* All Departments in Faculty Pill */}
              <button
                type="button"
                onClick={() => updateParams({ department: null })}
                className={`rounded-full px-4 py-1.5 text-[11px] font-semibold transition-all duration-200 cursor-pointer shrink-0 border ${
                  deptParam === "all"
                    ? "bg-blue-600 text-white border-blue-600 shadow-sm"
                    : "bg-blue-500/10 text-blue-800 dark:text-blue-300 border-blue-400/30 hover:bg-blue-600 hover:text-white"
                }`}
              >
                All Departments
              </button>

              {/* Department Pills */}
              {availableDepartments.map((dept) => {
                const isActive = deptParam === dept.id;
                return (
                  <button
                    key={dept.id}
                    type="button"
                    onClick={() => updateParams({ department: dept.id })}
                    className={`rounded-full px-4 py-1.5 text-[11px] font-semibold transition-all duration-200 cursor-pointer shrink-0 border ${
                      isActive
                        ? "bg-blue-600 text-white border-blue-600 shadow-sm"
                        : "bg-muted/70 text-slate-700 dark:text-slate-200 border-border hover:border-blue-600 hover:text-blue-600 dark:hover:text-blue-400"
                    }`}
                  >
                    {dept.name}
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Active Section Title */}
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-foreground">
          {activeSectionTitle}
        </h2>
      </div>

      {/* Results Cards Grid (3 Columns) */}
      {records.length === 0 ? (
        <EmptyState
          title="No Records Found"
          description="No published academic records match your selected faculty, department, or search query."
          icon={FolderOpen}
          action={
            <Button
              variant="outline"
              size="sm"
              onClick={() => router.push("/browse")}
              className="text-xs font-semibold rounded-full px-5"
            >
              Reset Filters
            </Button>
          }
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {records.map((r) => (
            <RepositoryRecordCard key={r.id} record={r} />
          ))}
        </div>
      )}
    </div>
  );
}
