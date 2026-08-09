import { describe, it, expect, vi } from "vitest";
import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import AdminAnalyticsPage from "@/app/admin/analytics/page";
import AdminAuditLogsPage from "@/app/admin/audit-logs/page";

// Mock next/navigation
vi.mock("next/navigation", () => ({
  usePathname: () => "/admin/analytics",
  useRouter: () => ({
    push: vi.fn(),
  }),
  useSearchParams: () => new URLSearchParams(),
}));

describe("Phase 17 Admin Analytics & Audit Logs Tests", () => {
  it("renders Admin Analytics page correctly", () => {
    render(<AdminAnalyticsPage />);
    expect(screen.getByRole("heading", { name: /repository analytics & usage reports/i })).toBeInTheDocument();
    expect(screen.getByText("Total Record Views")).toBeInTheDocument();
    expect(screen.getByText("Most Viewed Records")).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: /export csv/i })).not.toBeInTheDocument();
  });

  it("renders Security Audit Logs page correctly", () => {
    render(<AdminAuditLogsPage />);
    expect(screen.getByRole("heading", { name: /security & system audit logs/i })).toBeInTheDocument();
    expect(screen.getAllByText("System Administrator")[0]).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /export audit log \(csv\)/i })).toBeInTheDocument();
  });
});
