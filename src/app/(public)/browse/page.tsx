"use client";

import * as React from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { SearchField } from "@/components/filters/search-field";
import { BrowseFiltersSidebar } from "@/components/filters/browse-filters-sidebar";
import { ActiveFilterTags, ActiveFilterItem } from "@/components/filters/active-filter-tags";
import { EmptyState } from "@/components/feedback/empty-state";
import { PageHeader } from "@/components/layout/page-header";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FolderOpen, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { RecordType } from "@/types/repository";

export default function BrowsePage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const query = searchParams.get("q") || "";
  const typeParam = searchParams.get("type") as RecordType | undefined;
  const facultyParam = searchParams.get("faculty") || "all";
  const deptParam = searchParams.get("department") || "all";
  const yearParam = searchParams.get("year") || "all";
  const categoryParam = searchParams.get("category") || "all";
  const sortParam = searchParams.get("sort") || "newest";

  const [mobileFilterOpen, setMobileFilterOpen] = React.useState(false);

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

  // Active filter items list for active filter tags component
  const activeFilters: ActiveFilterItem[] = React.useMemo(() => {
    const list: ActiveFilterItem[] = [];
    if (query) list.push({ key: "q", label: "Search", value: query });
    if (typeParam) list.push({ key: "type", label: "Type", value: typeParam });
    if (facultyParam !== "all") list.push({ key: "faculty", label: "Faculty", value: facultyParam });
    if (deptParam !== "all") list.push({ key: "department", label: "Department", value: deptParam });
    if (yearParam !== "all") list.push({ key: "year", label: "Year", value: yearParam });
    if (categoryParam !== "all") list.push({ key: "category", label: "Category", value: categoryParam });
    return list;
  }, [query, typeParam, facultyParam, deptParam, yearParam, categoryParam]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-8">
      {/* Page Header */}
      <PageHeader
        title="Repository Records Archive"
        description="Search and explore approved final year software builds, engineering prototypes, and academic research papers."
      />

      {/* Top Search Bar & Sort Dropdown Row */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        <div className="flex-1 max-w-2xl">
          <SearchField
            placeholder="Search by title, student name, keyword, or supervisor..."
            value={query}
            onSearch={(q) => updateParams({ q })}
          />
        </div>

        <div className="flex items-center gap-3 justify-end">
          {/* Mobile Filter Drawer Button */}
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setMobileFilterOpen(!mobileFilterOpen)}
            className="lg:hidden h-10 gap-2 border-border"
          >
            <Filter className="h-4 w-4" /> Filters
          </Button>

          {/* Sort Selector */}
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
                <SelectItem value="relevance">Relevance</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Active Filter Badges */}
      <ActiveFilterTags
        filters={activeFilters}
        onRemoveFilter={(key) => updateParams({ [key]: null })}
        onClearAll={() => router.push("/browse")}
      />

      {/* Main Browse Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Desktop Sidebar Filters */}
        <div className="hidden lg:block lg:col-span-1">
          <BrowseFiltersSidebar
            recordType={typeParam}
            selectedFaculty={facultyParam}
            selectedDepartment={deptParam}
            selectedYear={yearParam}
            selectedCategory={categoryParam}
            onFilterChange={(f) => updateParams(f)}
            onResetFilters={() => router.push("/browse")}
          />
        </div>

        {/* Mobile Filters Collapsible Area */}
        {mobileFilterOpen && (
          <div className="lg:hidden col-span-1 border-b border-border pb-6">
            <BrowseFiltersSidebar
              recordType={typeParam}
              selectedFaculty={facultyParam}
              selectedDepartment={deptParam}
              selectedYear={yearParam}
              selectedCategory={categoryParam}
              onFilterChange={(f) => {
                updateParams(f);
                setMobileFilterOpen(false);
              }}
              onResetFilters={() => {
                router.push("/browse");
                setMobileFilterOpen(false);
              }}
            />
          </div>
        )}

        {/* Results Viewport */}
        <div className="lg:col-span-3 space-y-6">
          <EmptyState
            title="Data Source Not Connected"
            description="The repository data source is initialized and ready. Approved student records will be populated when Supabase integration parameters are configured."
            icon={FolderOpen}
            action={
              <Button
                variant="outline"
                size="sm"
                onClick={() => router.push("/browse")}
                className="text-xs font-semibold"
              >
                Clear Search Filters
              </Button>
            }
          />
        </div>
      </div>
    </div>
  );
}
