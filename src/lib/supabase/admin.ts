import { DataSourceNotConfiguredError } from "@/lib/errors/app-error";

/**
 * Privileged Admin Supabase Client Placeholder.
 * Used exclusively for administrative mutations when backend schema is provided.
 */
export function createAdminClient() {
  return {
    auth: {
      admin: {
        listUsers: async () => ({ data: { users: [] }, error: null }),
      },
    },
    from: () => {
      throw new DataSourceNotConfiguredError();
    },
  };
}
