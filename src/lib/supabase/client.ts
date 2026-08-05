import { createBrowserClient as createSSRBrowserClient } from "@supabase/ssr";

/**
 * Real Supabase Browser Client.
 * Initialized with NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY.
 */
export function createBrowserClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://placeholder.supabase.co";
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "placeholder-key";

  return createSSRBrowserClient(supabaseUrl, supabaseAnonKey);
}
