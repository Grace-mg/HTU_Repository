import { Bookmark } from "@/types/bookmark";

export interface BookmarkService {
  getUserBookmarks(userId: string): Promise<Bookmark[]>;
  addBookmark(userId: string, recordId: string): Promise<Bookmark>;
  removeBookmark(userId: string, recordId: string): Promise<void>;
  isBookmarked(userId: string, recordId: string): Promise<boolean>;
}
