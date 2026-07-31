import * as React from "react";
import { AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

export interface FormErrorSummaryProps
  extends React.HTMLAttributes<HTMLDivElement> {
  errors?: string[];
  title?: string;
}

export function FormErrorSummary({
  errors = [],
  title = "Please correct the following errors:",
  className,
  ...props
}: FormErrorSummaryProps) {
  if (!errors || errors.length === 0) return null;

  return (
    <div
      role="alert"
      className={cn(
        "rounded-md border border-destructive/30 bg-destructive/10 p-4 text-xs text-destructive",
        className
      )}
      {...props}
    >
      <div className="flex items-center gap-2 font-semibold">
        <AlertCircle className="h-4 w-4 flex-shrink-0" />
        <span>{title}</span>
      </div>
      <ul className="mt-2 list-disc list-inside space-y-1 pl-1">
        {errors.map((error, idx) => (
          <li key={idx}>{error}</li>
        ))}
      </ul>
    </div>
  );
}
