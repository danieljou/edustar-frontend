"use client";
import { cn } from "@/lib/utils";
import { Search } from "lucide-react";
import { useTranslation } from "react-i18next";

interface EmptyStateProps {
  title?: string;
  description?: string;
  icon?: React.ReactNode;
  action?: React.ReactNode;
  className?: string;
}

export function EmptyState({
  title,
  description,
  icon,
  action,
  className,
}: EmptyStateProps) {
  const { t } = useTranslation("common");

  const resolvedTitle = title ?? t("table.noResults");
  const resolvedDescription = description ?? t("misc.noData");

  return (
    <div className={cn("text-center py-10 px-5", className)}>
      <div className="w-12 h-12 rounded-full bg-[var(--blue-light)] flex items-center justify-center mx-auto mb-3">
        {icon || <Search className="w-5 h-5 text-[var(--blue)]" />}
      </div>
      <h3 className="text-[13.5px] font-semibold text-[var(--ink)] mb-1">{resolvedTitle}</h3>
      <p className="text-[12px] text-[var(--ink-4)] max-w-xs mx-auto">{resolvedDescription}</p>
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}
