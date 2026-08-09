import { describe, it, expect } from "vitest";
import { loginSchema, registerSchema, createRepositoryRecordSchema } from "@/lib/validation";
import { UnconfiguredRepositoryService, UnconfiguredAuthService } from "@/services/contracts";
import { DataSourceNotConfiguredError } from "@/lib/errors/app-error";

describe("Phase 4 Domain Models & Validation Tests", () => {
  it("validates loginSchema correctly", () => {
    const valid = loginSchema.safeParse({
      email: "student@university.edu",
      password: "SecretPassword123",
    });
    expect(valid.success).toBe(true);

    const invalid = loginSchema.safeParse({
      email: "not-an-email",
      password: "",
    });
    expect(invalid.success).toBe(false);
  });

  it("validates registerSchema and enforces @htu.edu.gh domain restriction", () => {
    const valid = registerSchema.safeParse({
      name: "John Doe",
      email: "john@htu.edu.gh",
      password: "Password123",
      confirmPassword: "Password123",
      terms: true,
    });
    expect(valid.success).toBe(true);

    const nonHtuEmail = registerSchema.safeParse({
      name: "John Doe",
      email: "john@gmail.com",
      password: "Password123",
      confirmPassword: "Password123",
      terms: true,
    });
    expect(nonHtuEmail.success).toBe(false);

    const mismatch = registerSchema.safeParse({
      name: "John Doe",
      email: "john@htu.edu.gh",
      password: "Password123",
      confirmPassword: "DifferentPassword123",
      terms: true,
    });
    expect(mismatch.success).toBe(false);

    const noTerms = registerSchema.safeParse({
      name: "John Doe",
      email: "john@htu.edu.gh",
      password: "Password123",
      confirmPassword: "Password123",
      terms: false,
    });
    expect(noTerms.success).toBe(false);
  });

  it("validates createRepositoryRecordSchema correctly", () => {
    const valid = createRepositoryRecordSchema.safeParse({
      title: "Machine Learning in Academic Repositories",
      recordType: "THESIS",
      status: "DRAFT",
      abstract: "This thesis presents a novel approach to organizing academic thesis documents using automated classification algorithms.",
      studentName: "Jane Smith",
      studentId: "STU-2024-001",
      supervisorName: "Dr. Alan Turing",
      academicYear: 2024,
      facultyId: "fac-1",
      departmentId: "dept-1",
      categoryId: "cat-1",
      keywords: ["Machine Learning", "NLP", "Academic Repository"],
    });
    expect(valid.success).toBe(true);
  });

  it("throws DataSourceNotConfiguredError when unconfigured service methods are called", async () => {
    const repoService = new UnconfiguredRepositoryService();
    await expect(repoService.getRecords({})).rejects.toThrow(DataSourceNotConfiguredError);

    const authService = new UnconfiguredAuthService();
    await expect(authService.login({ email: "test@test.com", password: "pwd" })).rejects.toThrow(DataSourceNotConfiguredError);
  });
});
