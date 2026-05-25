import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center gap-1 px-[7px] py-[2px] rounded-[4px] text-[10px] font-bold tracking-[0.02em] border select-none",
  {
    variants: {
      variant: {
        blue: "bg-[var(--blue-light)] text-[var(--blue)] border-[rgba(26,60,143,0.18)]",
        green: "bg-[var(--success-light)] text-[var(--success)] border-[rgba(10,124,78,0.18)]",
        red: "bg-[var(--danger-light)] text-[var(--danger)] border-[rgba(192,57,43,0.18)]",
        amber: "bg-[var(--warning-light)] text-[var(--warning)] border-[rgba(180,83,9,0.18)]",
        cyan: "bg-[var(--cyan-light)] text-[var(--cyan)] border-[rgba(0,153,204,0.18)]",
        purple: "bg-[var(--purple-light)] text-[var(--purple)] border-[rgba(107,72,255,0.18)]",
        neutral: "bg-[var(--ivory)] text-[var(--ink-4)] border-[var(--line-dark)]",
        gradient: "bg-gradient-to-r from-[var(--blue)] to-[var(--cyan)] text-white border-transparent",
      },
    },
    defaultVariants: { variant: "neutral" },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return <span className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export { Badge, badgeVariants };
