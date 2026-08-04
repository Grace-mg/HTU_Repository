import * as React from "react";
import { Download, FileText, Lock, FileCode, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export interface RecordFileCardProps extends React.HTMLAttributes<HTMLDivElement> {
  fileName?: string;
  fileSize?: number;
  mimeType?: string;
  fileUrl?: string;
  recordTitle: string;
}

export function RecordFileCard({
  fileName = "Project_Documentation.pdf",
  fileSize,
  mimeType = "application/pdf",
  fileUrl,
  recordTitle,
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
        <div className="flex items-center gap-1 text-[11px] font-medium text-emerald-600 dark:text-emerald-400">
          <CheckCircle2 className="h-3.5 w-3.5" />
          <span>HOD Approved File</span>
        </div>

        {fileUrl ? (
          <Button
            asChild
            size="sm"
            className="gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs px-4"
          >
            <a href={fileUrl} download={fileName} target="_blank" rel="noopener noreferrer">
              <Download className="h-3.5 w-3.5" /> Download Document
            </a>
          </Button>
        ) : (
          <Button
            type="button"
            size="sm"
            onClick={() => alert("File download will be active when storage provider is connected.")}
            className="gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs px-4"
          >
            <Download className="h-3.5 w-3.5" /> Download Document
          </Button>
        )}
      </div>
    </div>
  );
}
