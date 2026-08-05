import { describe, it, expect, vi } from "vitest";
import React from "react";
import { render, screen } from "@testing-library/react";
import AdminDashboardPage from "@/app/admin/page";

// Mock next/navigation
vi.mock("next/navigation", () => ({
  usePathname: () => "/admin",
  useRouter: () => ({
    push: vi.fn(),
  }),
  useSearchParams: () => new URLSearchParams(),
}));

describe("Phase 12 Admin Dashboard Overview Tests", () => {
  it("renders Admin Control Panel heading and header actions", () => {
    render(<AdminDashboardPage />);
    expect(screen.getByRole("heading", { name: /admin control panel/i })).toBeInTheDocument();
    expect(screen.getAllByRole("link", { name: /add new record/i })[0]).toBeInTheDocument();
  });

  it("renders 4 metric summary cards", () => {
    render(<AdminDashboardPage />);
    expect(screen.getByText("Total Records")).toBeInTheDocument();
    expect(screen.getByText("Pending Approvals")).toBeInTheDocument();
    expect(screen.getByText("User Accounts")).toBeInTheDocument();
    expect(screen.getByText("Total Views")).toBeInTheDocument();
  });

  it("renders administrative quick actions and pending queue table", () => {
    render(<AdminDashboardPage />);
    expect(screen.getByText("Administrative Operations")).toBeInTheDocument();
    expect(screen.getByText(/Pending Record Approvals/i)).toBeInTheDocument();
  });
});
