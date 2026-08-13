import * as React from "react";
import Link from "next/link";
import { User, GraduationCap, ArrowRight, Tag } from "lucide-react";
import { RepositoryRecord } from "@/types/repository";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { BookmarkButton } from "@/components/projects/bookmark-button";
import { cn } from "@/lib/utils";

export interface RepositoryRecordCardProps extends React.HTMLAttributes<HTMLDivElement> {
  record: RepositoryRecord;
}

export function RepositoryRecordCard({
  record,
  className,
  ...props
}: RepositoryRecordCardProps) {
  const isProject = record.recordType === "PROJECT";
  const targetHref = isProject ? `/projects/${record.id}` : `/theses/${record.id}`;

  return (
    <div
      className={cn(
        "group flex flex-col justify-between rounded-xl border-2 border-slate-300 dark:border-slate-700/80 bg-card p-5 shadow-md hover:shadow-xl hover:border-blue-600 dark:hover:border-blue-500 hover:-translate-y-0.5 transition-all duration-200",
        className
      )}
      {...props}
    >
      <div className="space-y-3">
        {/* Top Header Row: Badges, Year, and Bookmark */}
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 flex-wrap">
            <Badge
              variant={isProject ? "default" : "secondary"}
              className={cn(
                "text-[10px] font-bold px-2 py-0.5 uppercase tracking-wider",
                isProject
                  ? "bg-blue-600 text-white hover:bg-blue-700"
                  : "bg-amber-600 text-white"
              )}
            >
              {isProject ? "Project" : "Thesis"}
            </Badge>
            <span className="text-xs font-semibold text-blue-600 dark:text-blue-400">
              {record.departmentName || "Department"}
            </span>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <span className="text-xs text-muted-foreground font-medium bg-muted px-2 py-0.5 rounded">
              {record.academicYear}
            </span>
            <BookmarkButton recordId={record.id} recordTitle={record.title} compact />
          </div>
        </div>

        {/* Title */}
        <h3 className="text-base font-bold text-foreground group-hover:text-blue-600 transition-colors line-clamp-2 leading-snug">
          <Link href={targetHref}>{record.title}</Link>
        </h3>

        {/* Student & Supervisor */}
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
          <span className="inline-flex items-center gap-1 font-semibold text-foreground">
            <User className="h-3.5 w-3.5 text-blue-600" />
            {record.studentName}
          </span>
          {record.supervisorName && (
            <span className="inline-flex items-center gap-1 text-muted-foreground">
              <GraduationCap className="h-3.5 w-3.5" />
              {record.supervisorName}
            </span>
          )}
        </div>

        {/* Abstract */}
        <p className="text-xs leading-relaxed text-muted-foreground line-clamp-2">
          {record.abstract}
        </p>

        {/* Keywords */}
        {record.keywords && record.keywords.length > 0 && (
          <div className="flex flex-wrap gap-1 pt-1">
            {record.keywords.slice(0, 3).map((kw) => (
              <span
                key={kw}
                className="inline-flex items-center gap-0.5 text-[10px] font-medium bg-muted text-muted-foreground px-2 py-0.5 rounded-full"
              >
                <Tag className="h-2.5 w-2.5" />
                {kw}
              </span>
            ))}
            {record.keywords.length > 3 && (
              <span className="text-[10px] text-muted-foreground px-1 self-center">
                +{record.keywords.length - 3}
              </span>
            )}
          </div>
        )}
      </div>

      {/* Footer Row */}
      <div className="mt-4 pt-3 border-t border-border/60 flex items-center justify-between">
        <span className="text-xs text-muted-foreground font-medium">
          {record.viewsCount || 0} views
        </span>
        <Button
          asChild
          size="sm"
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs px-3.5 h-8 shadow-xs"
        >
          <Link href={targetHref}>
            View Details
          </Link>
        </Button>
      </div>
    </div>
  );
}
