"use client";
import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-1.5 whitespace-nowrap rounded-[6px] text-[12.5px] font-semibold border transition-all duration-150 disabled:opacity-40 disabled:pointer-events-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--blue)] focus-visible:ring-offset-1",
  {
    variants: {
      variant: {
        primary: "bg-[var(--blue)] text-white border-[var(--blue)] hover:bg-[var(--blue-dark)] hover:border-[var(--blue-dark)]",
        outline: "bg-white text-[var(--ink-2)] border-[var(--line-dark)] hover:border-[var(--blue)] hover:text-[var(--blue)] hover:bg-[var(--blue-lighter)]",
        ghost: "bg-transparent text-[var(--ink-3)] border-transparent hover:bg-[var(--ivory)] hover:text-[var(--ink)]",
        danger: "bg-[var(--danger-light)] text-[var(--danger)] border-transparent hover:bg-red-200",
        success: "bg-[var(--success-light)] text-[var(--success)] border-transparent hover:bg-emerald-100",
        gradient: "bg-gradient-to-br from-[var(--blue)] to-[var(--cyan)] text-white border-transparent hover:opacity-90",
        link: "text-[var(--blue)] border-transparent bg-transparent hover:underline p-0 h-auto",
      },
      size: {
        default: "h-[34px] px-3.5 py-1.5",
        sm: "h-[28px] px-2.5 py-1 text-[11.5px]",
        xs: "h-[24px] px-2 py-0.5 text-[11px]",
        icon: "h-[30px] w-[30px] p-0",
        "icon-sm": "h-[26px] w-[26px] p-0",
        lg: "h-[40px] px-5 py-2 text-[13.5px]",
      },
    },
    defaultVariants: { variant: "primary", size: "default" },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />;
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
