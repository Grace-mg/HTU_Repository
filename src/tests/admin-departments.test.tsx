import { describe, it, expect, vi } from "vitest";
import React from "react";
import { render, screen } from "@testing-library/react";
import AdminDepartmentsPage from "@/app/admin/departments/page";
import AddDepartmentPage from "@/app/admin/departments/new/page";
import EditDepartmentPage from "@/app/admin/departments/[id]/edit/page";

// Mock next/navigation
vi.mock("next/navigation", () => ({
  usePathname: () => "/admin/departments",
  useRouter: () => ({
    push: vi.fn(),
  }),
  useSearchParams: () => new URLSearchParams(),
}));

describe("Phase 15 Admin Department Management Tests", () => {
  it("renders Admin Departments table page correctly", () => {
    render(<AdminDepartmentsPage />);
    expect(screen.getByRole("heading", { name: /department & faculty management/i })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /add department/i })).toBeInTheDocument();
    expect(screen.getByText(/no departments created yet/i)).toBeInTheDocument();
  });

  it("renders Add Department page correctly", () => {
    render(<AddDepartmentPage />);
    expect(screen.getByRole("heading", { name: /add new department/i })).toBeInTheDocument();
    expect(screen.getByLabelText(/department name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/department code/i)).toBeInTheDocument();
  });

  it("renders Edit Department page correctly", () => {
    render(<EditDepartmentPage params={{ id: "dept-cs" }} />);
    expect(screen.getByRole("heading", { name: /edit department \(dept-cs\)/i })).toBeInTheDocument();
    expect(screen.getByLabelText(/department name/i)).toBeInTheDocument();
  });
});
