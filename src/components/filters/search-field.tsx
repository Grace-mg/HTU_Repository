import * as React from "react";
import { Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export interface SearchFieldProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "onSubmit"> {
  value?: string;
  onSearch?: (value: string) => void;
  onClear?: () => void;
  placeholder?: string;
}

export function SearchField({
  value: externalValue,
  onSearch,
  onClear,
  placeholder = "Search projects, theses, authors...",
  className,
  ...props
}: SearchFieldProps) {
  const [internalValue, setInternalValue] = React.useState(externalValue || "");

  React.useEffect(() => {
    if (externalValue !== undefined) {
      setInternalValue(externalValue);
    }
  }, [externalValue]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && onSearch) {
      onSearch(internalValue);
    }
  };

  const handleClear = () => {
    setInternalValue("");
    if (onClear) onClear();
    if (onSearch) onSearch("");
  };

  return (
    <div className={cn("relative flex w-full items-center", className)}>
      <Search className="absolute left-3 h-4 w-4 text-muted-foreground pointer-events-none" />
      <Input
        type="text"
        value={internalValue}
        onChange={(e) => setInternalValue(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        className="pl-9 pr-20"
        {...props}
      />
      <div className="absolute right-1.5 flex items-center gap-1">
        {internalValue && (
          <button
            type="button"
            onClick={handleClear}
            className="rounded-sm p-1 text-muted-foreground hover:text-foreground focus:outline-none"
            aria-label="Clear search"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        )}
        {onSearch && (
          <Button
            type="button"
            size="sm"
            variant="ghost"
            onClick={() => onSearch(internalValue)}
            className="h-7 px-2 text-xs"
          >
            Search
          </Button>
        )}
      </div>
    </div>
  );
}
