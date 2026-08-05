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
import { BookOpen, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { repositoryService } from "@/services/supabase-repository-service";
import { RepositoryRecord } from "@/types/repository";

export default function DashboardThesesPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const query = searchParams.get("q") || "";
  const facultyParam = searchParams.get("facultyId") || searchParams.get("faculty") || "all";
  const deptParam = searchParams.get("departmentId") || searchParams.get("department") || "all";
  const yearParam = searchParams.get("academicYear") || searchParams.get("year") || "all";
  const categoryParam = searchParams.get("categoryId") || searchParams.get("category") || "all";
  const sortParam = searchParams.get("sort") || "newest";

  const [mobileFilterOpen, setMobileFilterOpen] = React.useState(false);
  const [records, setRecords] = React.useState<RepositoryRecord[]>([]);

  React.useEffect(() => {
    async function loadTheses() {
      const res = await repositoryService.getRecords({
        query: query || undefined,
        recordType: "THESIS",
        status: "PUBLISHED",
        facultyId: facultyParam !== "all" ? facultyParam : undefined,
        departmentId: deptParam !== "all" ? deptParam : undefined,
        categoryId: categoryParam !== "all" ? categoryParam : undefined,
        academicYear: yearParam !== "all" ? Number(yearParam) : undefined,
      });
      setRecords(res.records);
    }
    loadTheses();
  }, [query, facultyParam, deptParam, yearParam, categoryParam]);

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
      router.push(`/dashboard/theses?${params.toString()}`);
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
        title="Browse Academic Research Theses"
        description="Explore research papers, academic dissertations, and analytical publications from Supabase database."
      />

      {/* Top Search Bar & Sort Dropdown Row */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        <div className="flex-1 max-w-2xl">
          <SearchField
            placeholder="Search research theses by title, supervisor, keyword..."
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
        onClearAll={() => router.push("/dashboard/theses")}
      />

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="hidden lg:block lg:col-span-1">
          <BrowseFiltersSidebar
            recordType="THESIS"
            hideRecordTypeFilter
            selectedFaculty={facultyParam}
            selectedDepartment={deptParam}
            selectedYear={yearParam}
            selectedCategory={categoryParam}
            onFilterChange={(f) => updateParams(f)}
            onResetFilters={() => router.push("/dashboard/theses")}
          />
        </div>

        {mobileFilterOpen && (
          <div className="lg:hidden col-span-1 border-b border-border pb-6">
            <BrowseFiltersSidebar
              recordType="THESIS"
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
                router.push("/dashboard/theses");
                setMobileFilterOpen(false);
              }}
            />
          </div>
        )}

        <div className="lg:col-span-3 space-y-6">
          {records.length === 0 ? (
            <EmptyState
              title="No Research Theses Found"
              description="No academic thesis records match your current search and filter criteria."
              icon={BookOpen}
              action={
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => router.push("/dashboard/theses")}
                  className="text-xs font-semibold"
                >
                  Clear Filters
                </Button>
              }
            />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {records.map((r) => (
                <RepositoryRecordCard key={r.id} record={r} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
