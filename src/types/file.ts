export interface FileMetadata {
  id: string;
  name: string;
  size: number;
  mimeType: string;
  url: string;
  uploadedAt: string;
}

export interface FileUploadResult {
  fileId: string;
  url: string;
  fileName: string;
  fileSize: number;
  mimeType: string;
}
