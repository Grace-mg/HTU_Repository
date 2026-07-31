import { z } from "zod";

export const fileValidationSchema = z.object({
  fileName: z.string().min(1, "File name is required"),
  fileSize: z.number().max(100 * 1024 * 1024, "File size cannot exceed 100MB"),
  mimeType: z.string().refine(
    (type) =>
      [
        "application/pdf",
        "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "application/zip",
      ].includes(type),
    { message: "Unsupported file type. Only PDF, DOC, DOCX, and ZIP files are allowed." }
  ),
});

export type FileValidationInput = z.infer<typeof fileValidationSchema>;
