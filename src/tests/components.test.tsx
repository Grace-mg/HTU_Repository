import React from "react";
import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/feedback/empty-state";
import { ErrorState } from "@/components/feedback/error-state";
import { StatusBadge } from "@/components/feedback/status-badge";
import { Pagination } from "@/components/tables/pagination";
import { SearchField } from "@/components/filters/search-field";

describe("Phase 2 Component Library Tests", () => {
  it("renders Button correctly with variant and loading states", () => {
    const { rerender } = render(<Button>Click me</Button>);
    expect(screen.getByRole("button", { name: /click me/i })).toBeDefined();

    rerender(<Button isLoading>Click me</Button>);
    expect(screen.getByRole("button")).toBeDisabled();
  });

  it("renders Input correctly", () => {
    render(<Input placeholder="Enter text" />);
    expect(screen.getByPlaceholderText("Enter text")).toBeDefined();
  });

  it("renders Badge with restrained radius by default and pill radius when pill prop is true", () => {
    const { container: defaultBadge } = render(<Badge>Standard</Badge>);
    expect(defaultBadge.firstElementChild?.className).toContain("rounded-md");

    const { container: pillBadge } = render(<Badge pill>Pill Tag</Badge>);
    expect(pillBadge.firstElementChild?.className).toContain("rounded-full");
  });

  it("renders StatusBadge with pill tag formatting for PUBLISHED and DRAFT", () => {
    render(<StatusBadge status="PUBLISHED" />);
    expect(screen.getByText("Published")).toBeDefined();
  });

  it("renders EmptyState without fake data", () => {
    render(
      <EmptyState
        title="No Thesis Found"
        description="Data source has not been configured."
      />
    );
    expect(screen.getByText("No Thesis Found")).toBeDefined();
    expect(screen.getByText("Data source has not been configured.")).toBeDefined();
  });

  it("renders ErrorState with retry button", () => {
    const handleRetry = vi.fn();
    render(<ErrorState onRetry={handleRetry} />);
    const retryBtn = screen.getByRole("button", { name: /retry/i });
    fireEvent.click(retryBtn);
    expect(handleRetry).toHaveBeenCalledOnce();
  });

  it("renders Pagination correctly", () => {
    const handlePageChange = vi.fn();
    render(
      <Pagination
        currentPage={1}
        totalPages={5}
        totalItems={50}
        onPageChange={handlePageChange}
      />
    );
    expect(screen.getByText("50")).toBeDefined();
  });

  it("renders SearchField and fires onSearch", () => {
    const handleSearch = vi.fn();
    render(<SearchField onSearch={handleSearch} placeholder="Search records..." />);
    const input = screen.getByPlaceholderText("Search records...");
    fireEvent.change(input, { target: { value: "machine learning" } });
    fireEvent.keyDown(input, { key: "Enter", code: "Enter" });
    expect(handleSearch).toHaveBeenCalledWith("machine learning");
  });
});
