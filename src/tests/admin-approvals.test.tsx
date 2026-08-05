import { describe, it, expect, vi } from "vitest";
import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import AdminApprovalsPage from "@/app/admin/approvals/page";
import ApprovalDetailPage from "@/app/admin/approvals/[id]/page";
import { adminService } from "@/services/supabase-admin-service";

// Mock next/navigation
vi.mock("next/navigation", () => ({
  usePathname: () => "/admin/approvals",
  useRouter: () => ({
    push: vi.fn(),
  }),
  useSearchParams: () => new URLSearchParams(),
}));

describe("Phase 14 Admin Approval Workflow Tests", () => {
  it("renders Record Approval Queue table correctly", async () => {
    vi.spyOn(adminService, "getPendingApprovals").mockResolvedValue([
      {
        id: "rec-001",
        title: "AI-Powered Microgrid Solar Optimization",
        slug: "ai-powered-microgrid-solar-optimization",
        recordType: "PROJECT",
        status: "PENDING_HOD",
        abstract: "Solar research abstract...",
        studentName: "Kwame Asante",
        studentId: "0420261234",
        supervisorName: "Dr. Seth Mensah",
        academicYear: 2026,
        facultyId: "eng",
        facultyName: "Faculty of Engineering",
        departmentId: "eee",
        departmentName: "Electrical Engineering",
        categoryId: "cat-1",
        keywords: ["Solar"],
        viewsCount: 10,
        downloadsCount: 2,
        createdAt: "2026-08-04T09:15:00Z",
        updatedAt: "2026-08-04T09:15:00Z",
      },
    ]);

    render(<AdminApprovalsPage />);
    expect(screen.getByRole("heading", { name: /record approval queue/i })).toBeInTheDocument();
    await waitFor(() => {
      expect(screen.getByText(/AI-Powered Microgrid Solar Optimization/i)).toBeInTheDocument();
    });
  });

  it("opens rejection modal when Reject button is clicked", async () => {
    vi.spyOn(adminService, "getPendingApprovals").mockResolvedValue([
      {
        id: "rec-001",
        title: "AI-Powered Microgrid Solar Optimization",
        slug: "ai-powered-microgrid-solar-optimization",
        recordType: "PROJECT",
        status: "PENDING_HOD",
        abstract: "Solar research abstract...",
        studentName: "Kwame Asante",
        studentId: "0420261234",
        supervisorName: "Dr. Seth Mensah",
        academicYear: 2026,
        facultyId: "eng",
        facultyName: "Faculty of Engineering",
        departmentId: "eee",
        departmentName: "Electrical Engineering",
        categoryId: "cat-1",
        keywords: ["Solar"],
        viewsCount: 10,
        downloadsCount: 2,
        createdAt: "2026-08-04T09:15:00Z",
        updatedAt: "2026-08-04T09:15:00Z",
      },
    ]);

    render(<AdminApprovalsPage />);
    await waitFor(() => {
      expect(screen.getByRole("button", { name: /reject/i })).toBeInTheDocument();
    });

    const rejectButton = screen.getByRole("button", { name: /reject/i });
    fireEvent.click(rejectButton);

    expect(screen.getByText(/reject record submission/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /confirm rejection/i })).toBeInTheDocument();
  });

  it("renders Approval Detail review screen correctly", () => {
    render(<ApprovalDetailPage params={{ id: "req-101" }} />);
    expect(screen.getByText(/submission id: req-101/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /approve record/i })).toBeInTheDocument();
    expect(screen.getByText(/approval audit trail/i)).toBeInTheDocument();
  });
});
