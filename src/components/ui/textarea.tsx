import * as React from "react";
import { cn } from "@/lib/utils";

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, ...props }, ref) => {
    return (
      <textarea
        className={cn(
          "w-full px-3 py-2 border-[1.5px] border-[var(--line-dark)] rounded-[6px] text-[13px] text-[var(--ink)] bg-white outline-none transition-all duration-150 resize-vertical min-h-[68px]",
          "placeholder:text-[var(--ink-4)]",
          "focus:border-[var(--blue)] focus:shadow-[0_0_0_3px_rgba(26,60,143,0.1)]",
          "disabled:bg-[var(--ivory)] disabled:text-[var(--ink-4)] disabled:cursor-not-allowed",
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Textarea.displayName = "Textarea";

export { Textarea };
