import { describe, it, expect, vi } from "vitest";
import React from "react";
import { render, screen } from "@testing-library/react";
import UserDashboardPage from "@/app/dashboard/page";
import DashboardProjectsPage from "@/app/dashboard/projects/page";
import DashboardThesesPage from "@/app/dashboard/theses/page";
import SavedRecordsPage from "@/app/dashboard/saved/page";
import ProfilePage from "@/app/dashboard/profile/page";
import SecurityPage from "@/app/dashboard/security/page";

// Mock next/navigation
vi.mock("next/navigation", () => ({
  usePathname: () => "/dashboard",
  useRouter: () => ({
    push: vi.fn(),
  }),
  useSearchParams: () => new URLSearchParams(),
}));

describe("Phase 10 User Dashboard Pages Tests", () => {
  it("renders User Dashboard Overview page correctly", () => {
    render(<UserDashboardPage />);
    expect(screen.getByRole("heading", { name: /welcome back to project hub/i })).toBeInTheDocument();
    expect(screen.getByText(/browse projects/i)).toBeInTheDocument();
    expect(screen.getByText(/browse theses/i)).toBeInTheDocument();
  });

  it("renders Dashboard Projects page correctly", () => {
    render(<DashboardProjectsPage />);
    expect(screen.getByRole("heading", { name: /student projects/i })).toBeInTheDocument();
  });

  it("renders Dashboard Theses page correctly", () => {
    render(<DashboardThesesPage />);
    expect(screen.getByRole("heading", { name: /browse.*theses/i })).toBeInTheDocument();
  });

  it("renders Saved Records page correctly", () => {
    render(<SavedRecordsPage />);
    expect(screen.getByRole("heading", { name: /saved records & bookmarks/i })).toBeInTheDocument();
    expect(screen.getByText(/no saved records/i)).toBeInTheDocument();
  });

  it("renders Profile page correctly", () => {
    render(<ProfilePage />);
    expect(screen.getByRole("heading", { name: /profile settings/i })).toBeInTheDocument();
    expect(screen.getByLabelText(/full name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email address/i)).toBeInTheDocument();
  });

  it("renders Security page correctly", () => {
    render(<SecurityPage />);
    expect(screen.getByRole("heading", { name: /security & password/i })).toBeInTheDocument();
    expect(screen.getByLabelText(/current password/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/^new password$/i)).toBeInTheDocument();
  });
});
