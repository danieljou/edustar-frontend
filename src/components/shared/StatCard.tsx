import { cn } from "@/lib/utils";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";

interface StatCardProps {
  label: string;
  value: string | number;
  trend?: { value: string; up?: boolean; neutral?: boolean };
  accent?: "blue" | "green" | "red" | "amber" | "cyan" | "purple";
  icon?: React.ReactNode;
  className?: string;
}

const ACCENT_COLORS: Record<string, string> = {
  blue: "var(--blue)",
  green: "var(--success)",
  red: "var(--danger)",
  amber: "var(--warning)",
  cyan: "var(--cyan)",
  purple: "var(--purple)",
};

export function StatCard({ label, value, trend, accent = "blue", icon, className }: StatCardProps) {
  const color = ACCENT_COLORS[accent];

  return (
    <div
      className={cn(
        "bg-white border-[1.5px] border-[var(--line)] rounded-[14px] px-3.5 py-3 sm:px-[18px] sm:py-4 relative overflow-hidden",
        className
      )}
    >
      {/* Left accent bar */}
      <div
        className="absolute left-0 top-0 bottom-0 w-[3px] rounded-l-[14px]"
        style={{ background: color }}
      />

      <div className="flex items-start justify-between gap-2 pl-1">
        <div className="flex-1 min-w-0">
          <div className="text-[9.5px] sm:text-[10px] font-bold uppercase tracking-[0.07em] text-[var(--ink-4)] leading-tight">
            {label}
          </div>
          <div className="font-serif text-[22px] sm:text-[26px] leading-none mt-1.5 sm:mt-2 tracking-[-0.03em] text-[var(--ink)]">
            {value}
          </div>
          {trend && (
            <div className={cn(
              "flex items-center gap-1 text-[10px] sm:text-[11px] font-medium mt-1 sm:mt-1.5 truncate",
              trend.neutral ? "text-[var(--ink-4)]" :
              trend.up ? "text-[var(--success)]" : "text-[var(--danger)]"
            )}>
              {trend.neutral ? <Minus className="w-2.5 h-2.5 shrink-0" /> :
               trend.up ? <TrendingUp className="w-2.5 h-2.5 shrink-0" /> :
               <TrendingDown className="w-2.5 h-2.5 shrink-0" />}
              <span className="truncate">{trend.value}</span>
            </div>
          )}
        </div>
        {icon && (
          <div
            className="w-8 h-8 sm:w-9 sm:h-9 rounded-[8px] flex items-center justify-center shrink-0"
            style={{ background: `${color}18` }}
          >
            <span style={{ color }}>{icon}</span>
          </div>
        )}
      </div>
    </div>
  );
}
