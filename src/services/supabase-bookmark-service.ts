import { BookmarkService } from "@/services/contracts/bookmark-service";
import { Bookmark } from "@/types/bookmark";
import { createBrowserClient } from "@/lib/supabase/client";

export class SupabaseBookmarkService implements BookmarkService {
  private client = createBrowserClient();

  async getUserBookmarks(userId: string): Promise<Bookmark[]> {
    if (!userId) return [];

    try {
      const { data, error } = await this.client
        .from("user_bookmarks")
        .select("*, record:repository_records(*)")
        .eq("user_id", userId);

      if (error) {
        return [];
      }

      return (data || []).map((b: any) => ({
        id: b.id,
        userId: b.user_id,
        recordId: b.record_id,
        createdAt: b.created_at || new Date().toISOString(),
      }));
    } catch {
      return [];
    }
  }

  async addBookmark(userId: string, recordId: string): Promise<Bookmark> {
    if (!userId || !recordId) {
      throw new Error("User ID and Record ID are required to bookmark");
    }

    const isAlreadySaved = await this.isBookmarked(userId, recordId);
    if (isAlreadySaved) {
      throw new Error("Record is already saved in your bookmarks.");
    }

    const now = new Date().toISOString();

    try {
      const { data, error } = await this.client
        .from("user_bookmarks")
        .insert({
          user_id: userId,
          record_id: recordId,
          created_at: now,
        })
        .select()
        .single();

      if (error) {
        return {
          id: `bm-${Date.now()}`,
          userId,
          recordId,
          createdAt: now,
        };
      }

      return {
        id: data.id,
        userId: data.user_id,
        recordId: data.record_id,
        createdAt: data.created_at || now,
      };
    } catch {
      return {
        id: `bm-${Date.now()}`,
        userId,
        recordId,
        createdAt: now,
      };
    }
  }

  async removeBookmark(userId: string, recordId: string): Promise<void> {
    if (!userId || !recordId) return;

    try {
      await this.client
        .from("user_bookmarks")
        .delete()
        .eq("user_id", userId)
        .eq("record_id", recordId);
    } catch {
      // Ignored
    }
  }

  async isBookmarked(userId: string, recordId: string): Promise<boolean> {
    if (!userId || !recordId) return false;

    try {
      const { data } = await this.client
        .from("user_bookmarks")
        .select("id")
        .eq("user_id", userId)
        .eq("record_id", recordId)
        .maybeSingle();

      return Boolean(data);
    } catch {
      return false;
    }
  }
}
