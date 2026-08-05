import * as React from "react";
import Link from "next/link";
import { User, BookOpen, GraduationCap, Calendar, Tag, ArrowRight } from "lucide-react";
import { RepositoryRecord } from "@/types/repository";
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
        "group flex flex-col justify-between rounded-xl border border-border bg-card p-5 shadow-sm transition-all duration-200 hover:border-blue-600/40 hover:shadow-md",
        className
      )}
      {...props}
    >
      <div>
        {/* Top Meta Badges */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <Badge
            variant={isProject ? "default" : "secondary"}
            className={cn(
              "text-xs font-semibold px-2.5 py-0.5",
              isProject
                ? "bg-blue-600 text-white hover:bg-blue-700"
                : "bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-500/30"
            )}
          >
            {isProject ? "Project" : "Thesis"}
          </Badge>

          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1 text-xs text-muted-foreground font-medium">
              <Calendar className="h-3.5 w-3.5" />
              {record.academicYear}
            </span>
            <BookmarkButton recordId={record.id} recordTitle={record.title} compact />
          </div>
        </div>

        {/* Title */}
        <h3 className="text-lg font-bold text-foreground group-hover:text-blue-600 transition-colors line-clamp-2">
          <Link href={targetHref}>{record.title}</Link>
        </h3>

        {/* Author / Student & Supervisor */}
        <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
          <span className="inline-flex items-center gap-1 font-medium text-foreground">
            <User className="h-3.5 w-3.5 text-blue-600" />
            {record.studentName}
          </span>

          {record.supervisorName && (
            <span className="inline-flex items-center gap-1">
              <GraduationCap className="h-3.5 w-3.5" />
              Supervisor: {record.supervisorName}
            </span>
          )}
        </div>

        {/* Faculty / Department / Category */}
        <div className="mt-2 text-xs text-muted-foreground flex flex-wrap items-center gap-1.5">
          {record.departmentName && (
            <span className="font-semibold text-foreground">{record.departmentName}</span>
          )}
          {record.facultyName && (
            <span>• {record.facultyName}</span>
          )}
          {record.categoryName && (
            <span className="bg-muted px-2 py-0.5 rounded text-[11px]">{record.categoryName}</span>
          )}
        </div>

        {/* Abstract snippet */}
        <p className="mt-3 text-xs leading-relaxed text-muted-foreground line-clamp-3">
          {record.abstract}
        </p>

        {/* Keyword Tags */}
        {record.keywords && record.keywords.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-1">
            {record.keywords.slice(0, 4).map((kw) => (
              <span
                key={kw}
                className="inline-flex items-center gap-0.5 text-[10px] font-medium bg-muted/60 text-muted-foreground px-2 py-0.5 rounded"
              >
                <Tag className="h-2.5 w-2.5" />
                {kw}
              </span>
            ))}
            {record.keywords.length > 4 && (
              <span className="text-[10px] text-muted-foreground px-1">
                +{record.keywords.length - 4} more
              </span>
            )}
          </div>
        )}
      </div>

      {/* Card Action Link */}
      <div className="mt-5 pt-3 border-t border-border/60 flex items-center justify-between">
        <span className="text-[11px] text-muted-foreground">
          {record.viewsCount || 0} views
        </span>
        <Link
          href={targetHref}
          className="inline-flex items-center gap-1 text-xs font-bold text-blue-600 hover:text-blue-700 hover:underline"
        >
          View Details <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>
    </div>
  );
}
