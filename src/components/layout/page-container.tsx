import * as React from "react";
import { cn } from "@/lib/utils";

export interface PageContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  maxWidth?: "default" | "narrow" | "full";
}

export function PageContainer({
  className,
  children,
  maxWidth = "default",
  ...props
}: PageContainerProps) {
  const widthClasses = {
    narrow: "max-w-4xl",
    default: "max-w-7xl",
    full: "max-w-full",
  };

  return (
    <div
      className={cn(
        "mx-auto w-full px-4 py-6 sm:px-6 lg:px-8",
        widthClasses[maxWidth],
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
