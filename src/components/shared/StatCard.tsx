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
        "bg-white border-[1.5px] border-[var(--line)] rounded-[14px] px-[18px] py-4 relative overflow-hidden",
        className
      )}
    >
      {/* Left accent bar */}
      <div
        className="absolute left-0 top-0 bottom-0 w-[3px] rounded-l-[14px]"
        style={{ background: color }}
      />

      <div className="flex items-start justify-between gap-3 pl-1">
        <div className="flex-1 min-w-0">
          <div className="text-[10px] font-bold uppercase tracking-[0.07em] text-[var(--ink-4)]">
            {label}
          </div>
          <div
            className="font-serif text-[26px] leading-none mt-2 tracking-[-0.03em] text-[var(--ink)]"
          >
            {value}
          </div>
          {trend && (
            <div className={cn(
              "flex items-center gap-1 text-[11px] font-medium mt-1.5",
              trend.neutral ? "text-[var(--ink-4)]" :
              trend.up ? "text-[var(--success)]" : "text-[var(--danger)]"
            )}>
              {trend.neutral ? <Minus className="w-3 h-3" /> :
               trend.up ? <TrendingUp className="w-3 h-3" /> :
               <TrendingDown className="w-3 h-3" />}
              {trend.value}
            </div>
          )}
        </div>
        {icon && (
          <div
            className="w-9 h-9 rounded-[8px] flex items-center justify-center shrink-0"
            style={{ background: `${color}18` }}
          >
            <span style={{ color }}>{icon}</span>
          </div>
        )}
      </div>
    </div>
  );
}
