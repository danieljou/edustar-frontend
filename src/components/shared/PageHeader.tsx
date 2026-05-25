import { cn } from "@/lib/utils";

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  actions?: React.ReactNode;
  className?: string;
}

export function PageHeader({ title, subtitle, actions, className }: PageHeaderProps) {
  return (
    <div className={cn("flex items-start justify-between gap-4 flex-wrap mb-5", className)}>
      <div>
        <h1 className="font-serif text-[22px] text-[var(--ink)] leading-tight tracking-[-0.03em]">
          {title}
        </h1>
        {subtitle && (
          <p className="text-[12px] text-[var(--ink-4)] mt-1">{subtitle}</p>
        )}
      </div>
      {actions && <div className="flex items-center gap-2 flex-wrap">{actions}</div>}
    </div>
  );
}
