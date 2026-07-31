import { DataSourceNotConfiguredError } from "@/lib/errors/app-error";

/**
 * Server Supabase Client Boundary Placeholder.
 * Connected to actual Supabase client once schema & auth parameters are provided in Phase 19/20.
 */
export async function createServerClient() {
  return {
    auth: {
      getUser: async () => ({ data: { user: null }, error: null }),
      getSession: async () => ({ data: { session: null }, error: null }),
    },
    from: () => {
      throw new DataSourceNotConfiguredError();
    },
    storage: {
      from: () => {
        throw new DataSourceNotConfiguredError();
      },
    },
  };
}
