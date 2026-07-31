import { z } from "zod";

export const facultySchema = z.object({
  name: z.string().trim().min(2, "Faculty name is required"),
  code: z
    .string()
    .trim()
    .min(2, "Faculty code is required")
    .transform((val) => val.toUpperCase()),
  description: z.string().optional(),
});

export type FacultyInput = z.infer<typeof facultySchema>;

export const departmentSchema = z.object({
  facultyId: z.string().min(1, "Faculty is required"),
  name: z.string().trim().min(2, "Department name is required"),
  code: z
    .string()
    .trim()
    .min(2, "Department code is required")
    .transform((val) => val.toUpperCase()),
  description: z.string().optional(),
});

export type DepartmentInput = z.infer<typeof departmentSchema>;

export const categorySchema = z.object({
  name: z.string().trim().min(2, "Category name is required"),
  description: z.string().optional(),
});

export type CategoryInput = z.infer<typeof categorySchema>;
