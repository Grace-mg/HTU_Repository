"use client";

import * as React from "react";
import Link from "next/link";
import {
  User,
  Users,
  Mail,
  GraduationCap,
  Building2,
  Calendar,
  Tag,
  ArrowLeft,
  Eye,
  Download,
  Share2,
  Bookmark,
  CheckCircle,
  Clock,
  XCircle,
  FolderOpen,
} from "lucide-react";
import { usePathname } from "next/navigation";
import { RepositoryRecord } from "@/types/repository";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { RecordFileCard } from "@/components/projects/record-file-card";
import { RepositoryRecordCard } from "@/components/projects/repository-record-card";
import { BookmarkButton } from "@/components/projects/bookmark-button";
import { repositoryService } from "@/services/supabase-repository-service";
import { cn } from "@/lib/utils";

export interface RecordDetailViewProps extends React.HTMLAttributes<HTMLDivElement> {
  record: RepositoryRecord;
  relatedRecords?: RepositoryRecord[];
  backHref?: string;
}

export function RecordDetailView({
  record,
  relatedRecords = [],
  backHref: customBackHref,
  className,
  ...props
}: RecordDetailViewProps) {
  const pathname = usePathname();
  const isProject = record.recordType === "PROJECT";
  const isDashboard = pathname?.startsWith("/dashboard");

  const defaultBackHref = isDashboard
    ? isProject
      ? "/dashboard/projects"
      : "/dashboard/theses"
    : "/browse";

  const backHref = customBackHref || defaultBackHref;
  const backLabel = isDashboard
    ? isProject
      ? "Back to My Projects"
      : "Back to My Theses"
    : "Back to Archive";

  const statusConfig = React.useMemo(() => {
    if (record.status === "PUBLISHED" || record.status === "APPROVED") {
      return {
        label: "Approved & Published",
        className: "bg-emerald-50 text-emerald-700 border-2 border-emerald-500 font-bold dark:bg-emerald-950/80 dark:text-emerald-300 dark:border-emerald-500",
        icon: <CheckCircle className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />,
      };
    }
    if (record.status === "REJECTED") {
      return {
        label: "Rejected",
        className: "bg-red-50 text-red-700 border-2 border-red-500 font-bold dark:bg-red-950/80 dark:text-red-300 dark:border-red-500",
        icon: <XCircle className="h-3.5 w-3.5 text-red-600 dark:text-red-400" />,
      };
    }
    return {
      label: "Pending Review",
      className: "bg-amber-50 text-amber-700 border-2 border-amber-500 font-bold dark:bg-amber-950/80 dark:text-amber-300 dark:border-amber-500",
      icon: <Clock className="h-3.5 w-3.5 text-amber-600 dark:text-amber-400" />,
    };
  }, [record.status]);

  const [viewsCount, setViewsCount] = React.useState(record.viewsCount || 0);

  React.useEffect(() => {
    if (!record.id) return;
    setViewsCount((prev) => prev + 1);
    repositoryService.incrementViews(record.id).catch(() => {});
  }, [record.id]);

  return (
    <div className={cn("space-y-8", className)} {...props}>
      {/* Back to Archive Link */}
      <div>
        <Link
          href={backHref}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-600 hover:text-blue-700 hover:underline"
        >
          <ArrowLeft className="h-3.5 w-3.5" /> {backLabel}
        </Link>
      </div>

      {/* Main Header Card */}
      <div className="space-y-4 border-b border-border pb-6">
        <div className="flex flex-wrap items-center gap-2">
          <Badge
            variant={isProject ? "default" : "secondary"}
            className={cn(
              "text-xs font-bold px-3 py-0.5",
              isProject
                ? "bg-blue-600 text-white"
                : "bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-500/30"
            )}
          >
            {isProject ? "Student Project" : "Academic Thesis"}
          </Badge>

          <span
            className={cn(
              "inline-flex items-center gap-1 text-xs font-semibold px-3 py-0.5 rounded-full shadow-xs",
              statusConfig.className
            )}
          >
            {statusConfig.icon} {statusConfig.label}
          </span>

          <div className="flex items-center gap-3 ml-auto">
            <span className="text-xs text-muted-foreground">
              Academic Year {record.academicYear}
            </span>
            <BookmarkButton recordId={record.id} recordTitle={record.title} />
          </div>
        </div>

        <h1 className="text-2xl font-extrabold text-foreground sm:text-3xl md:text-4xl leading-tight tracking-tight">
          {record.title}
        </h1>

        <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground pt-1">
          <span className="inline-flex items-center gap-1 font-semibold text-foreground">
            <User className="h-3.5 w-3.5 text-blue-600" />
            {record.studentName}
            {record.studentId && <span className="font-mono text-muted-foreground">({record.studentId})</span>}
          </span>

          {record.supervisorName && (
            <span className="inline-flex items-center gap-1">
              <GraduationCap className="h-3.5 w-3.5" />
              Supervisor: <span className="font-medium text-foreground">{record.supervisorName}</span>
            </span>
          )}

          <span className="inline-flex items-center gap-1 ml-auto">
            <Eye className="h-3.5 w-3.5 text-muted-foreground" />
            {viewsCount} Views
          </span>
        </div>
      </div>

      {/* Grid: Left Main Content Area & Right Compact Metadata Side Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content Area */}
        <div className="lg:col-span-2 space-y-8">
          {/* Abstract Section */}
          <div className="space-y-3">
            <h2 className="text-lg font-bold text-foreground border-b border-border/60 pb-2">
              Abstract & Overview
            </h2>
            <div className="prose prose-slate dark:prose-invert max-w-none text-sm leading-relaxed text-muted-foreground space-y-4">
              <p className="whitespace-pre-line text-foreground/90 font-normal">
                {record.abstract}
              </p>
            </div>
          </div>

          {/* Project Authors & Group Members Section */}
          <div className="space-y-4 rounded-xl border border-border bg-card p-5 shadow-sm">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
                <Users className="h-4 w-4 text-blue-600" /> Project Authors & Group Members
              </h3>
              <Badge variant="outline" className="text-[11px] text-blue-600 border-blue-600/30">
                {record.groupMembers && record.groupMembers.length > 0
                  ? `${record.groupMembers.length + 1} Team Members`
                  : "Lead Student Author"}
              </Badge>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Primary Lead Student Author */}
              <div className="p-3 rounded-lg border border-blue-200/80 dark:border-blue-900/50 bg-blue-50/50 dark:bg-blue-950/20 space-y-1">
                <div className="flex items-center gap-2.5">
                  <div className="h-8 w-8 rounded-full bg-blue-600 text-white font-bold text-xs flex items-center justify-center shrink-0">
                    {record.studentName.charAt(0).toUpperCase()}
                  </div>
                  <div className="min-w-0 flex-1">
                    <h4 className="text-xs font-bold text-foreground flex items-center gap-1.5 truncate">
                      {record.studentName}
                      <span className="text-[9px] bg-blue-600 text-white px-1.5 py-0.2 rounded font-semibold shrink-0">Lead</span>
                    </h4>
                    {record.studentId && (
                      <p className="text-[11px] font-mono text-muted-foreground truncate">ID: {record.studentId}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Group Members */}
              {record.groupMembers && record.groupMembers.length > 0 &&
                record.groupMembers.map((member, idx) => (
                  <div
                    key={member.email || idx}
                    className="p-3 rounded-lg border border-border bg-background space-y-1 hover:border-blue-500/40 transition-colors"
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="h-8 w-8 rounded-full bg-muted text-foreground font-bold text-xs flex items-center justify-center shrink-0 border border-border">
                        {member.name ? member.name.charAt(0).toUpperCase() : "M"}
                      </div>
                      <div className="min-w-0 flex-1">
                        <h4 className="text-xs font-bold text-foreground truncate">{member.name}</h4>
                        {member.studentId && (
                          <p className="text-[11px] font-mono text-muted-foreground truncate">ID: {member.studentId}</p>
                        )}
                        {member.email && (
                          <a
                            href={`mailto:${member.email}`}
                            className="text-[11px] text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1 truncate"
                          >
                            <Mail className="h-3 w-3 shrink-0 text-blue-600" /> {member.email}
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </div>

          {/* Attached File Section */}
          <div className="space-y-3">
            <h3 className="text-base font-bold text-foreground border-b border-border/60 pb-2">
              Documentation & Source File
            </h3>
            <RecordFileCard
              fileName={record.fileName || `${record.slug}_Documentation.pdf`}
              fileSize={record.fileSize}
              mimeType={record.mimeType || "application/pdf"}
              fileUrl={record.fileUrl}
              recordTitle={record.title}
              studentName={record.studentName}
              studentId={record.studentId}
              supervisorName={record.supervisorName}
              departmentName={record.departmentName}
              facultyName={record.facultyName}
              academicYear={record.academicYear}
              recordType={record.recordType}
              abstract={record.abstract}
            />
          </div>

          {/* Keywords Section */}
          {record.keywords && record.keywords.length > 0 && (
            <div className="space-y-3 pt-2">
              <h3 className="text-sm font-bold text-foreground">Keywords & Indexing</h3>
              <div className="flex flex-wrap gap-1.5">
                {record.keywords.map((kw) => (
                  <span
                    key={kw}
                    className="inline-flex items-center gap-1 text-xs font-semibold bg-muted text-foreground px-3 py-1 rounded-md border border-border"
                  >
                    <Tag className="h-3 w-3 text-blue-600" />
                    {kw}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Compact Metadata Side Panel */}
        <div className="space-y-6">
          <div className="rounded-xl border border-border bg-card p-5 space-y-4 shadow-sm">
            <h3 className="text-sm font-bold text-foreground border-b border-border pb-2">
              Record Metadata
            </h3>

            <div className="space-y-3 text-xs">
              <div>
                <span className="font-semibold text-muted-foreground block">Faculty</span>
                <span className="font-medium text-foreground">
                  {record.facultyName || "Faculty of Applied Sciences & Tech"}
                </span>
              </div>

              <div className="pt-2 border-t border-border/40">
                <span className="font-semibold text-muted-foreground block">Department</span>
                <span className="font-medium text-foreground">
                  {record.departmentName || "Computer Science"}
                </span>
              </div>

              <div className="pt-2 border-t border-border/40">
                <span className="font-semibold text-muted-foreground block">Academic Category</span>
                <span className="font-medium text-foreground">
                  {record.categoryName || "Software & Web Apps"}
                </span>
              </div>

              <div className="pt-2 border-t border-border/40">
                <span className="font-semibold text-muted-foreground block">Academic Year</span>
                <span className="font-medium text-foreground">{record.academicYear}</span>
              </div>

              <div className="pt-2 border-t border-border/40">
                <span className="font-semibold text-muted-foreground block">Date Published</span>
                <span suppressHydrationWarning className="font-medium text-foreground">
                  {record.publishedAt
                    ? new Date(record.publishedAt).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })
                    : new Date(record.createdAt).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Related Records Section */}
      <div className="space-y-4 pt-8 border-t border-border">
        <h2 className="text-xl font-bold text-foreground">Related Records</h2>
        {relatedRecords.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {relatedRecords.map((rel) => (
              <RepositoryRecordCard key={rel.id} record={rel} />
            ))}
          </div>
        ) : (
          <div className="rounded-xl border border-dashed border-border p-6 text-center text-xs text-muted-foreground bg-muted/30">
            No related records found for this department yet.
          </div>
        )}
      </div>
    </div>
  );
}
