import { describe, it, expect } from "vitest";
import { env } from "@/lib/env";
import { DataSourceNotConfiguredError } from "@/lib/errors/app-error";
import { createBrowserClient } from "@/lib/supabase/client";

describe("Phase 1 Foundation Setup", () => {
  it("validates environment defaults safely", () => {
    expect(env.NEXT_PUBLIC_APP_URL).toBeDefined();
    expect(env.NEXT_PUBLIC_SUPABASE_URL).toBeDefined();
  });

  it("throws DataSourceNotConfiguredError when accessing database client before schema integration", () => {
    const client = createBrowserClient();
    expect(() => client.from()).toThrow(DataSourceNotConfiguredError);
  });
});
