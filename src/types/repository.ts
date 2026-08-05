import { SortOrder } from "@/types/pagination";

export type RecordType = "PROJECT" | "THESIS";

export type RecordStatus =
  | "DRAFT"
  | "PUBLISHED"
  | "ARCHIVED"
  | "PENDING_REVIEW"
  | "PENDING_HOD"
  | "PENDING_DEAN"
  | "APPROVED"
  | "REJECTED";

export interface RepositoryRecord {
  id: string;
  title: string;
  slug: string;
  recordType: RecordType;
  status: RecordStatus;
  abstract: string;
  studentName: string;
  studentId?: string;
  supervisorName: string;
  academicYear: number;
  facultyId: string;
  facultyName?: string;
  departmentId: string;
  departmentName?: string;
  categoryId: string;
  categoryName?: string;
  keywords: string[];
  fileUrl?: string;
  fileName?: string;
  fileSize?: number;
  mimeType?: string;
  viewsCount: number;
  downloadsCount: number;
  createdAt: string;
  updatedAt: string;
  publishedAt?: string;
}

export interface RepositoryFilters {
  query?: string;
  recordType?: RecordType;
  facultyId?: string;
  departmentId?: string;
  categoryId?: string;
  academicYear?: number;
  keyword?: string;
  status?: RecordStatus;
  page?: number;
  pageSize?: number;
  sortBy?: string;
  sortOrder?: SortOrder;
}
