import { User, UserRole } from "@/types/auth";

/**
 * Helper to check if a user has Administrator permissions.
 */
export function isAdmin(user: User | null | undefined): boolean {
  return user?.role === "ADMIN";
}

/**
 * Helper to check if a user is a standard registered user or admin.
 */
export function isUser(user: User | null | undefined): boolean {
  return user?.role === "USER" || user?.role === "ADMIN";
}

/**
 * Returns default dashboard route based on user role.
 */
export function getHomeRouteForRole(role?: UserRole): string {
  if (role === "ADMIN") {
    return "/admin";
  }
  return "/dashboard";
}

/**
 * Prevents open-redirect vulnerabilities by validating that a redirect path
 * is a relative URL starting with / and not a protocol relative // or external domain.
 */
export function sanitizeRedirectUrl(url: string | null | undefined, defaultFallback = "/dashboard"): string {
  if (!url) return defaultFallback;

  // Must start with '/' and not '//' or contain ':\' (windows drive / protocol)
  if (url.startsWith("/") && !url.startsWith("//") && !url.includes(":\\")) {
    return url;
  }

  return defaultFallback;
}
