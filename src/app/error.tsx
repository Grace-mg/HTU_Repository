"use client";

import { useEffect } from "react";

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Route Error:", error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-background">
      <div className="max-w-md w-full p-6 border border-border rounded-md bg-card text-card-foreground text-center space-y-4">
        <h2 className="text-lg font-semibold text-destructive">Application Error</h2>
        <p className="text-xs text-muted-foreground">
          {error.message || "An unexpected error occurred while processing your request."}
        </p>
        <button
          onClick={() => reset()}
          className="px-4 py-2 text-xs font-medium rounded-md bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
        >
          Try Again
        </button>
      </div>
    </div>
  );
}
