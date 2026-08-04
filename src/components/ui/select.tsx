"use client";

import * as React from "react";
import { ChevronDown, Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface SelectContextType {
  value?: string;
  onValueChange?: (value: string) => void;
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  selectedLabel: string;
  setSelectedLabel: React.Dispatch<React.SetStateAction<string>>;
  registerOption: (val: string, label: string) => void;
}

const SelectContext = React.createContext<SelectContextType | null>(null);

function useSelectContext() {
  const ctx = React.useContext(SelectContext);
  if (!ctx) {
    throw new Error("Select components must be used within a <Select>");
  }
  return ctx;
}

export interface SelectProps {
  value?: string;
  onValueChange?: (value: string) => void;
  children?: React.ReactNode;
  defaultValue?: string;
}

export function Select({ value: controlledValue, onValueChange, children, defaultValue }: SelectProps) {
  const [uncontrolledValue, setUncontrolledValue] = React.useState(defaultValue || "");
  const isControlled = controlledValue !== undefined;
  const currentValue = isControlled ? controlledValue : uncontrolledValue;

  const [open, setOpen] = React.useState(false);
  const [selectedLabel, setSelectedLabel] = React.useState("");
  const optionsMap = React.useRef<Map<string, string>>(new Map());
  const selectRef = React.useRef<HTMLDivElement>(null);

  const registerOption = React.useCallback((val: string, label: string) => {
    optionsMap.current.set(val, label);
    if (val === currentValue) {
      setSelectedLabel(label);
    }
  }, [currentValue]);

  React.useEffect(() => {
    if (currentValue !== undefined && optionsMap.current.has(currentValue)) {
      setSelectedLabel(optionsMap.current.get(currentValue) || "");
    }
  }, [currentValue]);

  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (selectRef.current && !selectRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
      }
    };

    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("keydown", handleKeyDown);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [open]);

  const handleValueChange = (val: string) => {
    if (!isControlled) {
      setUncontrolledValue(val);
    }
    onValueChange?.(val);
    setOpen(false);
  };

  return (
    <SelectContext.Provider
      value={{
        value: currentValue,
        onValueChange: handleValueChange,
        open,
        setOpen,
        selectedLabel,
        setSelectedLabel,
        registerOption,
      }}
    >
      <div className="relative inline-block w-full text-left" ref={selectRef}>
        {children}
      </div>
    </SelectContext.Provider>
  );
}

export interface SelectTriggerProps extends React.HTMLAttributes<HTMLButtonElement> {
  className?: string;
  children?: React.ReactNode;
}

export const SelectTrigger = React.forwardRef<HTMLButtonElement, SelectTriggerProps>(
  ({ className, children, ...props }, ref) => {
    const { open, setOpen } = useSelectContext();

    return (
      <button
        type="button"
        ref={ref}
        onClick={() => setOpen((prev) => !prev)}
        className={cn(
          "flex h-9 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-colors hover:bg-accent/50",
          className
        )}
        {...props}
      >
        <span className="truncate">{children}</span>
        <ChevronDown className={cn("h-4 w-4 opacity-50 transition-transform duration-200", open && "rotate-180")} />
      </button>
    );
  }
);
SelectTrigger.displayName = "SelectTrigger";

export function SelectValue({ placeholder }: { placeholder?: string }) {
  const { selectedLabel, value } = useSelectContext();

  if (!value && placeholder) {
    return <span className="text-muted-foreground">{placeholder}</span>;
  }

  return <span>{selectedLabel || value || placeholder || ""}</span>;
}

export interface SelectContentProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
  children?: React.ReactNode;
}

export const SelectContent = React.forwardRef<HTMLDivElement, SelectContentProps>(
  ({ className, children, ...props }, ref) => {
    const { open } = useSelectContext();

    if (!open) return null;

    return (
      <div
        ref={ref}
        className={cn(
          "absolute left-0 top-full z-50 mt-1 max-h-60 w-full overflow-y-auto rounded-md border border-border bg-popover p-1 text-popover-foreground shadow-lg transition-all animate-in fade-in-80 zoom-in-95",
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);
SelectContent.displayName = "SelectContent";

export interface SelectItemProps extends React.HTMLAttributes<HTMLDivElement> {
  value: string;
  disabled?: boolean;
  className?: string;
  children?: React.ReactNode;
}

export const SelectItem = React.forwardRef<HTMLDivElement, SelectItemProps>(
  ({ className, children, value, disabled, onClick, ...props }, ref) => {
    const ctx = useSelectContext();
    const isSelected = ctx.value === value;

    const labelText = typeof children === "string" ? children : String(children || value);

    React.useEffect(() => {
      ctx.registerOption(value, labelText);
    }, [value, labelText, ctx]);

    const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
      if (disabled) return;
      onClick?.(e);
      ctx.onValueChange?.(value);
    };

    return (
      <div
        ref={ref}
        role="option"
        aria-selected={isSelected}
        onClick={handleClick}
        className={cn(
          "relative flex w-full cursor-pointer select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
          isSelected && "bg-accent/60 font-semibold text-accent-foreground",
          disabled && "pointer-events-none opacity-50 cursor-not-allowed",
          className
        )}
        {...props}
      >
        {isSelected && (
          <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center text-blue-600">
            <Check className="h-4 w-4" />
          </span>
        )}
        <span className="truncate">{children}</span>
      </div>
    );
  }
);
SelectItem.displayName = "SelectItem";
