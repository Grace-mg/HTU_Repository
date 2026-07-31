import { z } from "zod";

export const repositorySettingsSchema = z.object({
  systemName: z.string().trim().min(2, "System name is required"),
  allowPublicDownloads: z.boolean(),
  allowUserRegistration: z.boolean(),
  maxFileUploadSizeMb: z.number().min(1).max(500),
  allowedFileExtensions: z.array(z.string()).min(1, "At least one extension must be allowed"),
  contactEmail: z.string().email("Invalid email address").optional().or(z.literal("")),
});

export type RepositorySettingsInput = z.infer<typeof repositorySettingsSchema>;
