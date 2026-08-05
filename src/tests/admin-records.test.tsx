import { describe, it, expect, vi } from "vitest";
import React from "react";
import { render, screen } from "@testing-library/react";
import AdminRecordsPage from "@/app/admin/records/page";
import AddNewRecordPage from "@/app/admin/records/new/page";
import AdminRecordDetailPage from "@/app/admin/records/[id]/page";
import EditRecordPage from "@/app/admin/records/[id]/edit/page";

// Mock next/navigation
vi.mock("next/navigation", () => ({
  usePathname: () => "/admin/records",
  useRouter: () => ({
    push: vi.fn(),
  }),
  useSearchParams: () => new URLSearchParams(),
}));

describe("Phase 13 Admin Repository Management Tests", () => {
  it("renders Admin Records table page correctly", () => {
    render(<AdminRecordsPage />);
    expect(screen.getByRole("heading", { name: /repository records management/i })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /add record/i })).toBeInTheDocument();
  });

  it("renders Add New Record page correctly", () => {
    render(<AddNewRecordPage />);
    expect(screen.getByRole("heading", { name: /add new repository record/i })).toBeInTheDocument();
    expect(screen.getByLabelText(/record title/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/student name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/supervisor name/i)).toBeInTheDocument();
  });

  it("renders Admin Record Detail page correctly", () => {
    render(<AdminRecordDetailPage params={{ id: "rec-001" }} />);
    expect(screen.getByText(/IoT Solar-Powered Smart Irrigation System/i)).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /edit record/i })).toBeInTheDocument();
  });

  it("renders Edit Record page correctly", () => {
    render(<EditRecordPage params={{ id: "rec-001" }} />);
    expect(screen.getByRole("heading", { name: /edit record \(rec-001\)/i })).toBeInTheDocument();
    expect(screen.getByLabelText(/record title/i)).toBeInTheDocument();
  });
});
