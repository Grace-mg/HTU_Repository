import { describe, it, expect } from "vitest";
import { env } from "@/lib/env";
import { isAdmin, isUser, getHomeRouteForRole, sanitizeRedirectUrl } from "@/lib/auth/permissions";
import { User } from "@/types/auth";

describe("Phase 23: Production Readiness & System Security Audit", () => {
  it("should validate mandatory system environment variables without throwing", () => {
    expect(env.NEXT_PUBLIC_SUPABASE_URL).toBeDefined();
    expect(env.NEXT_PUBLIC_SUPABASE_ANON_KEY).toBeDefined();
    expect(env.NEXT_PUBLIC_APP_URL).toBeDefined();
  });

  it("should evaluate role-based permission helpers securely", () => {
    const adminUser: User = {
      id: "1",
      email: "admin@htu.edu.gh",
      name: "System Admin",
      role: "ADMIN",
      createdAt: "2026-01-01T00:00:00Z",
      updatedAt: "2026-01-01T00:00:00Z",
    };

    const standardUser: User = {
      id: "2",
      email: "student@htu.edu.gh",
      name: "Graduating Student",
      role: "USER",
      createdAt: "2026-01-01T00:00:00Z",
      updatedAt: "2026-01-01T00:00:00Z",
    };

    expect(isAdmin(adminUser)).toBe(true);
    expect(isAdmin(standardUser)).toBe(false);
    expect(isUser(standardUser)).toBe(true);
    expect(isUser(null)).toBe(false);

    expect(getHomeRouteForRole("ADMIN")).toBe("/admin");
    expect(getHomeRouteForRole("USER")).toBe("/dashboard");
  });

  it("should enforce redirect URL sanitization to prevent open-redirect vulnerabilities", () => {
    expect(sanitizeRedirectUrl("/dashboard/projects")).toBe("/dashboard/projects");
    expect(sanitizeRedirectUrl("https://malicious-site.com")).toBe("/dashboard");
    expect(sanitizeRedirectUrl("//malicious-site.com")).toBe("/dashboard");
    expect(sanitizeRedirectUrl(null)).toBe("/dashboard");
  });
});
