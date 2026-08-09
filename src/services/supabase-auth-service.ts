import { AuthService } from "@/services/contracts/auth-service";
import { User, AuthSession } from "@/types/auth";
import { LoginInput, RegisterInput, ForgotPasswordInput, ResetPasswordInput } from "@/lib/validation/auth";
import { createBrowserClient } from "@/lib/supabase/client";

export class SupabaseAuthService implements AuthService {
  private client = createBrowserClient();

  private formatError(err: any): Error {
    const message = err?.message || "";
    if (message === "Failed to fetch" || message.includes("Failed to fetch") || err?.name === "TypeError") {
      return new Error(
        "Unable to connect to the authentication server. Please check your network connection or verify that your Supabase service is active."
      );
    }
    return err instanceof Error ? err : new Error(message || "An unexpected authentication error occurred.");
  }

  async login(input: LoginInput): Promise<AuthSession> {
    try {
      const response = await this.client.auth.signInWithPassword({
        email: input.email,
        password: input.password,
      });

      if (response?.error) {
        throw new Error(response.error.message);
      }

      const session = response?.data?.session;
      const user = response?.data?.user;

      const now = new Date().toISOString();

      return {
        accessToken: session?.access_token || "token",
        expiresAt: session?.expires_at || 0,
        user: {
          id: user?.id || "user-id",
          email: user?.email || input.email,
          name: user?.user_metadata?.full_name || input.email.split("@")[0],
          role: (user?.user_metadata?.role as "ADMIN" | "USER") || "USER",
          createdAt: user?.created_at || now,
          updatedAt: now,
        },
      };
    } catch (err: any) {
      throw this.formatError(err);
    }
  }

  async register(input: RegisterInput): Promise<User> {
    const redirectUrl = typeof window !== "undefined" ? `${window.location.origin}/auth/callback` : undefined;

    try {
      const response = await this.client.auth.signUp({
        email: input.email,
        password: input.password,
        options: {
          emailRedirectTo: redirectUrl,
          data: {
            full_name: input.name,
            role: "USER", // Mandatory rule: New registrations default to standard USER
          },
        },
      });

      if (response?.error) {
        throw new Error(response.error.message);
      }

      const now = new Date().toISOString();

      return {
        id: response?.data?.user?.id || "temp-id",
        email: response?.data?.user?.email || input.email,
        name: input.name,
        role: "USER",
        createdAt: now,
        updatedAt: now,
      };
    } catch (err: any) {
      throw this.formatError(err);
    }
  }

  async logout(): Promise<void> {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      await this.client.auth.signOut();
    } catch (err) {
      console.error("[Logout Exception]", err);
    }

    if (typeof window !== "undefined") {
      // Force expire all auth cookies so middleware does not redirect back
      document.cookie = "auth-token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; max-age=0";
      document.cookie = "user-role=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; max-age=0";
      document.cookie = "sb-access-token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; max-age=0";
      document.cookie = "sb-refresh-token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; max-age=0";

      window.localStorage.clear();
      window.sessionStorage.clear();
    }
  }

  async forgotPassword(input: ForgotPasswordInput): Promise<void> {
    try {
      const response = await this.client.auth.resetPasswordForEmail(input.email);
      if (response?.error) {
        throw new Error(response.error.message);
      }
    } catch (err: any) {
      throw this.formatError(err);
    }
  }

  async resetPassword(input: ResetPasswordInput): Promise<void> {
    try {
      const response = await this.client.auth.updateUser({
        password: input.password,
      });
      if (response?.error) {
        throw new Error(response.error.message);
      }
    } catch (err: any) {
      throw this.formatError(err);
    }
  }

  async inviteAdminByEmail(email: string, fullName?: string): Promise<void> {
    const redirectUrl = typeof window !== "undefined" ? `${window.location.origin}/reset-password` : undefined;
    try {
      const response = await this.client.auth.resetPasswordForEmail(email, {
        redirectTo: redirectUrl,
      });

      if (response?.error) {
        throw new Error(response.error.message);
      }
    } catch (err: any) {
      throw this.formatError(err);
    }
  }

  async getCurrentUser(): Promise<User | null> {
    try {
      const response = await this.client.auth.getUser();
      const user = response?.data?.user;
      if (!user) return null;

      const now = new Date().toISOString();

      return {
        id: user.id,
        email: user.email || "",
        name: user.user_metadata?.full_name || "User",
        role: (user.user_metadata?.role as "ADMIN" | "USER") || "USER",
        createdAt: user.created_at || now,
        updatedAt: now,
      };
    } catch (err) {
      return null;
    }
  }

  async getSession(): Promise<AuthSession | null> {
    try {
      const response = await this.client.auth.getSession();
      const session = response?.data?.session;
      if (!session) return null;

      const now = new Date().toISOString();

      return {
        accessToken: session.access_token,
        expiresAt: session.expires_at || 0,
        user: {
          id: session.user.id,
          email: session.user.email || "",
          name: session.user.user_metadata?.full_name || "User",
          role: (session.user.role as "ADMIN" | "USER") || (session.user.user_metadata?.role as "ADMIN" | "USER") || "USER",
          createdAt: session.user.created_at || now,
          updatedAt: now,
        },
      };
    } catch (err) {
      return null;
    }
  }
}

export const authService = new SupabaseAuthService();

