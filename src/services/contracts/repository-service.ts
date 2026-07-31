import { RepositoryRecord, RepositoryFilters } from "@/types/repository";
import { PaginatedResult } from "@/types/pagination";
import { CreateRepositoryRecordInput, UpdateRepositoryRecordInput } from "@/lib/validation/repository";

export interface RepositoryService {
  getRecords(filters: RepositoryFilters): Promise<PaginatedResult<RepositoryRecord>>;
  getRecordBySlug(slug: string): Promise<RepositoryRecord | null>;
  getRecordById(id: string): Promise<RepositoryRecord | null>;
  createRecord(input: CreateRepositoryRecordInput): Promise<RepositoryRecord>;
  updateRecord(id: string, input: UpdateRepositoryRecordInput): Promise<RepositoryRecord>;
  deleteRecord(id: string): Promise<void>;
  incrementViews(id: string): Promise<void>;
  incrementDownloads(id: string): Promise<void>;
}
