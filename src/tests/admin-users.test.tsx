import { describe, it, expect, vi } from "vitest";
import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import AdminUsersPage from "@/app/admin/users/page";
import EditUserPage from "@/app/admin/users/[id]/edit/page";
import { adminService } from "@/services/supabase-admin-service";

// Mock next/navigation
vi.mock("next/navigation", () => ({
  usePathname: () => "/admin/users",
  useRouter: () => ({
    push: vi.fn(),
  }),
  useSearchParams: () => new URLSearchParams(),
}));

describe("Phase 16 Admin User & Role Management Tests", () => {
  it("renders Admin Users table page correctly", async () => {
    vi.spyOn(adminService, "getUsers").mockResolvedValue([
      {
        id: "usr-001",
        full_name: "System Administrator",
        email: "wonderdogbe595@gmail.com",
        role: "ADMIN",
        created_at: "2026-08-01T10:00:00Z",
      },
    ]);

    render(<AdminUsersPage />);
    expect(screen.getByRole("heading", { name: /user account & role management/i })).toBeInTheDocument();
    await waitFor(() => {
      expect(screen.getByText("System Administrator")).toBeInTheDocument();
      expect(screen.getByText("wonderdogbe595@gmail.com")).toBeInTheDocument();
    });
    expect(screen.getByRole("button", { name: /invite admin/i })).toBeInTheDocument();
  });

  it("opens Invite Admin modal when button is clicked", () => {
    render(<AdminUsersPage />);
    const inviteBtn = screen.getByRole("button", { name: /invite admin/i });
    fireEvent.click(inviteBtn);

    expect(screen.getByText(/invite administrator by email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/candidate email address/i)).toBeInTheDocument();
  });

  it("renders Edit User page correctly with self account information", () => {
    render(<EditUserPage params={{ id: "usr-001" }} />);
    expect(screen.getByRole("heading", { name: /edit user account \(usr-001\)/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /dispatch password reset/i })).toBeInTheDocument();
  });
});
