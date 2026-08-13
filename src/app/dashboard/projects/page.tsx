"use client";

import * as React from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { SearchField } from "@/components/filters/search-field";
import { BrowseFiltersSidebar } from "@/components/filters/browse-filters-sidebar";
import { ActiveFilterTags, ActiveFilterItem } from "@/components/filters/active-filter-tags";
import { EmptyState } from "@/components/feedback/empty-state";
import { PageHeader } from "@/components/layout/page-header";
import { RepositoryRecordCard } from "@/components/projects/repository-record-card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FolderOpen, Filter, Users, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import { repositoryService } from "@/services/supabase-repository-service";
import { SupabaseAuthService } from "@/services/supabase-auth-service";
import { RepositoryRecord } from "@/types/repository";

const authService = new SupabaseAuthService();

export default function DashboardProjectsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const query = searchParams.get("q") || "";
  const facultyParam = searchParams.get("facultyId") || searchParams.get("faculty") || "all";
  const deptParam = searchParams.get("departmentId") || searchParams.get("department") || "all";
  const yearParam = searchParams.get("academicYear") || searchParams.get("year") || "all";
  const categoryParam = searchParams.get("categoryId") || searchParams.get("category") || "all";
  const sortParam = searchParams.get("sort") || "newest";
  const viewScope = searchParams.get("scope") || "my_group"; // "my_group" | "all_published"

  const [mobileFilterOpen, setMobileFilterOpen] = React.useState(false);
  const [records, setRecords] = React.useState<RepositoryRecord[]>([]);
  const [currentUser, setCurrentUser] = React.useState<any>(null);

  React.useEffect(() => {
    async function loadProjects() {
      const user = await authService.getCurrentUser();
      setCurrentUser(user);

      const targetStatus = viewScope === "my_group" ? "all" : undefined;
      const res = await repositoryService.getRecords({
        query: query || undefined,
        recordType: "PROJECT",
        status: targetStatus,
        facultyId: facultyParam !== "all" ? facultyParam : undefined,
        departmentId: deptParam !== "all" ? deptParam : undefined,
        categoryId: categoryParam !== "all" ? categoryParam : undefined,
        academicYear: yearParam !== "all" ? Number(yearParam) : undefined,
      });

      let fetched = res.records || [];

      if (viewScope === "my_group" && user) {
        const uEmail = (user.email || "").toLowerCase().trim();
        const uName = (user.name || "").toLowerCase().trim();
        const uStudentId = (user.studentId || "").toLowerCase().trim();

        fetched = fetched.filter((r) => {
          // Check lead author
          const isLead =
            (uName && r.studentName?.toLowerCase() === uName) ||
            (uStudentId && r.studentId?.toLowerCase() === uStudentId) ||
            (uEmail && r.studentName?.toLowerCase().includes(uName));

          if (isLead) return true;

          // Check group members
          if (r.groupMembers && Array.isArray(r.groupMembers)) {
            return r.groupMembers.some((gm: any) => {
              const gmEmail = (gm.email || "").toLowerCase().trim();
              const gmId = (gm.studentId || "").toLowerCase().trim();
              const gmName = (gm.name || "").toLowerCase().trim();

              return (
                (uEmail && gmEmail === uEmail) ||
                (uStudentId && gmId === uStudentId) ||
                (uName && gmName === uName)
              );
            });
          }

          return false;
        });
      }

      setRecords(fetched);
    }
    loadProjects();
  }, [query, facultyParam, deptParam, yearParam, categoryParam, viewScope]);

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
      router.push(`/dashboard/projects?${params.toString()}`);
    },
    [router, searchParams]
  );

  const activeFilters: ActiveFilterItem[] = React.useMemo(() => {
    const list: ActiveFilterItem[] = [];
    if (query) list.push({ key: "q", label: "Search", value: query });
    if (facultyParam !== "all") list.push({ key: "faculty", label: "Faculty", value: facultyParam });
    if (deptParam !== "all") list.push({ key: "department", label: "Department", value: deptParam });
    if (yearParam !== "all") list.push({ key: "year", label: "Year", value: yearParam });
    if (categoryParam !== "all") list.push({ key: "category", label: "Category", value: categoryParam });
    return list;
  }, [query, facultyParam, deptParam, yearParam, categoryParam]);

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <PageHeader
        title="Student Projects & Submissions"
        description="View real-time approval status for your group projects, explore hardware prototypes, and browse university software builds."
      />

      {/* Scope Switcher: My Group Submissions vs All Published Projects */}
      <div className="flex flex-wrap items-center gap-2 border-b border-border pb-4">
        <Button
          type="button"
          variant={viewScope === "my_group" ? "default" : "outline"}
          size="sm"
          onClick={() => updateParams({ scope: "my_group" })}
          className={`text-xs font-semibold gap-2 ${
            viewScope === "my_group" ? "bg-blue-600 text-white" : ""
          }`}
        >
          <Users className="h-4 w-4" /> My Group Projects & Submissions
        </Button>
        <Button
          type="button"
          variant={viewScope === "all_published" ? "default" : "outline"}
          size="sm"
          onClick={() => updateParams({ scope: "all_published" })}
          className={`text-xs font-semibold gap-2 ${
            viewScope === "all_published" ? "bg-blue-600 text-white" : ""
          }`}
        >
          <Globe className="h-4 w-4" /> All Approved University Projects
        </Button>
      </div>

      {/* Top Search Bar & Sort Dropdown Row */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        <div className="flex-1 max-w-2xl">
          <SearchField
            placeholder="Search projects by title, student name, keyword..."
            value={query}
            onSearch={(q) => updateParams({ q })}
          />
        </div>

        <div className="flex items-center gap-3 justify-end">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setMobileFilterOpen(!mobileFilterOpen)}
            className="lg:hidden h-10 gap-2 border-border"
          >
            <Filter className="h-4 w-4" /> Filters
          </Button>

          <div className="w-44">
            <Select
              value={sortParam}
              onValueChange={(val) => updateParams({ sort: val })}
            >
              <SelectTrigger className="h-10 text-xs">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Newest First</SelectItem>
                <SelectItem value="oldest">Oldest First</SelectItem>
                <SelectItem value="title_asc">Title (A-Z)</SelectItem>
                <SelectItem value="title_desc">Title (Z-A)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      <ActiveFilterTags
        filters={activeFilters}
        onRemoveFilter={(key) => updateParams({ [key]: null })}
        onClearAll={() => router.push("/dashboard/projects")}
      />

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="hidden lg:block lg:col-span-1">
          <BrowseFiltersSidebar
            recordType="PROJECT"
            hideRecordTypeFilter
            selectedFaculty={facultyParam}
            selectedDepartment={deptParam}
            selectedYear={yearParam}
            selectedCategory={categoryParam}
            onFilterChange={(f) => updateParams(f)}
            onResetFilters={() => router.push("/dashboard/projects")}
          />
        </div>

        {mobileFilterOpen && (
          <div className="lg:hidden col-span-1 border-b border-border pb-6">
            <BrowseFiltersSidebar
              recordType="PROJECT"
              hideRecordTypeFilter
              selectedFaculty={facultyParam}
              selectedDepartment={deptParam}
              selectedYear={yearParam}
              selectedCategory={categoryParam}
              onFilterChange={(f) => {
                updateParams(f);
                setMobileFilterOpen(false);
              }}
              onResetFilters={() => {
                router.push("/dashboard/projects");
                setMobileFilterOpen(false);
              }}
            />
          </div>
        )}

        <div className="lg:col-span-3 space-y-6">
          {records.length === 0 ? (
            <EmptyState
              title={viewScope === "my_group" ? "No Group Project Submissions Found" : "No Projects Found"}
              description={
                viewScope === "my_group"
                  ? "When you or your project teammates submit a project, its status (Pending, Approved, or Rejected) will appear here."
                  : "No student project records match your current search and filter criteria."
              }
              icon={FolderOpen}
              action={
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => router.push("/dashboard/submit")}
                  className="text-xs font-semibold"
                >
                  Submit Project
                </Button>
              }
            />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {records.map((r) => (
                <RepositoryRecordCard key={r.id} record={r} showStatus={viewScope === "my_group"} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
