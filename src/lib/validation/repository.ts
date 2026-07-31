import { z } from "zod";

export const recordTypeEnum = z.enum(["PROJECT", "THESIS"]);
export const recordStatusEnum = z.enum(["DRAFT", "PUBLISHED", "ARCHIVED", "PENDING_REVIEW"]);

export const createRepositoryRecordSchema = z.object({
  title: z.string().trim().min(3, "Title must be at least 3 characters").max(300, "Title is too long"),
  recordType: recordTypeEnum,
  status: recordStatusEnum.default("DRAFT"),
  abstract: z.string().trim().min(20, "Abstract must be at least 20 characters"),
  studentName: z.string().trim().min(2, "Student name is required"),
  studentId: z.string().trim().optional(),
  supervisorName: z.string().trim().min(2, "Supervisor name is required"),
  academicYear: z
    .number({ invalid_type_error: "Academic year must be a number" })
    .int()
    .min(2000, "Academic year must be after 2000")
    .max(new Date().getFullYear() + 1, "Academic year cannot be in the future"),
  facultyId: z.string().min(1, "Faculty selection is required"),
  departmentId: z.string().min(1, "Department selection is required"),
  categoryId: z.string().min(1, "Category selection is required"),
  keywords: z.array(z.string().trim().min(1)).min(1, "At least one keyword is required"),
});

export type CreateRepositoryRecordInput = z.infer<typeof createRepositoryRecordSchema>;

export const updateRepositoryRecordSchema = createRepositoryRecordSchema.partial();

export type UpdateRepositoryRecordInput = z.infer<typeof updateRepositoryRecordSchema>;

export const searchFiltersSchema = z.object({
  query: z.string().optional(),
  recordType: recordTypeEnum.optional(),
  facultyId: z.string().optional(),
  departmentId: z.string().optional(),
  categoryId: z.string().optional(),
  academicYear: z.coerce.number().optional(),
  keyword: z.string().optional(),
  status: recordStatusEnum.optional(),
  page: z.coerce.number().int().positive().default(1),
  pageSize: z.coerce.number().int().positive().max(100).default(10),
  sortBy: z.string().optional(),
  sortOrder: z.enum(["asc", "desc"]).optional(),
});

export type SearchFiltersInput = z.infer<typeof searchFiltersSchema>;

export const exportFiltersSchema = z.object({
  recordType: recordTypeEnum.optional(),
  facultyId: z.string().optional(),
  departmentId: z.string().optional(),
  categoryId: z.string().optional(),
  academicYear: z.coerce.number().optional(),
  status: recordStatusEnum.optional(),
  format: z.enum(["csv", "json"]).default("csv"),
});

export type ExportFiltersInput = z.infer<typeof exportFiltersSchema>;
