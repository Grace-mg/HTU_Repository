import { describe, it, expect } from "vitest";
import { env } from "@/lib/env";
import { createBrowserClient } from "@/lib/supabase/client";

describe("Phase 1 Foundation & Supabase Setup", () => {
  it("validates environment defaults safely", () => {
    expect(env.NEXT_PUBLIC_APP_URL).toBeDefined();
    expect(env.NEXT_PUBLIC_SUPABASE_URL).toBeDefined();
  });

  it("initializes Supabase browser client safely", () => {
    const client = createBrowserClient();
    expect(client).toBeDefined();
    expect(client.auth).toBeDefined();
    expect(client.from).toBeDefined();
  });
});
