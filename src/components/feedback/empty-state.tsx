import * as React from "react";
import { FolderOpen } from "lucide-react";
import { cn } from "@/lib/utils";

export interface EmptyStateProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: string;
  description?: string;
  icon?: React.ElementType;
  action?: React.ReactNode;
}

export function EmptyState({
  title = "No records found",
  description = "No items match your current criteria or data source is empty.",
  icon: Icon = FolderOpen,
  action,
  className,
  ...props
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex min-h-[220px] flex-col items-center justify-center rounded-md border border-dashed border-border p-8 text-center bg-background/50",
        className
      )}
      {...props}
    >
      <div className="flex h-10 w-10 items-center justify-center rounded-md bg-muted text-muted-foreground mb-3">
        <Icon className="h-5 w-5" />
      </div>
      <h3 className="text-base font-semibold text-foreground">{title}</h3>
      <p className="mt-1 text-sm text-muted-foreground max-w-md">
        {description}
      </p>
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}
