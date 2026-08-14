"use client";

import * as React from "react";
import Link from "next/link";
import { Bookmark, Lock, LogIn, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { SupabaseAuthService } from "@/services/supabase-auth-service";
import { SupabaseBookmarkService } from "@/services/supabase-bookmark-service";
import { isRecordApproved } from "@/lib/auth/record-permissions";
import { getSyncAuthUser } from "@/lib/auth/client-auth";

const authService = new SupabaseAuthService();
const bookmarkService = new SupabaseBookmarkService();

export interface BookmarkButtonProps {
  recordId: string;
  recordTitle?: string;
  recordStatus?: string;
  initialSaved?: boolean;
  isAuthenticated?: boolean;
  compact?: boolean;
  onToggleSave?: (saved: boolean) => void;
}

export const BookmarkButton = React.memo(function BookmarkButton({
  recordId,
  recordTitle,
  recordStatus,
  initialSaved = false,
  isAuthenticated: propIsAuthenticated,
  compact = false,
  onToggleSave,
}: BookmarkButtonProps) {
  const [saved, setSaved] = React.useState(initialSaved);
  const [showLoginModal, setShowLoginModal] = React.useState(false);
  const [showUnapprovedModal, setShowUnapprovedModal] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);

  // Synchronous initial auth check to eliminate false logout states
  const [currentUser, setCurrentUser] = React.useState<any | null>(() => getSyncAuthUser());

  // Asynchronous auth sync & database bookmark check on mount
  React.useEffect(() => {
    let isMounted = true;

    async function checkAuthAndBookmark() {
      try {
        const syncUser = getSyncAuthUser();
        const user = (await authService.getCurrentUser()) || syncUser;
        if (!isMounted) return;

        if (user) {
          setCurrentUser(user);
          if (recordId) {
            const isSavedInDb = await bookmarkService.isBookmarked(user.id, recordId);
            if (isMounted) {
              setSaved(isSavedInDb);
            }
          }
        }
      } catch (err) {
        console.error("[BookmarkButton] Auth check error:", err);
      }
    }

    checkAuthAndBookmark();

    return () => {
      isMounted = false;
    };
  }, [recordId]);

  // Determine effective user session
  const activeUser = currentUser || getSyncAuthUser();
  const effectiveIsAuthenticated =
    typeof propIsAuthenticated === "boolean" ? propIsAuthenticated : Boolean(activeUser);

  const handleClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    // Refresh sync user before decision
    const currentSyncUser = activeUser || getSyncAuthUser();
    const isUserLoggedIn = typeof propIsAuthenticated === "boolean" ? propIsAuthenticated : Boolean(currentSyncUser);

    // 1. If not authenticated -> Show Sign In Modal
    if (!isUserLoggedIn) {
      setShowLoginModal(true);
      return;
    }

    // 2. Only approved projects can be saved
    if (recordStatus && !isRecordApproved(recordStatus)) {
      setShowUnapprovedModal(true);
      return;
    }

    // 3. Authenticated & Approved -> Toggle bookmark smoothly
    setIsLoading(true);

    const nextState = !saved;
    setSaved(nextState); // Optimistic UI update

    try {
      if (currentSyncUser?.id && recordId) {
        if (nextState) {
          await bookmarkService.addBookmark(currentSyncUser.id, recordId);
        } else {
          await bookmarkService.removeBookmark(currentSyncUser.id, recordId);
        }
      }
      onToggleSave?.(nextState);
    } catch (err) {
      console.error("[BookmarkButton] Failed to update bookmark state:", err);
      setSaved(!nextState); // Revert on failure
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Button
        type="button"
        variant={saved ? "default" : "outline"}
        size={compact ? "icon" : "sm"}
        onClick={handleClick}
        onMouseEnter={(e) => e.stopPropagation()}
        onMouseLeave={(e) => e.stopPropagation()}
        disabled={isLoading}
        className={cn(
          "transition-colors duration-150 gap-1.5 select-none shrink-0 pointer-events-auto",
          saved
            ? "bg-purple-600 hover:bg-purple-700 text-white border-purple-600 shadow-sm"
            : "border-border text-muted-foreground hover:text-foreground hover:bg-accent",
          compact ? "h-8 w-8" : "h-9 text-xs font-semibold px-3.5"
        )}
        aria-label={saved ? "Remove bookmark" : "Save bookmark"}
      >
        <Bookmark
          className={cn(
            "h-4 w-4 transition-colors duration-150",
            saved && "fill-current scale-105 text-white"
          )}
        />
        {!compact && (
          <span>{saved ? "Saved" : "Save Record"}</span>
        )}
      </Button>

      {/* Guest Login Required Dialog */}
      <Dialog open={showLoginModal} onOpenChange={setShowLoginModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader className="space-y-2">
            <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-purple-50 text-purple-600 border border-purple-200">
              <Lock className="h-5 w-5" />
            </div>
            <DialogTitle className="text-center text-lg font-bold">
              Sign In Required
            </DialogTitle>
            <DialogDescription className="text-center text-xs text-muted-foreground leading-relaxed">
              You need a student or faculty account to save repository records and manage your personal bookmarks list.
            </DialogDescription>
          </DialogHeader>

          {recordTitle && (
            <div className="rounded-lg border border-border bg-muted/40 p-3 text-xs text-foreground font-medium truncate text-center">
              &ldquo;{recordTitle}&rdquo;
            </div>
          )}

          <DialogFooter className="flex flex-col sm:flex-row gap-2 pt-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setShowLoginModal(false)}
              className="text-xs w-full sm:w-auto"
            >
              Cancel
            </Button>
            <Button
              asChild
              size="sm"
              className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold gap-1.5 w-full sm:w-auto"
            >
              <Link href={`/login?redirectTo=${encodeURIComponent(`/repository/${recordId}`)}`}>
                <LogIn className="h-3.5 w-3.5" /> Sign In to Save
              </Link>
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Unapproved Record Bookmark Restriction Pop-Up Modal */}
      <Dialog open={showUnapprovedModal} onOpenChange={setShowUnapprovedModal}>
        <DialogContent className="sm:max-w-md bg-card border-border shadow-xl">
          <DialogHeader className="space-y-3 pt-2">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-amber-100 dark:bg-amber-950/60 text-amber-600 border border-amber-300 dark:border-amber-700">
              <AlertCircle className="h-6 w-6" />
            </div>
            <DialogTitle className="text-center text-lg font-extrabold text-foreground">
              Only Approved Projects Can Be Saved
            </DialogTitle>
            <DialogDescription className="text-center text-xs text-muted-foreground leading-relaxed px-2">
              This repository record is currently pending institutional review. Projects can only be added to saved records once officially approved and published.
            </DialogDescription>
          </DialogHeader>

          {recordTitle && (
            <div className="rounded-lg border border-amber-200/80 bg-amber-50/60 dark:bg-amber-950/30 dark:border-amber-800/50 p-3.5 text-xs text-foreground font-bold truncate text-center">
              &ldquo;{recordTitle}&rdquo;
            </div>
          )}

          <DialogFooter className="flex justify-end pt-3">
            <Button
              type="button"
              size="sm"
              onClick={() => setShowUnapprovedModal(false)}
              className="bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs px-6 h-9 rounded-md shadow-xs"
            >
              Got it
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
});
