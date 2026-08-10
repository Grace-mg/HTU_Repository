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

function getRecordCoverImage(record: RepositoryRecord): string {
  const text = `${record.title} ${record.departmentName || ""} ${record.categoryName || ""}`.toLowerCase();

  if (text.includes("solar") || text.includes("agric") || text.includes("irrigation") || text.includes("crop")) {
    return "/Repository Assets/Solar powered irrigation system watering crops on farm field at sunset.jpg";
  }
  if (text.includes("fashion") || text.includes("textile") || text.includes("apparel") || text.includes("garment")) {
    return "/Repository Assets/ZAATU-Web-Art1600-1650.jpg";
  }
  if (text.includes("hvac") || text.includes("building") || text.includes("civil") || text.includes("construction")) {
    return "/Repository Assets/Future of Smart HVAC Systems for Commercial Buildings.jpg";
  }
  if (text.includes("food") || text.includes("nutrition") || text.includes("recipe") || text.includes("hospitality")) {
    return "/Repository Assets/download (39).jpg";
  }
  if (text.includes("ai") || text.includes("software") || text.includes("app") || text.includes("code") || text.includes("blockchain") || text.includes("vibe")) {
    return "/Repository Assets/Time Attendance Tracking Software _ Palgeo_com.jpg";
  }

  return "/Repository Assets/Investment not only needs finance but also people with the right skills_ A pilot project, Vocational, Education and Training (VET) Toolbox 2, will support to develop skills in eleven sub-Saharan African countries.jpg";
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
        "group flex flex-col justify-between rounded-2xl border border-border bg-card shadow-sm transition-all duration-200 hover:border-blue-600/40 hover:shadow-lg overflow-hidden",
        className
      )}
      {...props}
    >
      {/* Top Preview Cover Image */}
      <div className="h-44 sm:h-48 w-full overflow-hidden bg-slate-100 dark:bg-muted border-b border-border/60 relative">
        <img
          src={getRecordCoverImage(record)}
          alt={record.title}
          className="h-full w-full object-cover object-center group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute top-3 left-3">
          <Badge
            variant={isProject ? "default" : "secondary"}
            className={cn(
              "text-xs font-semibold px-2.5 py-0.5 shadow-sm",
              isProject
                ? "bg-blue-600 text-white hover:bg-blue-700"
                : "bg-amber-600 text-white"
            )}
          >
            {isProject ? "Project" : "Thesis"}
          </Badge>
        </div>
        <div className="absolute top-3 right-3 flex items-center gap-1.5 bg-black/40 backdrop-blur-md px-2 py-1 rounded-lg text-white">
          <span className="text-[10px] font-semibold">{record.academicYear}</span>
          <BookmarkButton recordId={record.id} recordTitle={record.title} compact />
        </div>
      </div>

      {/* Card Content Details */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          {/* Department / Category Tag */}
          <div className="text-xs font-semibold text-blue-600 dark:text-blue-400 mb-1.5 flex items-center justify-between">
            <span>{record.departmentName || "Department"}</span>
            {record.categoryName && (
              <span className="text-[10px] font-normal text-muted-foreground bg-muted px-2 py-0.5 rounded">
                {record.categoryName}
              </span>
            )}
          </div>

          {/* Title */}
          <h3 className="text-base font-bold text-foreground group-hover:text-blue-600 transition-colors line-clamp-2 leading-snug">
            <Link href={targetHref}>{record.title}</Link>
          </h3>

          {/* Student & Supervisor */}
          <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
            <span className="inline-flex items-center gap-1 font-medium text-foreground">
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
          <p className="mt-2.5 text-xs leading-relaxed text-muted-foreground line-clamp-3">
            {record.abstract}
          </p>

          {/* Keywords */}
          {record.keywords && record.keywords.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-1">
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

        {/* Footer */}
        <div className="mt-4 pt-3 border-t border-border/60 flex items-center justify-between">
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
    </div>
  );
}
