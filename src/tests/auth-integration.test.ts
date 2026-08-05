import { describe, it, expect } from "vitest";
import { isAdmin, isUser, getHomeRouteForRole, sanitizeRedirectUrl } from "@/lib/auth/permissions";
import { User } from "@/types/auth";

describe("Phase 9 Authentication & Permission Security Helpers Tests", () => {
  const now = new Date().toISOString();

  const adminUser: User = {
    id: "admin-1",
    email: "admin@university.edu",
    name: "Admin User",
    role: "ADMIN",
    createdAt: now,
    updatedAt: now,
  };

  const normalUser: User = {
    id: "user-1",
    email: "student@university.edu",
    name: "Student User",
    role: "USER",
    createdAt: now,
    updatedAt: now,
  };

  it("identifies ADMIN role correctly", () => {
    expect(isAdmin(adminUser)).toBe(true);
    expect(isAdmin(normalUser)).toBe(false);
    expect(isAdmin(null)).toBe(false);
  });

  it("identifies USER role correctly", () => {
    expect(isUser(normalUser)).toBe(true);
    expect(isUser(adminUser)).toBe(true);
    expect(isUser(null)).toBe(false);
  });

  it("resolves correct home route per role", () => {
    expect(getHomeRouteForRole("ADMIN")).toBe("/admin");
    expect(getHomeRouteForRole("USER")).toBe("/dashboard");
    expect(getHomeRouteForRole(undefined)).toBe("/dashboard");
  });

  it("sanitizes redirect URLs to prevent open redirect vulnerabilities", () => {
    // Valid relative paths
    expect(sanitizeRedirectUrl("/dashboard")).toBe("/dashboard");
    expect(sanitizeRedirectUrl("/admin/records")).toBe("/admin/records");

    // Invalid open-redirect external paths or protocol-relative paths
    expect(sanitizeRedirectUrl("https://evil.com")).toBe("/dashboard");
    expect(sanitizeRedirectUrl("//evil.com")).toBe("/dashboard");
    expect(sanitizeRedirectUrl("C:\\Windows")).toBe("/dashboard");
    expect(sanitizeRedirectUrl(null)).toBe("/dashboard");
  });
});
