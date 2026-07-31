import * as React from "react";
import { cn } from "@/lib/utils";

export interface RadioItemProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

const RadioItem = React.forwardRef<HTMLInputElement, RadioItemProps>(
  ({ className, label, id, ...props }, ref) => {
    return (
      <label className="inline-flex items-center gap-2 cursor-pointer text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
        <input
          type="radio"
          id={id}
          ref={ref}
          className={cn(
            "h-4 w-4 rounded-full border border-primary text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 accent-primary",
            className
          )}
          {...props}
        />
        {label && <span>{label}</span>}
      </label>
    );
  }
);
RadioItem.displayName = "RadioItem";

export interface RadioGroupProps extends React.HTMLAttributes<HTMLDivElement> {}

const RadioGroup = React.forwardRef<HTMLDivElement, RadioGroupProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <div role="radiogroup" className={cn("grid gap-2", className)} ref={ref} {...props}>
        {children}
      </div>
    );
  }
);
RadioGroup.displayName = "RadioGroup";

export { RadioGroup, RadioItem };
