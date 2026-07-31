import { FileUploadResult } from "@/types/file";

export interface FileService {
  uploadFile(file: File | Blob, fileName: string): Promise<FileUploadResult>;
  deleteFile(fileId: string): Promise<void>;
  getFileDownloadUrl(fileId: string): Promise<string>;
}
