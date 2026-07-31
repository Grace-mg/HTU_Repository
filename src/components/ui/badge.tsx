import * as React from "react";
import { cn } from "@/lib/utils";

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?:
    | "default"
    | "secondary"
    | "outline"
    | "destructive"
    | "success"
    | "warning";
  pill?: boolean;
}

function Badge({
  className,
  variant = "default",
  pill = false,
  ...props
}: BadgeProps) {
  const baseStyles =
    "inline-flex items-center text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 px-2.5 py-0.5";

  const shapeStyles = pill ? "rounded-full" : "rounded-md";

  const variantStyles = {
    default: "border-transparent bg-primary text-primary-foreground hover:bg-primary/80",
    secondary:
      "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
    outline: "text-foreground border border-input",
    destructive:
      "border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80",
    success:
      "border-transparent bg-emerald-600 text-white dark:bg-emerald-500",
    warning:
      "border-transparent bg-amber-500 text-white dark:bg-amber-600",
  };

  return (
    <div
      className={cn(baseStyles, shapeStyles, variantStyles[variant], className)}
      {...props}
    />
  );
}

export { Badge };
