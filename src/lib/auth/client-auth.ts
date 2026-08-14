/**
 * Helper to synchronously retrieve the active client user from localStorage or cookies.
 * Prevents false "unauthenticated" states while async Supabase requests are in flight.
 */
export function getSyncAuthUser(): { id: string; email: string; role: string; name: string } | null {
  if (typeof window === "undefined") return null;

  try {
    // 1. Check local storage for active user session
    const stored = localStorage.getItem("current_user");
    if (stored) {
      const parsed = JSON.parse(stored);
      if (parsed && (parsed.id || parsed.email)) {
        return {
          id: parsed.id || `usr-${Date.now()}`,
          email: parsed.email || "",
          role: parsed.role || "USER",
          name: parsed.name || parsed.full_name || "User",
        };
      }
    }
  } catch {}

  try {
    // 2. Check browser cookies for auth-token / sb-access-token
    const cookies = document.cookie.split(";").reduce((acc, cookie) => {
      const [key, val] = cookie.trim().split("=");
      if (key && val) acc[key] = decodeURIComponent(val);
      return acc;
    }, {} as Record<string, string>);

    const token = cookies["sb-access-token"] || cookies["auth-token"];
    if (token && token !== "undefined" && token !== "null") {
      return {
        id: cookies["user-id"] || `usr-${token.slice(0, 10)}`,
        email: cookies["user-email"] || "user@htu.edu.gh",
        role: cookies["user-role"] || "USER",
        name: cookies["user-name"] || "Logged-in User",
      };
    }
  } catch {}

  return null;
}
