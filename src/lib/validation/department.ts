import { z } from "zod";

export const createDepartmentSchema = z.object({
  name: z.string().trim().min(2, "Department name must be at least 2 characters"),
  code: z.string().trim().min(2, "Department code must be at least 2 characters").toUpperCase(),
  facultyId: z.string().min(1, "Faculty selection is required"),
  hodName: z.string().trim().min(2, "HOD name is required"),
  hodEmail: z.string().trim().email("Invalid HOD email address"),
  isActive: z.boolean().default(true),
});

export type CreateDepartmentInput = z.infer<typeof createDepartmentSchema>;

export const updateDepartmentSchema = createDepartmentSchema.partial();

export type UpdateDepartmentInput = z.infer<typeof updateDepartmentSchema>;
