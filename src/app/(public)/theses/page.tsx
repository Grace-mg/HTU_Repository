"use client";

import * as React from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { SearchField } from "@/components/filters/search-field";
import { BrowseFiltersSidebar } from "@/components/filters/browse-filters-sidebar";
import { ActiveFilterTags, ActiveFilterItem } from "@/components/filters/active-filter-tags";
import { EmptyState } from "@/components/feedback/empty-state";
import { PageHeader } from "@/components/layout/page-header";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { BookOpen, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { RepositoryRecordCard } from "@/components/projects/repository-record-card";
import { RepositoryRecord } from "@/types/repository";
import { repositoryService } from "@/services/supabase-repository-service";

export default function ThesesPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const query = searchParams.get("q") || "";
  const facultyParam = searchParams.get("faculty") || "all";
  const deptParam = searchParams.get("department") || "all";
  const yearParam = searchParams.get("year") || "all";
  const categoryParam = searchParams.get("category") || "all";
  const sortParam = searchParams.get("sort") || "newest";

  const [records, setRecords] = React.useState<RepositoryRecord[]>([]);
  const [mobileFilterOpen, setMobileFilterOpen] = React.useState(false);

  React.useEffect(() => {
    async function loadTheses() {
      const res = await repositoryService.getRecords({
        query: query || undefined,
        status: "PUBLISHED",
        recordType: "THESIS",
        facultyId: facultyParam !== "all" ? facultyParam : undefined,
        departmentId: deptParam !== "all" ? deptParam : undefined,
        academicYear: yearParam !== "all" ? Number(yearParam) : undefined,
        categoryId: categoryParam !== "all" ? categoryParam : undefined,
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
      router.push(`/theses?${params.toString()}`);
    },
    [router, searchParams]
  );

  const activeFilters: ActiveFilterItem[] = React.useMemo(() => {
    const list: ActiveFilterItem[] = [{ key: "type", label: "Type", value: "THESIS" }];
    if (query) list.push({ key: "q", label: "Search", value: query });
    if (facultyParam !== "all") list.push({ key: "faculty", label: "Faculty", value: facultyParam });
    if (deptParam !== "all") list.push({ key: "department", label: "Department", value: deptParam });
    if (yearParam !== "all") list.push({ key: "year", label: "Year", value: yearParam });
    if (categoryParam !== "all") list.push({ key: "category", label: "Category", value: categoryParam });
    return list;
  }, [query, facultyParam, deptParam, yearParam, categoryParam]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-8">
      <PageHeader
        title="Academic Research Papers & Theses"
        description="Search final year dissertation abstracts, research papers, and technical write-ups."
      />

      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        <div className="flex-1 max-w-2xl">
          <SearchField
            placeholder="Search theses by title, abstract keyword, or supervisor..."
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
        onRemoveFilter={(key) => {
          if (key === "type") return;
          updateParams({ [key]: null });
        }}
        onClearAll={() => router.push("/theses")}
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
            onResetFilters={() => router.push("/theses")}
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
                router.push("/theses");
                setMobileFilterOpen(false);
              }}
            />
          </div>
        )}

        <div className="lg:col-span-3 space-y-6">
          {records.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {records.map((rec) => (
                <RepositoryRecordCard key={rec.id} record={rec} />
              ))}
            </div>
          ) : (
            <EmptyState
              title="No Academic Theses Uploaded Yet"
              description="Approved final year dissertation papers and research reports will be listed here."
              icon={BookOpen}
              action={
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => router.push("/theses")}
                  className="text-xs font-semibold"
                >
                  Clear Search Filters
                </Button>
              }
            />
          )}
        </div>
      </div>
    </div>
  );
}
