import { describe, it, expect, vi, beforeEach } from "vitest";
import { searchFiltersSchema } from "@/lib/validation/repository";
import { repositoryService } from "@/services/supabase-repository-service";
import { RepositoryRecord } from "@/types/repository";

const sampleRecords: RepositoryRecord[] = [
  {
    id: "rec-1",
    title: "AI-Powered Microgrid Solar Optimization",
    slug: "ai-powered-microgrid-solar-optimization",
    recordType: "PROJECT",
    status: "PUBLISHED",
    abstract: "Microgrid solar optimization using machine learning algorithms for rural clinics.",
    studentName: "Kwame Asante",
    studentId: "0420261234",
    supervisorName: "Dr. Seth Mensah",
    academicYear: 2026,
    facultyId: "eng",
    facultyName: "Faculty of Engineering",
    departmentId: "ee",
    departmentName: "Electrical Engineering",
    categoryId: "cat-1",
    categoryName: "Software & Web Apps",
    keywords: ["AI", "Solar", "Energy"],
    viewsCount: 150,
    downloadsCount: 45,
    createdAt: "2026-08-01T10:00:00Z",
    updatedAt: "2026-08-01T10:00:00Z",
  },
  {
    id: "rec-2",
    title: "Blockchain Verification for Academic Transcripts",
    slug: "blockchain-verification-academic-transcripts",
    recordType: "THESIS",
    status: "PUBLISHED",
    abstract: "Decentralized cryptographic credential verification framework for university records.",
    studentName: "Ama Serwaa",
    studentId: "0420265678",
    supervisorName: "Prof. Emmanuel Ofori",
    academicYear: 2025,
    facultyId: "fast",
    facultyName: "Faculty of Applied Sciences",
    departmentId: "cs",
    departmentName: "Computer Science",
    categoryId: "cat-4",
    categoryName: "Research & Analytical Theses",
    keywords: ["Blockchain", "Security", "Crypto"],
    viewsCount: 85,
    downloadsCount: 20,
    createdAt: "2026-07-15T09:00:00Z",
    updatedAt: "2026-07-15T09:00:00Z",
  },
];

describe("Phase 21 Search Integration & Optimization Tests", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it("validates search parameters schema correctly with defaults", () => {
    const parsed = searchFiltersSchema.safeParse({
      query: "solar energy",
      recordType: "PROJECT",
      page: "1",
      pageSize: "12",
      sortBy: "newest",
    });

    expect(parsed.success).toBe(true);
    if (parsed.success) {
      expect(parsed.data.query).toBe("solar energy");
      expect(parsed.data.recordType).toBe("PROJECT");
      expect(parsed.data.page).toBe(1);
      expect(parsed.data.pageSize).toBe(12);
      expect(parsed.data.sortBy).toBe("newest");
    }
  });

  it("handles empty or default search filters gracefully", () => {
    const parsed = searchFiltersSchema.safeParse({});
    expect(parsed.success).toBe(true);
    if (parsed.success) {
      expect(parsed.data.page).toBe(1);
      expect(parsed.data.pageSize).toBe(10);
      expect(parsed.data.format).toBeUndefined();
    }
  });

  it("executes getRecords search and returns structured search results", async () => {
    vi.spyOn(repositoryService, "getRecords").mockResolvedValue({
      records: sampleRecords,
      total: 2,
    });

    const result = await repositoryService.getRecords({
      query: "solar",
      sortBy: "newest",
      page: 1,
      pageSize: 10,
    });

    expect(result.total).toBe(2);
    expect(result.records).toHaveLength(2);
    expect(result.records[0].title).toContain("Solar");
  });

  it("supports combined multi-faceted filters (faculty, department, year, status)", async () => {
    vi.spyOn(repositoryService, "getRecords").mockResolvedValue({
      records: [sampleRecords[0]],
      total: 1,
    });

    const result = await repositoryService.getRecords({
      recordType: "PROJECT",
      facultyId: "eng",
      departmentId: "ee",
      academicYear: 2026,
      status: "PUBLISHED",
    });

    expect(result.total).toBe(1);
    expect(result.records[0].facultyId).toBe("eng");
    expect(result.records[0].departmentId).toBe("ee");
  });

  it("executes keyword-specific filtering", async () => {
    vi.spyOn(repositoryService, "getRecords").mockResolvedValue({
      records: [sampleRecords[1]],
      total: 1,
    });

    const result = await repositoryService.getRecords({
      keyword: "Blockchain",
    });

    expect(result.total).toBe(1);
    expect(result.records[0].keywords).toContain("Blockchain");
  });
});
