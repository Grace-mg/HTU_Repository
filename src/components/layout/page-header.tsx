import * as React from "react";
import { cn } from "@/lib/utils";
import { Sparkles } from "lucide-react";

export interface PageHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string;
  description?: string;
  badge?: string;
  actions?: React.ReactNode;
}

export function PageHeader({
  title,
  description,
  badge,
  actions,
  children,
  className,
  ...props
}: PageHeaderProps & { children?: React.ReactNode }) {
  return (
    <div
      className={cn(
        "w-full rounded-xl border border-blue-200/60 bg-gradient-to-r from-blue-500/10 via-blue-500/5 to-transparent p-6 sm:p-8 relative overflow-hidden dark:border-blue-900/50 dark:from-blue-950/30 dark:via-blue-950/15 shadow-sm mb-6 transition-all",
        className
      )}
      {...props}
    >
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 relative z-10">
        <div className="space-y-2">
          {badge && (
            <div className="inline-flex items-center gap-1.5 rounded-full border border-blue-400/30 bg-blue-500/10 px-3 py-1 text-xs font-semibold text-blue-600 dark:text-blue-400">
              <Sparkles className="h-3.5 w-3.5" />
              <span>{badge}</span>
            </div>
          )}
          <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            {title}
          </h1>
          {description && (
            <p className="text-sm text-muted-foreground leading-relaxed max-w-3xl">
              {description}
            </p>
          )}
        </div>
        {(actions || children) && (
          <div className="flex flex-wrap items-center gap-3 shrink-0">
            {actions}
            {children}
          </div>
        )}
      </div>
    </div>
  );
}
