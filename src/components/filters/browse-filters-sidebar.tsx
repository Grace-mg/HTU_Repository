"use client";

import * as React from "react";
import { Filter, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RecordType } from "@/types/repository";
import { HTU_FACULTIES, HTU_CATEGORIES, getDepartmentsByFaculty } from "@/lib/constants/faculties-departments";

export interface FilterOption {
  id: string;
  name: string;
}

export interface BrowseFiltersSidebarProps {
  recordType?: RecordType;
  selectedFaculty?: string;
  selectedDepartment?: string;
  selectedYear?: string;
  selectedCategory?: string;
  faculties?: FilterOption[];
  categories?: FilterOption[];
  years?: string[];
  hideRecordTypeFilter?: boolean;
  onFilterChange: (filters: {
    recordType?: RecordType;
    facultyId?: string;
    departmentId?: string;
    academicYear?: string;
    categoryId?: string;
  }) => void;
  onResetFilters: () => void;
}

export function BrowseFiltersSidebar({
  recordType,
  selectedFaculty = "all",
  selectedDepartment = "all",
  selectedYear = "all",
  selectedCategory = "all",
  faculties = HTU_FACULTIES,
  categories = HTU_CATEGORIES,
  years = ["2026", "2025", "2024", "2023", "2022"],
  hideRecordTypeFilter = false,
  onFilterChange,
  onResetFilters,
}: BrowseFiltersSidebarProps) {
  const filteredDepartments = React.useMemo(() => {
    return getDepartmentsByFaculty(selectedFaculty);
  }, [selectedFaculty]);

  return (
    <aside className="w-full space-y-6 rounded-xl border border-border bg-card p-5 shadow-sm">
      <div className="flex items-center justify-between border-b border-border pb-3">
        <div className="flex items-center gap-2 font-bold text-foreground text-sm">
          <Filter className="h-4 w-4 text-blue-600" />
          <span>Filter Records</span>
        </div>

        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={onResetFilters}
          className="h-7 text-xs text-muted-foreground hover:text-foreground px-2 gap-1"
        >
          <RotateCcw className="h-3 w-3" /> Reset
        </Button>
      </div>

      {/* Record Type Filter */}
      {!hideRecordTypeFilter && (
        <div className="space-y-2">
          <label className="text-xs font-semibold text-foreground block">
            Record Type
          </label>
          <Select
            value={recordType || "all"}
            onValueChange={(val) =>
              onFilterChange({ recordType: val === "all" ? undefined : (val as RecordType) })
            }
          >
            <SelectTrigger className="h-9 text-xs">
              <SelectValue placeholder="All Record Types" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="PROJECT">Projects</SelectItem>
              <SelectItem value="THESIS">Theses</SelectItem>
            </SelectContent>
          </Select>
        </div>
      )}

      {/* Faculty Filter */}
      <div className="space-y-2">
        <label className="text-xs font-semibold text-foreground block">
          Faculty
        </label>
        <Select
          value={selectedFaculty}
          onValueChange={(val) =>
            onFilterChange({ facultyId: val === "all" ? undefined : val, departmentId: undefined })
          }
        >
          <SelectTrigger className="h-9 text-xs">
            <SelectValue placeholder="All Faculties" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Faculties</SelectItem>
            {faculties.map((fac) => (
              <SelectItem key={fac.id} value={fac.id}>
                {fac.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Department Filter (Cascades from Faculty) */}
      <div className="space-y-2">
        <label className="text-xs font-semibold text-foreground block">
          Department
        </label>
        <Select
          value={selectedDepartment}
          onValueChange={(val) =>
            onFilterChange({ departmentId: val === "all" ? undefined : val })
          }
        >
          <SelectTrigger className="h-9 text-xs">
            <SelectValue placeholder="All Departments" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Departments</SelectItem>
            {filteredDepartments.map((dept) => (
              <SelectItem key={dept.id} value={dept.id}>
                {dept.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Academic Year Filter */}
      <div className="space-y-2">
        <label className="text-xs font-semibold text-foreground block">
          Academic Year
        </label>
        <Select
          value={selectedYear}
          onValueChange={(val) =>
            onFilterChange({ academicYear: val === "all" ? undefined : val })
          }
        >
          <SelectTrigger className="h-9 text-xs">
            <SelectValue placeholder="All Academic Years" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Academic Years</SelectItem>
            {years.map((y) => (
              <SelectItem key={y} value={y}>
                {y}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Category Filter */}
      <div className="space-y-2">
        <label className="text-xs font-semibold text-foreground block">
          Category
        </label>
        <Select
          value={selectedCategory}
          onValueChange={(val) =>
            onFilterChange({ categoryId: val === "all" ? undefined : val })
          }
        >
          <SelectTrigger className="h-9 text-xs">
            <SelectValue placeholder="All Categories" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {categories.map((cat) => (
              <SelectItem key={cat.id} value={cat.id}>
                {cat.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </aside>
  );
}
