import { describe, it, expect } from "vitest";
import { env } from "@/lib/env";
import { isAdmin, isUser, sanitizeRedirectUrl } from "@/lib/auth/permissions";
import { createBrowserClient } from "@/lib/supabase/client";
import { createAdminClient } from "@/lib/supabase/admin";
import { User } from "@/types/auth";

describe("Phase 20 Production Readiness & System Integration", () => {
  it("validates production environment variables", () => {
    expect(env.NEXT_PUBLIC_APP_URL).toBeDefined();
    expect(env.NEXT_PUBLIC_SUPABASE_URL).toBeDefined();
  });

  it("verifies security permissions & open-redirect sanitization", () => {
    const mockAdmin: User = {
      id: "usr-admin",
      email: "admin@htu.edu.gh",
      name: "Admin",
      role: "ADMIN",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const mockUser: User = {
      id: "usr-student",
      email: "student@htu.edu.gh",
      name: "Student",
      role: "USER",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    expect(isAdmin(mockAdmin)).toBe(true);
    expect(isAdmin(mockUser)).toBe(false);
    expect(isUser(mockUser)).toBe(true);

    // Verify open-redirect prevention logic
    expect(sanitizeRedirectUrl("https://evil.com")).toBe("/dashboard");
    expect(sanitizeRedirectUrl("//malicious.org")).toBe("/dashboard");
    expect(sanitizeRedirectUrl("/admin/records")).toBe("/admin/records");
  });

  it("initializes Supabase browser and admin clients safely", () => {
    const browserClient = createBrowserClient();
    expect(browserClient).toBeDefined();
    expect(browserClient.auth).toBeDefined();

    const adminClient = createAdminClient();
    expect(adminClient).toBeDefined();
    expect(adminClient.auth.admin).toBeDefined();
  });
});
