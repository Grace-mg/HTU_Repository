import React from "react";
import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { RepositoryRecordCard } from "@/components/projects/repository-record-card";
import { ActiveFilterTags } from "@/components/filters/active-filter-tags";
import { BrowseFiltersSidebar } from "@/components/filters/browse-filters-sidebar";
import { RepositoryRecord } from "@/types/repository";

// Mock next/navigation
vi.mock("next/navigation", () => ({
  usePathname: () => "/browse",
  useRouter: () => ({
    push: vi.fn(),
  }),
  useSearchParams: () => new URLSearchParams(),
}));

const mockRecord: RepositoryRecord = {
  id: "rec-001",
  title: "IoT Solar-Powered Smart Irrigation System",
  slug: "iot-solar-powered-smart-irrigation-system",
  recordType: "PROJECT",
  status: "PUBLISHED",
  abstract: "An automated solar powered crop irrigation prototype with IoT sensor telemetry.",
  studentName: "Kwaku Bonsu",
  supervisorName: "Dr. Seth Mensah",
  academicYear: 2026,
  facultyId: "eng",
  facultyName: "Faculty of Engineering",
  departmentId: "agric",
  departmentName: "Agricultural Engineering",
  categoryId: "hardware",
  categoryName: "Hardware Prototype",
  keywords: ["Solar", "IoT", "Irrigation", "Agriculture"],
  viewsCount: 42,
  downloadsCount: 12,
  createdAt: "2026-01-15T00:00:00Z",
  updatedAt: "2026-01-15T00:00:00Z",
};

describe("Phase 6 Public Browse & Search Interface Tests", () => {
  it("renders RepositoryRecordCard with record details and badges", () => {
    render(<RepositoryRecordCard record={mockRecord} />);
    expect(screen.getByText("IoT Solar-Powered Smart Irrigation System")).toBeDefined();
    expect(screen.getByText("Project")).toBeDefined();
    expect(screen.getByText("Kwaku Bonsu")).toBeDefined();
    expect(screen.getByText("Supervisor: Dr. Seth Mensah")).toBeDefined();
    expect(screen.getByText("Agricultural Engineering")).toBeDefined();
    expect(screen.getByText("42 views")).toBeDefined();
  });

  it("renders ActiveFilterTags and handles filter removal and clear all", () => {
    const onRemove = vi.fn();
    const onClearAll = vi.fn();

    const filters = [
      { key: "q", label: "Search", value: "Solar" },
      { key: "department", label: "Department", value: "Agricultural Engineering" },
    ];

    render(
      <ActiveFilterTags
        filters={filters}
        onRemoveFilter={onRemove}
        onClearAll={onClearAll}
      />
    );

    expect(screen.getByText("Search:")).toBeDefined();
    expect(screen.getByText("Solar")).toBeDefined();
    expect(screen.getByText("Department:")).toBeDefined();

    const clearButton = screen.getByText(/Clear all/i);
    fireEvent.click(clearButton);
    expect(onClearAll).toHaveBeenCalledTimes(1);
  });

  it("renders BrowseFiltersSidebar with faculty, department, year, and category controls", () => {
    const onFilterChange = vi.fn();
    const onResetFilters = vi.fn();

    render(
      <BrowseFiltersSidebar
        onFilterChange={onFilterChange}
        onResetFilters={onResetFilters}
      />
    );

    expect(screen.getByText("Filter Records")).toBeDefined();
    expect(screen.getByText("Faculty")).toBeDefined();
    expect(screen.getByText("Department")).toBeDefined();
    expect(screen.getByText("Academic Year")).toBeDefined();
    expect(screen.getByText("Category")).toBeDefined();
  });
});
