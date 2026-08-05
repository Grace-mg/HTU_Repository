"use client";

import * as React from "react";
import Link from "next/link";
import { Bookmark, Lock, Check, LogIn } from "lucide-react";
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

export interface BookmarkButtonProps {
  recordId: string;
  recordTitle?: string;
  initialSaved?: boolean;
  isAuthenticated?: boolean;
  compact?: boolean;
  onToggleSave?: (saved: boolean) => void;
}

export function BookmarkButton({
  recordId,
  recordTitle,
  initialSaved = false,
  isAuthenticated = false,
  compact = false,
  onToggleSave,
}: BookmarkButtonProps) {
  const [saved, setSaved] = React.useState(initialSaved);
  const [showLoginModal, setShowLoginModal] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isAuthenticated) {
      setShowLoginModal(true);
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
      const nextState = !saved;
      setSaved(nextState);
      setIsLoading(false);
      onToggleSave?.(nextState);
    }, 300);
  };

  return (
    <>
      <Button
        type="button"
        variant={saved ? "default" : "outline"}
        size={compact ? "icon" : "sm"}
        onClick={handleClick}
        disabled={isLoading}
        className={cn(
          "transition-all duration-200 gap-1.5 select-none",
          saved
            ? "bg-purple-600 hover:bg-purple-700 text-white border-purple-600 shadow-sm"
            : "border-border text-muted-foreground hover:text-foreground hover:bg-accent",
          compact ? "h-8 w-8" : "h-9 text-xs font-semibold px-3.5"
        )}
        aria-label={saved ? "Remove bookmark" : "Save bookmark"}
      >
        <Bookmark
          className={cn(
            "h-4 w-4 transition-transform duration-200",
            saved && "fill-current scale-110 text-white"
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
    </>
  );
}
