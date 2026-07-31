import * as React from "react";
import { Badge } from "@/components/ui/badge";

export type RecordStatus = "DRAFT" | "PUBLISHED" | "ARCHIVED" | "PENDING_REVIEW";

export interface StatusBadgeProps {
  status: RecordStatus | string;
  className?: string;
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const normalized = status.toUpperCase();

  switch (normalized) {
    case "PUBLISHED":
      return (
        <Badge variant="success" pill className={className}>
          Published
        </Badge>
      );
    case "DRAFT":
      return (
        <Badge variant="secondary" pill className={className}>
          Draft
        </Badge>
      );
    case "ARCHIVED":
      return (
        <Badge variant="outline" pill className={className}>
          Archived
        </Badge>
      );
    case "PENDING_REVIEW":
      return (
        <Badge variant="warning" pill className={className}>
          Pending Review
        </Badge>
      );
    default:
      return (
        <Badge variant="outline" pill className={className}>
          {status}
        </Badge>
      );
  }
}
