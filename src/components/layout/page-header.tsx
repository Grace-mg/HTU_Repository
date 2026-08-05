import * as React from "react";
import { cn } from "@/lib/utils";

export interface PageHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string;
  description?: string;
  actions?: React.ReactNode;
}

export function PageHeader({
  title,
  description,
  actions,
  children,
  className,
  ...props
}: PageHeaderProps & { children?: React.ReactNode }) {
  return (
    <div
      className={cn(
        "w-full rounded-xl border border-border bg-card p-5 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all mb-6",
        className
      )}
      {...props}
    >
      <div className="space-y-1">
        <h1 className="text-xl md:text-2xl font-extrabold tracking-tight text-foreground">
          {title}
        </h1>
        {description && (
          <p className="text-xs text-muted-foreground leading-relaxed max-w-3xl">
            {description}
          </p>
        )}
      </div>
      {(actions || children) && (
        <div className="flex items-center gap-3 shrink-0">
          {actions}
          {children}
        </div>
      )}
    </div>
  );
}
