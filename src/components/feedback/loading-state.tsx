import * as React from "react";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

export interface LoadingStateProps extends React.HTMLAttributes<HTMLDivElement> {
  message?: string;
  inline?: boolean;
}

export function LoadingState({
  message = "Loading...",
  inline = false,
  className,
  ...props
}: LoadingStateProps) {
  if (inline) {
    return (
      <div className={cn("inline-flex items-center gap-2 text-sm text-muted-foreground", className)} {...props}>
        <Loader2 className="h-4 w-4 animate-spin text-primary" />
        <span>{message}</span>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "flex min-h-[200px] flex-col items-center justify-center p-8 text-center",
        className
      )}
      {...props}
    >
      <Loader2 className="h-6 w-6 animate-spin text-primary mb-2" />
      <p className="text-xs text-muted-foreground font-medium">{message}</p>
    </div>
  );
}
