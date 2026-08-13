"use client";

import * as React from "react";
import { Download, FileText, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { downloadProjectPDF } from "@/lib/utils/download";

export interface RecordFileCardProps extends React.HTMLAttributes<HTMLDivElement> {
  fileName?: string;
  fileSize?: number;
  mimeType?: string;
  fileUrl?: string;
  recordTitle: string;
  studentName?: string;
  studentId?: string;
  supervisorName?: string;
  departmentName?: string;
  facultyName?: string;
  academicYear?: number;
  recordType?: string;
  abstract?: string;
}

export function RecordFileCard({
  fileName = "Project_Documentation.pdf",
  fileSize,
  mimeType = "application/pdf",
  fileUrl,
  recordTitle,
  studentName,
  studentId,
  supervisorName,
  departmentName,
  facultyName,
  academicYear,
  recordType,
  abstract,
  className,
  ...props
}: RecordFileCardProps) {
  // Format file size nicely
  const formattedSize = React.useMemo(() => {
    if (!fileSize) return "2.4 MB";
    if (fileSize < 1024) return `${fileSize} B`;
    if (fileSize < 1024 * 1024) return `${(fileSize / 1024).toFixed(1)} KB`;
    return `${(fileSize / (1024 * 1024)).toFixed(1)} MB`;
  }, [fileSize]);

  const handleDownload = () => {
    downloadProjectPDF({
      title: recordTitle,
      studentName: studentName || "Student",
      studentId,
      supervisorName: supervisorName || "Academic Supervisor",
      departmentName,
      facultyName,
      academicYear,
      recordType,
      abstract: abstract || "Official project submission documentation.",
      fileUrl,
      fileName,
    });
  };

  return (
    <div
      className={cn(
        "rounded-xl border border-border bg-card p-5 shadow-sm space-y-4",
        className
      )}
      {...props}
    >
      <div className="flex items-start gap-3">
        <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800">
          <FileText className="h-5 w-5" />
        </div>

        <div className="flex-1 min-w-0">
          <h4 className="text-sm font-bold text-foreground truncate">
            {fileName}
          </h4>
          <p className="text-xs text-muted-foreground mt-0.5">
            {mimeType} • {formattedSize}
          </p>
        </div>
      </div>

      <div className="pt-2 border-t border-border/60 flex items-center justify-between gap-3">
        <div className="flex items-center gap-1.5 text-[11px] font-semibold text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/80 border-2 border-emerald-500 px-2.5 py-0.5 rounded-full">
          <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
          <span>Approved File</span>
        </div>

        <Button
          type="button"
          size="sm"
          onClick={handleDownload}
          className="gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs px-4"
        >
          <Download className="h-3.5 w-3.5" /> Download Document
        </Button>
      </div>
    </div>
  );
}
