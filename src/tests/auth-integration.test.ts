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

import { NextRequest } from "next/server";
import { middleware } from "@/middleware";

describe("Landing Page Access Control Middleware Tests", () => {
  it("allows all users to open the landing page / directly", async () => {
    const req = new NextRequest("http://localhost:3000/");
    const res = await middleware(req);
    expect(res?.headers.get("location")).toBeNull();
  });

  it("redirects unauthenticated users trying to access protected dashboard routes to /login", async () => {
    const req = new NextRequest("http://localhost:3000/dashboard");
    const res = await middleware(req);
    expect(res?.status).toBe(307);
    expect(res?.headers.get("location")).toBe("http://localhost:3000/login?redirectTo=%2Fdashboard");
  });

  it("redirects authenticated users on /login to their appropriate dashboard", async () => {
    const req = new NextRequest("http://localhost:3000/login");
    req.cookies.set("auth-token", "valid-user-token");
    req.cookies.set("user-role", "USER");

    const res = await middleware(req);
    expect(res?.status).toBe(307);
    expect(res?.headers.get("location")).toBe("http://localhost:3000/dashboard");
  });
});

