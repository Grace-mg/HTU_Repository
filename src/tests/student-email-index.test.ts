import { describe, it, expect } from "vitest";
import { extractStudentIdFromEmail } from "@/lib/utils/student";
import { SupabaseAuthService } from "@/services/supabase-auth-service";

describe("Student Index Number from Email Extraction", () => {
  it("extracts digits correctly from student emails", () => {
    expect(extractStudentIdFromEmail("0420261234@htu.edu.gh")).toBe("0420261234");
    expect(extractStudentIdFromEmail("student0420265678@student.htu.edu.gh")).toBe("0420265678");
    expect(extractStudentIdFromEmail("04-2026-9999@htu.edu.gh")).toBe("0420269999");
    expect(extractStudentIdFromEmail("john.doe@htu.edu.gh")).toBe("");
    expect(extractStudentIdFromEmail("")).toBe("");
  });

  it("populates studentId when user logs in via SupabaseAuthService", async () => {
    const authService = new SupabaseAuthService();
    const session = await authService.login({
      email: "0420261234@htu.edu.gh",
      password: "password123",
    });

    expect(session.user.studentId).toBe("0420261234");
  });
});
