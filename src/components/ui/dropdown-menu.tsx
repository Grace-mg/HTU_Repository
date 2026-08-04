"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

interface DropdownContextType {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  toggle: () => void;
  close: () => void;
}

const DropdownContext = React.createContext<DropdownContextType | null>(null);

function useDropdown() {
  const context = React.useContext(DropdownContext);
  if (!context) {
    throw new Error("DropdownMenu components must be used within a <DropdownMenu>");
  }
  return context;
}

export interface DropdownMenuProps {
  children?: React.ReactNode;
  trigger?: React.ReactNode; // Backwards compatibility for legacy account-menu
  align?: "left" | "right" | "start" | "center" | "end";
}

export function DropdownMenu({
  children,
  trigger,
  align = "left",
}: DropdownMenuProps) {
  const [open, setOpen] = React.useState(false);
  const menuRef = React.useRef<HTMLDivElement>(null);

  const toggle = React.useCallback(() => setOpen((prev) => !prev), []);
  const close = React.useCallback(() => setOpen(false), []);

  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
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

  // Legacy trigger mode support
  if (trigger) {
    return (
      <div className="relative inline-block text-left" ref={menuRef}>
        <div onClick={toggle}>{trigger}</div>
        {open && (
          <div
            role="menu"
            tabIndex={-1}
            className={cn(
              "absolute z-50 mt-1 min-w-[8rem] overflow-hidden rounded-md border border-border bg-popover p-1 text-popover-foreground shadow-md transition-all",
              align === "right" || align === "end" ? "right-0" : "left-0"
            )}
          >
            <div onClick={close}>{children}</div>
          </div>
        )}
      </div>
    );
  }

  return (
    <DropdownContext.Provider value={{ open, setOpen, toggle, close }}>
      <div className="relative inline-block text-left" ref={menuRef}>
        {children}
      </div>
    </DropdownContext.Provider>
  );
}

export interface DropdownMenuTriggerProps extends React.HTMLAttributes<HTMLDivElement> {
  asChild?: boolean;
}

export const DropdownMenuTrigger = React.forwardRef<HTMLDivElement, DropdownMenuTriggerProps>(
  ({ children, asChild, onClick, className, ...props }, ref) => {
    const { toggle } = useDropdown();

    const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
      onClick?.(e);
      toggle();
    };

    if (asChild && React.isValidElement(children)) {
      const child = children as React.ReactElement<{ onClick?: React.MouseEventHandler }>;
      return React.cloneElement(child, {
        onClick: (e: React.MouseEvent) => {
          child.props.onClick?.(e);
          toggle();
        },
      });
    }

    return (
      <div
        ref={ref}
        onClick={handleClick}
        className={cn("inline-flex cursor-pointer select-none", className)}
        {...props}
      >
        {children}
      </div>
    );
  }
);
DropdownMenuTrigger.displayName = "DropdownMenuTrigger";

export interface DropdownMenuContentProps extends React.HTMLAttributes<HTMLDivElement> {
  align?: "start" | "center" | "end" | "left" | "right";
  sideOffset?: number;
}

export const DropdownMenuContent = React.forwardRef<HTMLDivElement, DropdownMenuContentProps>(
  ({ className, align = "start", children, ...props }, ref) => {
    const { open } = useDropdown();

    if (!open) return null;

    const alignClass =
      align === "end" || align === "right"
        ? "right-0"
        : align === "center"
        ? "left-1/2 -translate-x-1/2"
        : "left-0";

    return (
      <div
        ref={ref}
        role="menu"
        tabIndex={-1}
        className={cn(
          "absolute z-50 mt-1 min-w-[8rem] overflow-hidden rounded-md border border-border bg-popover p-1 text-popover-foreground shadow-md transition-all animate-in fade-in-80 zoom-in-95",
          alignClass,
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);
DropdownMenuContent.displayName = "DropdownMenuContent";

export function DropdownMenuGroup({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("py-0.5", className)} {...props} />;
}

export interface DropdownMenuItemProps extends React.HTMLAttributes<HTMLDivElement> {
  destructive?: boolean;
  disabled?: boolean;
  inset?: boolean;
}

export const DropdownMenuItem = React.forwardRef<HTMLDivElement, DropdownMenuItemProps>(
  ({ className, destructive = false, disabled = false, inset = false, onClick, ...props }, ref) => {
    const context = React.useContext(DropdownContext);

    const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
      if (disabled) return;
      onClick?.(e);
      context?.close();
    };

    return (
      <div
        ref={ref}
        role="menuitem"
        tabIndex={disabled ? -1 : 0}
        onClick={handleClick}
        className={cn(
          "relative flex cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
          inset && "pl-8",
          destructive &&
            "text-destructive hover:bg-destructive/10 hover:text-destructive focus:bg-destructive/10 focus:text-destructive",
          disabled && "pointer-events-none opacity-50 cursor-not-allowed",
          className
        )}
        {...props}
      />
    );
  }
);
DropdownMenuItem.displayName = "DropdownMenuItem";

export function DropdownMenuLabel({
  className,
  inset,
  ...props
}: React.HTMLAttributes<HTMLDivElement> & { inset?: boolean }) {
  return (
    <div
      className={cn(
        "px-2 py-1.5 text-xs font-semibold text-muted-foreground",
        inset && "pl-8",
        className
      )}
      {...props}
    />
  );
}

export function DropdownMenuSeparator({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("-mx-1 my-1 h-px bg-border", className)} {...props} />;
}

export function DropdownMenuShortcut({
  className,
  ...props
}: React.HTMLAttributes<HTMLSpanElement>) {
  return (
    <span
      className={cn("ml-auto text-xs tracking-widest text-muted-foreground opacity-60", className)}
      {...props}
    />
  );
}

/* ── SubMenu Primitives ── */

interface SubContextType {
  subOpen: boolean;
  setSubOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const SubContext = React.createContext<SubContextType | null>(null);

export function DropdownMenuSub({ children }: { children: React.ReactNode }) {
  const [subOpen, setSubOpen] = React.useState(false);

  return (
    <SubContext.Provider value={{ subOpen, setSubOpen }}>
      <div
        className="relative"
        onMouseEnter={() => setSubOpen(true)}
        onMouseLeave={() => setSubOpen(false)}
      >
        {children}
      </div>
    </SubContext.Provider>
  );
}

export function DropdownMenuSubTrigger({
  className,
  inset,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement> & { inset?: boolean }) {
  const sub = React.useContext(SubContext);
  return (
    <div
      onClick={() => sub?.setSubOpen((prev) => !prev)}
      className={cn(
        "flex cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none hover:bg-accent hover:text-accent-foreground",
        inset && "pl-8",
        className
      )}
      {...props}
    >
      {children}
      <span className="ml-auto text-xs">▶</span>
    </div>
  );
}

export function DropdownMenuPortal({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

export function DropdownMenuSubContent({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  const sub = React.useContext(SubContext);
  if (!sub?.subOpen) return null;

  return (
    <div
      role="menu"
      className={cn(
        "absolute left-full top-0 z-50 ml-1 min-w-[8rem] overflow-hidden rounded-md border border-border bg-popover p-1 text-popover-foreground shadow-lg animate-in fade-in-80 zoom-in-95",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
