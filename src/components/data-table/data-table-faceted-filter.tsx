"use client";

import { type Column } from "@tanstack/react-table";
import { Check, PlusCircle, X } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";

export interface FilterOption {
  label: string;
  value: string;
  icon?: React.ComponentType<{ className?: string }>;
  color?: string;
}

interface DataTableFacetedFilterProps<TData, TValue> {
  column?: Column<TData, TValue>;
  title: string;
  options: FilterOption[];
}

export function DataTableFacetedFilter<TData, TValue>({
  column,
  title,
  options,
}: DataTableFacetedFilterProps<TData, TValue>) {
  const selected = new Set(column?.getFilterValue() as string[] | undefined ?? []);

  function toggle(value: string) {
    const next = new Set(selected);
    next.has(value) ? next.delete(value) : next.add(value);
    column?.setFilterValue(next.size ? Array.from(next) : undefined);
  }

  function clear() {
    column?.setFilterValue(undefined);
  }

  const hasFilter = selected.size > 0;

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className={cn(
            "h-8 text-xs gap-1.5 transition-colors",
            hasFilter
              ? "border-[var(--blue)] bg-[var(--blue-lighter)] text-[var(--blue)] hover:bg-[var(--blue-light)]"
              : "border-dashed border-[var(--line-dark)] text-[var(--ink-3)]"
          )}
        >
          <PlusCircle className="h-3.5 w-3.5 shrink-0" />
          {title}
          {hasFilter && (
            <>
              <Separator orientation="vertical" className="mx-0.5 h-4" />
              {selected.size <= 2 ? (
                Array.from(selected).map((v) => {
                  const opt = options.find((o) => o.value === v);
                  return (
                    <Badge
                      key={v}
                      variant="blue"
                      className="rounded-sm px-1.5 py-0 text-[10px] font-semibold"
                    >
                      {opt?.label ?? v}
                    </Badge>
                  );
                })
              ) : (
                <Badge
                  variant="blue"
                  className="rounded-sm px-1.5 py-0 text-[10px] font-semibold"
                >
                  {selected.size} sélectionnés
                </Badge>
              )}
            </>
          )}
        </Button>
      </PopoverTrigger>

      <PopoverContent className="w-[210px] p-0" align="start">
        {/* Header */}
        <div className="flex items-center justify-between px-3 py-2 border-b border-[var(--line)]">
          <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--ink-4)]">
            {title}
          </span>
          {hasFilter && (
            <button
              onClick={clear}
              className="flex items-center gap-1 text-[10.5px] text-[var(--ink-4)] hover:text-[var(--danger)] transition-colors"
            >
              <X className="h-3 w-3" /> Effacer
            </button>
          )}
        </div>

        {/* Options */}
        <div className="py-1 max-h-[260px] overflow-y-auto">
          {options.map((opt) => {
            const isSelected = selected.has(opt.value);
            const count = column?.getFacetedUniqueValues()?.get(opt.value);
            return (
              <button
                key={opt.value}
                onClick={() => toggle(opt.value)}
                className={cn(
                  "flex w-full items-center gap-2.5 px-3 py-[8px] text-[12px] transition-colors",
                  isSelected
                    ? "bg-[var(--blue-lighter)] text-[var(--ink)]"
                    : "hover:bg-[var(--ivory)] text-[var(--ink-2)]"
                )}
              >
                {/* Checkbox */}
                <div
                  className={cn(
                    "flex h-[15px] w-[15px] shrink-0 items-center justify-center rounded-[3px] border transition-colors",
                    isSelected
                      ? "bg-[var(--blue)] border-[var(--blue)]"
                      : "bg-white border-[var(--line-dark)]"
                  )}
                >
                  {isSelected && <Check className="h-2.5 w-2.5 text-white stroke-[2.5]" />}
                </div>

                {/* Color dot */}
                {opt.color && (
                  <span className={cn("h-2 w-2 rounded-full shrink-0", opt.color)} />
                )}

                {/* Icon */}
                {opt.icon && (
                  <opt.icon className="h-3.5 w-3.5 text-[var(--ink-4)] shrink-0" />
                )}

                <span className="flex-1 text-left truncate">{opt.label}</span>

                {/* Count badge */}
                {count != null && (
                  <span className={cn(
                    "ml-auto text-[10px] font-mono px-1.5 py-0.5 rounded-[3px]",
                    isSelected
                      ? "bg-[var(--blue-light)] text-[var(--blue)]"
                      : "bg-[var(--ivory)] text-[var(--ink-5)]"
                  )}>
                    {count}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </PopoverContent>
    </Popover>
  );
}
