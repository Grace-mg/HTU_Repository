export interface RepositorySettings {
  systemName: string;
  allowPublicDownloads: boolean;
  allowUserRegistration: boolean;
  maxFileUploadSizeMb: number;
  allowedFileExtensions: string[];
  contactEmail?: string;
  updatedAt: string;
}
