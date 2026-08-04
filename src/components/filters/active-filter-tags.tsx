"use client";

import * as React from "react";
import { X, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export interface ActiveFilterItem {
  key: string;
  label: string;
  value: string;
}

export interface ActiveFilterTagsProps {
  filters: ActiveFilterItem[];
  onRemoveFilter: (key: string) => void;
  onClearAll: () => void;
}

export function ActiveFilterTags({
  filters,
  onRemoveFilter,
  onClearAll,
}: ActiveFilterTagsProps) {
  if (!filters || filters.length === 0) {
    return null;
  }

  return (
    <div className="flex flex-wrap items-center gap-2 py-2">
      <span className="text-xs font-medium text-muted-foreground mr-1">
        Active filters:
      </span>

      {filters.map((filter) => (
        <Badge
          key={`${filter.key}-${filter.value}`}
          variant="secondary"
          className="inline-flex items-center gap-1 text-xs px-2.5 py-1 bg-muted hover:bg-muted/80 text-foreground rounded-full border border-border"
        >
          <span className="font-semibold text-muted-foreground">{filter.label}:</span>
          <span>{filter.value}</span>
          <button
            type="button"
            onClick={() => onRemoveFilter(filter.key)}
            className="ml-1 text-muted-foreground hover:text-foreground focus:outline-none"
            aria-label={`Remove filter ${filter.label}`}
          >
            <X className="h-3 w-3" />
          </button>
        </Badge>
      ))}

      <Button
        type="button"
        variant="ghost"
        size="sm"
        onClick={onClearAll}
        className="h-7 text-xs gap-1 text-blue-600 hover:text-blue-700 hover:bg-blue-50 dark:hover:bg-blue-950/50 px-2"
      >
        <RotateCcw className="h-3 w-3" /> Clear all
      </Button>
    </div>
  );
}
