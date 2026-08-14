"use client";

import * as React from "react";
import Link from "next/link";
import { Bookmark, Search, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PageHeader } from "@/components/layout/page-header";
import { EmptyState } from "@/components/feedback/empty-state";
import { RepositoryRecordCard } from "@/components/projects/repository-record-card";
import { Bookmark as BookmarkType } from "@/types/bookmark";
import { SupabaseAuthService } from "@/services/supabase-auth-service";
import { SupabaseBookmarkService } from "@/services/supabase-bookmark-service";
import { getSyncAuthUser } from "@/lib/auth/client-auth";

const authService = new SupabaseAuthService();
const bookmarkService = new SupabaseBookmarkService();

export default function SavedRecordsPage() {
  const [searchQuery, setSearchQuery] = React.useState("");
  const [savedItems, setSavedItems] = React.useState<BookmarkType[]>([]);
  const [loading, setLoading] = React.useState(false);
  const [currentUserId, setCurrentUserId] = React.useState<string | null>(null);

  React.useEffect(() => {
    let isMounted = true;
    async function loadUserBookmarks() {
      try {
        const syncUser = getSyncAuthUser();
        const user = (await authService.getCurrentUser()) || syncUser;
        const uid = user?.id || syncUser?.id || "demo-user";

        if (uid && isMounted) {
          setCurrentUserId(uid);
          const bookmarks = await bookmarkService.getUserBookmarks(uid);
          if (isMounted) {
            setSavedItems(bookmarks);
          }
        }
      } catch (err) {
        console.error("[SavedRecordsPage] Failed to load bookmarks:", err);
      }
    }

    loadUserBookmarks();
    return () => {
      isMounted = false;
    };
  }, []);

  const filteredItems = React.useMemo(() => {
    if (!searchQuery.trim()) return savedItems;
    const query = searchQuery.toLowerCase();
    return savedItems.filter(
      (item) =>
        item.record?.title.toLowerCase().includes(query) ||
        item.record?.studentName.toLowerCase().includes(query)
    );
  }, [savedItems, searchQuery]);

  const handleRemoveBookmark = async (item: BookmarkType) => {
    setSavedItems((prev) => prev.filter((b) => b.id !== item.id));
    if (currentUserId && item.recordId) {
      try {
        await bookmarkService.removeBookmark(currentUserId, item.recordId);
      } catch (err) {
        console.error("[SavedRecordsPage] Failed to remove bookmark:", err);
      }
    }
  };

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <PageHeader
        title="Saved Records & Bookmarks"
        description="Access and organize your saved projects, research theses, and bookmarked academic publications."
      />

      {/* Search & Filter Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search within saved records..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 text-xs h-9"
          />
        </div>

        <div className="text-xs text-muted-foreground font-medium">
          Total Saved: <span className="font-bold text-foreground">{savedItems.length} records</span>
        </div>
      </div>

      {/* Bookmarks Grid / Empty State */}
      {loading ? (
        <div className="rounded-xl border border-border bg-card p-12 text-center text-xs text-muted-foreground">
          Loading your saved records from Supabase...
        </div>
      ) : filteredItems.length === 0 ? (
        <div className="rounded-xl border border-border bg-card p-8 sm:p-12 text-center">
          <EmptyState
            title={searchQuery ? "No Matching Saved Records" : "No Saved Records"}
            description={
              searchQuery
                ? "No bookmarked records matched your search query."
                : "You haven't bookmarked any projects or theses yet. Browse the repository to save records for quick access."
            }
            icon={Bookmark}
            action={
              <Button asChild size="sm" className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold">
                <Link href="/browse">Browse Repository</Link>
              </Button>
            }
          />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map((item) => (
            <div key={item.id} className="relative group">
              {item.record && <RepositoryRecordCard record={item.record} />}
              <Button
                type="button"
                variant="destructive"
                size="icon"
                onClick={() => handleRemoveBookmark(item)}
                className="absolute top-3 right-3 h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity z-10 shadow-sm"
                title="Remove Bookmark"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
