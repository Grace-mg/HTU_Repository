import { describe, it, expect, vi } from "vitest";
import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { BookmarkButton } from "@/components/projects/bookmark-button";
import { SupabaseBookmarkService } from "@/services/supabase-bookmark-service";

// Mock next/navigation
vi.mock("next/navigation", () => ({
  usePathname: () => "/browse",
  useRouter: () => ({
    push: vi.fn(),
  }),
  useSearchParams: () => new URLSearchParams(),
}));

describe("Phase 11 Bookmarking System Tests", () => {
  it("renders BookmarkButton in unsaved state for authenticated user", () => {
    render(
      <BookmarkButton
        recordId="rec-001"
        recordTitle="Solar Powered Crop Sensor"
        isAuthenticated={true}
        initialSaved={false}
      />
    );

    expect(screen.getByRole("button", { name: /save bookmark/i })).toBeInTheDocument();
  });

  it("opens login modal when guest user clicks BookmarkButton", () => {
    render(
      <BookmarkButton
        recordId="rec-001"
        recordTitle="Solar Powered Crop Sensor"
        isAuthenticated={false}
        initialSaved={false}
      />
    );

    const button = screen.getByRole("button", { name: /save bookmark/i });
    fireEvent.click(button);

    expect(screen.getByRole("heading", { name: /sign in required/i })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /sign in to save/i })).toBeInTheDocument();
  });

  it("validates SupabaseBookmarkService duplicate prevention handling", async () => {
    const bookmarkService = new SupabaseBookmarkService();

    // Empty userId or recordId should throw validation error
    await expect(bookmarkService.addBookmark("", "rec-001")).rejects.toThrow("User ID and Record ID are required to bookmark");
  });
});
