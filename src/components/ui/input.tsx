import * as React from "react";
import { cn } from "@/lib/utils";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(({ className, type, ...props }, ref) => {
  return (
    <input
      type={type}
      className={cn(
        "w-full px-3 py-[8px] border-[1.5px] border-[var(--line-dark)] rounded-[6px] text-[13px] text-[var(--ink)] bg-white outline-none transition-all duration-150",
        "placeholder:text-[var(--ink-4)]",
        "focus:border-[var(--blue)] focus:shadow-[0_0_0_3px_rgba(26,60,143,0.1)]",
        "disabled:bg-[var(--ivory)] disabled:text-[var(--ink-4)] disabled:cursor-not-allowed",
        "file:border-0 file:bg-transparent file:text-sm file:font-medium",
        className
      )}
      ref={ref}
      {...props}
    />
  );
});
Input.displayName = "Input";

export { Input };
