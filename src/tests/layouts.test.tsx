import React from "react";
import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { PublicHeader } from "@/components/navigation/public-header";
import { PublicFooter } from "@/components/navigation/public-footer";
import { DashboardSidebar } from "@/components/navigation/dashboard-sidebar";

// Mock next/navigation
vi.mock("next/navigation", () => ({
  usePathname: () => "/",
}));

describe("Phase 3 Layout & Navigation Tests", () => {
  it("renders PublicHeader with logo and navigation links", () => {
    render(<PublicHeader />);
    expect(screen.getAllByText("Final Year")[0]).toBeDefined();
    expect(screen.getAllByText("Repo")[0]).toBeDefined();
    expect(screen.getByText("Home")).toBeDefined();
    expect(screen.getByText("Browse")).toBeDefined();
    expect(screen.getByText("About")).toBeDefined();
    expect(screen.getByText("Contact Us")).toBeDefined();
    expect(screen.getByText("Sign Up")).toBeDefined();
  });

  it("renders PublicFooter with copyright and repository sections", () => {
    render(<PublicFooter />);
    expect(screen.getAllByText(/Final Year Repo/i)[0]).toBeDefined();
    expect(screen.getByText("Browse Records")).toBeDefined();
  });

  it("renders DashboardSidebar in user mode with active route highlighting", () => {
    render(<DashboardSidebar mode="user" />);
    expect(screen.getByText("Overview")).toBeDefined();
    expect(screen.getByText("Saved Records")).toBeDefined();
  });

  it("renders DashboardSidebar in admin mode with admin items", () => {
    render(<DashboardSidebar mode="admin" />);
    expect(screen.getByText("PROJECT-HUB Admin")).toBeDefined();
    expect(screen.getByText("Audit Logs")).toBeDefined();
  });
});
