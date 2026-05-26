"use client";

import { type Column } from "@tanstack/react-table";
import { Check, PlusCircle } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";

export interface FilterOption {
  label: string;
  value: string;
  /** Icône optionnelle affichée devant le label */
  icon?: React.ComponentType<{ className?: string }>;
  /** Pastille colorée (classe Tailwind bg-*) */
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
  const selected = new Set(column?.getFilterValue() as string[]);

  function toggle(value: string) {
    const next = new Set(selected);
    next.has(value) ? next.delete(value) : next.add(value);
    column?.setFilterValue(next.size ? Array.from(next) : undefined);
  }

  function clear() {
    column?.setFilterValue(undefined);
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="h-8 border-dashed border-[var(--line-d)] text-xs text-[var(--ink-3)] gap-1.5"
        >
          <PlusCircle className="h-3.5 w-3.5" />
          {title}
          {selected.size > 0 && (
            <>
              <Separator orientation="vertical" className="mx-0.5 h-4" />
              {selected.size <= 2 ? (
                Array.from(selected).map((v) => {
                  const opt = options.find((o) => o.value === v);
                  return (
                    <Badge
                      key={v}
                      variant="purple"
                      className="rounded-sm px-1.5 py-0 text-[10px] font-medium"
                    >
                      {opt?.label ?? v}
                    </Badge>
                  );
                })
              ) : (
                <Badge
                  variant="purple"
                  className="rounded-sm px-1.5 py-0 text-[10px] font-medium"
                >
                  {selected.size} sélectionnés
                </Badge>
              )}
            </>
          )}
        </Button>
      </PopoverTrigger>

      <PopoverContent className="w-[200px] p-0" align="start">
        {/* Options */}
        <div className="py-1">
          {options.map((opt) => {
            const isSelected = selected.has(opt.value);
            return (
              <button
                key={opt.value}
                onClick={() => toggle(opt.value)}
                className={cn(
                  "flex w-full items-center gap-2.5 px-3 py-2 text-xs transition-colors",
                  "hover:bg-[var(--ivory)] text-[var(--ink-2)]",
                  isSelected && "text-[var(--ink)]"
                )}
              >
                {/* Checkbox visuel */}
                <div
                  className={cn(
                    "flex h-4 w-4 shrink-0 items-center justify-center rounded-sm border border-[var(--line-d)]",
                    isSelected
                      ? "bg-[var(--violet)] border-[var(--violet)]"
                      : "bg-white"
                  )}
                >
                  {isSelected && <Check className="h-3 w-3 text-white" />}
                </div>

                {/* Pastille couleur optionnelle */}
                {opt.color && (
                  <span
                    className={cn("h-2 w-2 rounded-full shrink-0", opt.color)}
                  />
                )}

                {/* Icône optionnelle */}
                {opt.icon && (
                  <opt.icon className="h-3.5 w-3.5 text-[var(--ink-4)] shrink-0" />
                )}

                <span className="flex-1 text-left truncate">{opt.label}</span>

                {/* Compteur facette */}
                {column?.getFacetedUniqueValues()?.get(opt.value) != null && (
                  <span className="ml-auto text-[10px] font-mono text-[var(--ink-5)]">
                    {column.getFacetedUniqueValues().get(opt.value)}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Reset */}
        {selected.size > 0 && (
          <>
            <Separator />
            <button
              onClick={clear}
              className="flex w-full items-center justify-center py-2 text-[11px] text-[var(--ink-4)] hover:text-[var(--ink-2)] transition-colors"
            >
              Effacer les filtres
            </button>
          </>
        )}
      </PopoverContent>
    </Popover>
  );
}
