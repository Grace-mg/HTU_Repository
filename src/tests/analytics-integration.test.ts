import { describe, it, expect, vi, beforeEach } from "vitest";
import { SupabaseRepositoryService } from "@/services/supabase-repository-service";

// Mock Supabase client
vi.mock("@/lib/supabase/client", () => {
  return {
    createBrowserClient: vi.fn(() => ({
      from: vi.fn((table: string) => {
        if (table === "repository_records") {
          return {
            select: vi.fn().mockReturnThis(),
            in: vi.fn().mockReturnThis(),
            order: vi.fn().mockReturnThis(),
            limit: vi.fn().mockImplementation((n: number) =>
              Promise.resolve({
                data: Array.from({ length: n }).map((_, i) => ({
                  id: `rec-${i + 1}`,
                  title: `Popular Record ${i + 1}`,
                  slug: `popular-record-${i + 1}`,
                  record_type: "PROJECT",
                  status: "PUBLISHED",
                  views_count: 500 - i * 50,
                  downloads_count: 100 - i * 10,
                  created_at: "2026-01-01T00:00:00Z",
                  updated_at: "2026-01-01T00:00:00Z",
                })),
                error: null,
              })
            ),
            eq: vi.fn().mockReturnThis(),
            single: vi.fn().mockResolvedValue({
              data: { views_count: 10, downloads_count: 5 },
              error: null,
            }),
            update: vi.fn().mockReturnThis(),
          };
        }
        return {};
      }),
    })),
  };
});

describe("Phase 22: Analytics & View Counter Integration Tests", () => {
  let service: SupabaseRepositoryService;

  beforeEach(() => {
    service = new SupabaseRepositoryService();
  });

  it("should fetch top records sorted by views_count with default limit", async () => {
    const topRecords = await service.getTopRecords(3);
    expect(topRecords).toHaveLength(3);
    expect(topRecords[0].title).toBe("Popular Record 1");
    expect(topRecords[0].viewsCount).toBe(500);
  });

  it("should calculate analytics summary metrics correctly", async () => {
    // Mock data return for getAnalyticsSummary
    const mockData = [
      { record_type: "PROJECT", views_count: 100, downloads_count: 20, status: "PUBLISHED" },
      { record_type: "PROJECT", views_count: 150, downloads_count: 30, status: "APPROVED" },
      { record_type: "THESIS", views_count: 200, downloads_count: 50, status: "PUBLISHED" },
      { record_type: "THESIS", views_count: 50, downloads_count: 10, status: "DRAFT" },
    ];

    // Spy on client
    vi.spyOn(service["client"], "from").mockReturnValue({
      select: vi.fn().mockResolvedValue({ data: mockData, error: null }),
    } as any);

    const summary = await service.getAnalyticsSummary();
    expect(summary.totalRecords).toBe(4);
    expect(summary.totalViews).toBe(500);
    expect(summary.totalDownloads).toBe(110);
    expect(summary.publishedProjects).toBe(2);
    expect(summary.publishedTheses).toBe(1);
  });

  it("should execute incrementViews without error", async () => {
    await expect(service.incrementViews("rec-1")).resolves.not.toThrow();
  });

  it("should execute incrementDownloads without error", async () => {
    await expect(service.incrementDownloads("rec-1")).resolves.not.toThrow();
  });
});
