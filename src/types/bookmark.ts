import { RepositoryRecord } from "@/types/repository";

export interface Bookmark {
  id: string;
  userId: string;
  recordId: string;
  record?: RepositoryRecord;
  createdAt: string;
}
