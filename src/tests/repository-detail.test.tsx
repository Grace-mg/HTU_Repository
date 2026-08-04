import React from "react";
import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { RecordDetailView } from "@/components/projects/record-detail-view";
import { RecordFileCard } from "@/components/projects/record-file-card";
import { RepositoryRecord } from "@/types/repository";

const mockRecord: RepositoryRecord = {
  id: "rec-101",
  title: "Commercial HVAC Energy Optimization System",
  slug: "commercial-hvac-energy-optimization-system",
  recordType: "PROJECT",
  status: "PUBLISHED",
  abstract: "Full research and prototype report on HVAC smart building energy optimization.",
  studentName: "Ama Serwaa",
  studentId: "HTU/ENG/2026/042",
  supervisorName: "Ing. Dr. Ebenezer Osei",
  academicYear: 2026,
  facultyId: "eng",
  facultyName: "Faculty of Engineering",
  departmentId: "mechanical",
  departmentName: "Mechanical Engineering",
  categoryId: "hardware",
  categoryName: "Hardware & IoT Prototypes",
  keywords: ["HVAC", "Energy Optimization", "Smart Building"],
  fileName: "HVAC_Thesis_Report.pdf",
  fileSize: 3545728,
  mimeType: "application/pdf",
  viewsCount: 180,
  downloadsCount: 52,
  createdAt: "2026-01-15T00:00:00Z",
  updatedAt: "2026-01-15T00:00:00Z",
  publishedAt: "2026-01-20T00:00:00Z",
};

describe("Phase 7 Repository Detail Page Tests", () => {
  it("renders RecordFileCard with file metadata and download button", () => {
    render(
      <RecordFileCard
        fileName="HVAC_Thesis_Report.pdf"
        fileSize={3545728}
        mimeType="application/pdf"
        recordTitle="Commercial HVAC Energy Optimization System"
      />
    );

    expect(screen.getByText("HVAC_Thesis_Report.pdf")).toBeDefined();
    expect(screen.getByText("Download Document")).toBeDefined();
    expect(screen.getByText(/3.4 MB/)).toBeDefined();
  });

  it("renders RecordDetailView with complete metadata, abstract, and keywords", () => {
    render(<RecordDetailView record={mockRecord} />);

    expect(screen.getByText("Commercial HVAC Energy Optimization System")).toBeDefined();
    expect(screen.getByText("Engineering Project")).toBeDefined();
    expect(screen.getByText(/Ama Serwaa/)).toBeDefined();
    expect(screen.getByText(/Ing. Dr. Ebenezer Osei/)).toBeDefined();
    expect(screen.getByText("Faculty of Engineering")).toBeDefined();
    expect(screen.getByText("Mechanical Engineering")).toBeDefined();
    expect(screen.getByText("HVAC")).toBeDefined();
  });
});
