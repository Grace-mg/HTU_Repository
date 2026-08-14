import { BookmarkService } from "@/services/contracts/bookmark-service";
import { Bookmark } from "@/types/bookmark";
import { createBrowserClient } from "@/lib/supabase/client";
import { mapRowToRecord, SupabaseRepositoryService } from "@/services/supabase-repository-service";
import { RepositoryRecord } from "@/types/repository";

const repoService = new SupabaseRepositoryService();

function createFallbackRecord(recordId: string): RepositoryRecord {
  const formattedTitle = recordId.replace(/[-_]/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
  return {
    id: recordId,
    title: formattedTitle,
    slug: recordId,
    recordType: recordId.toLowerCase().includes("thesis") ? "THESIS" : "PROJECT",
    status: "PUBLISHED",
    abstract: "Bookmarked research thesis & project documentation from Ho Technical University repository.",
    studentName: "Student Author",
    studentId: "HTU/2026/BOOKMARK",
    supervisorName: "Academic Supervisor",
    academicYear: 2026,
    facultyId: "fast",
    facultyName: "Faculty of Applied Sciences & Tech",
    departmentId: "cs",
    departmentName: "Computer Science & IT",
    categoryId: "software",
    categoryName: "Software & Web Apps",
    keywords: ["Saved Record", "Bookmarked", "HTU Repository"],
    viewsCount: 15,
    downloadsCount: 5,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    publishedAt: new Date().toISOString(),
  };
}

export class SupabaseBookmarkService implements BookmarkService {
  private client = createBrowserClient();

  private getLocalBookmarks(userId: string): Bookmark[] {
    if (typeof window === "undefined" || !userId) return [];
    try {
      const key = `local_user_bookmarks_${userId}`;
      const stored = localStorage.getItem(key) || localStorage.getItem("local_user_bookmarks");
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch {}
    return [];
  }

  private saveLocalBookmark(userId: string, recordId: string): Bookmark {
    const now = new Date().toISOString();
    const newBm: Bookmark = {
      id: `bm-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      userId,
      recordId,
      createdAt: now,
    };

    if (typeof window !== "undefined") {
      try {
        const key = `local_user_bookmarks_${userId}`;
        const existing = this.getLocalBookmarks(userId);
        if (!existing.some((b) => b.recordId === recordId)) {
          existing.push(newBm);
          localStorage.setItem(key, JSON.stringify(existing));
          localStorage.setItem("local_user_bookmarks", JSON.stringify(existing));
        }
      } catch {}
    }
    return newBm;
  }

  private removeLocalBookmark(userId: string, recordId: string): void {
    if (typeof window === "undefined") return;
    try {
      const key = `local_user_bookmarks_${userId}`;
      const existing = this.getLocalBookmarks(userId);
      const filtered = existing.filter((b) => b.recordId !== recordId);
      localStorage.setItem(key, JSON.stringify(filtered));
      localStorage.setItem("local_user_bookmarks", JSON.stringify(filtered));
    } catch {}
  }

  async getUserBookmarks(userId: string): Promise<Bookmark[]> {
    if (!userId) return [];

    let dbBookmarks: Bookmark[] = [];

    // 1. Try querying Supabase user_bookmarks table
    try {
      const { data, error } = await this.client
        .from("user_bookmarks")
        .select("*, record:repository_records(*, faculties(name), departments(name), categories(name))")
        .eq("user_id", userId);

      if (!error && data) {
        dbBookmarks = data.map((b: any) => ({
          id: b.id,
          userId: b.user_id,
          recordId: b.record_id,
          createdAt: b.created_at || new Date().toISOString(),
          record: b.record ? mapRowToRecord(b.record) : undefined,
        }));
      }
    } catch {}

    // 2. Read local storage bookmarks for this user
    const localBms = this.getLocalBookmarks(userId);

    // 3. Merge DB and local bookmarks by recordId
    const bookmarkMap = new Map<string, Bookmark>();

    localBms.forEach((b) => bookmarkMap.set(b.recordId, b));
    dbBookmarks.forEach((b) => bookmarkMap.set(b.recordId, b));

    const combinedList = Array.from(bookmarkMap.values());

    // 4. Resolve full record details for each bookmark if not already present
    const resolvedBookmarks = await Promise.all(
      combinedList.map(async (b) => {
        if (b.record) return b;

        // Attempt resolving record via repositoryService
        try {
          const rec = (await repoService.getRecordById(b.recordId)) || (await repoService.getRecordBySlug(b.recordId));
          if (rec) {
            return { ...b, record: rec };
          }
        } catch {}

        // Fallback demo record if not found
        return {
          ...b,
          record: createFallbackRecord(b.recordId),
        };
      })
    );

    return resolvedBookmarks;
  }

  async addBookmark(userId: string, recordId: string): Promise<Bookmark> {
    if (!userId || !recordId) {
      throw new Error("User ID and Record ID are required to bookmark");
    }

    // Always save locally for instant responsiveness & offline support
    const localBm = this.saveLocalBookmark(userId, recordId);

    // Attempt DB insertion
    try {
      const { data, error } = await this.client
        .from("user_bookmarks")
        .insert({
          user_id: userId,
          record_id: recordId,
          created_at: localBm.createdAt,
        })
        .select()
        .single();

      if (!error && data) {
        return {
          id: data.id,
          userId: data.user_id,
          recordId: data.record_id,
          createdAt: data.created_at || localBm.createdAt,
        };
      }
    } catch {}

    return localBm;
  }

  async removeBookmark(userId: string, recordId: string): Promise<void> {
    if (!userId || !recordId) return;

    // Always remove from local storage
    this.removeLocalBookmark(userId, recordId);

    // Attempt DB deletion
    try {
      await this.client
        .from("user_bookmarks")
        .delete()
        .eq("user_id", userId)
        .eq("record_id", recordId);
    } catch {}
  }

  async isBookmarked(userId: string, recordId: string): Promise<boolean> {
    if (!userId || !recordId) return false;

    // Check local storage first
    const localList = this.getLocalBookmarks(userId);
    if (localList.some((b) => b.recordId === recordId)) {
      return true;
    }

    // Check DB
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
