"use client";

import { type Table } from "@tanstack/react-table";
import { Search, X } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  DataTableFacetedFilter,
  type FilterOption,
} from "./data-table-faceted-filter";
import { DataTableViewOptions } from "./data-table-view-options";

export interface FilterField {
  /** ID de la colonne TanStack Table */
  columnId: string;
  /** Label affiché sur le bouton filtre */
  title: string;
  /** Options disponibles pour ce filtre */
  options: FilterOption[];
}

interface DataTableToolbarProps<TData> {
  table: Table<TData>;
  searchKey?: string;
  searchPlaceholder?: string;
  /** Filtres facettés dynamiques — un bouton par entrée */
  filterFields?: FilterField[];
  /** Affiche le sélecteur de colonnes visibles */
  showViewOptions?: boolean;
  className?: string;
}

export function DataTableToolbar<TData>({
  table,
  searchKey,
  searchPlaceholder = "Rechercher…",
  filterFields = [],
  showViewOptions = true,
  className,
}: DataTableToolbarProps<TData>) {
  const isFiltered =
    table.getState().columnFilters.length > 0 ||
    !!table.getState().globalFilter;

  const searchValue = searchKey
    ? ((table.getColumn(searchKey)?.getFilterValue() as string) ?? "")
    : "";

  return (
    <div
      className={cn(
        "flex flex-wrap items-center gap-2 px-3 py-2.5 border-b border-[var(--line)]",
        className
      )}
    >
      {/* Recherche texte */}
      {searchKey && (
        <div className="relative flex-1 min-w-[160px] max-w-[260px]">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[var(--ink-4)] pointer-events-none" />
          <Input
            placeholder={searchPlaceholder}
            value={searchValue}
            onChange={(e) =>
              table.getColumn(searchKey)?.setFilterValue(e.target.value)
            }
            className="pl-8 h-8 text-xs border-[var(--line-d)] bg-white placeholder:text-[var(--ink-5)] focus-visible:ring-[var(--violet)]"
          />
        </div>
      )}

      {/* Filtres facettés dynamiques */}
      {filterFields.map((field) => (
        <DataTableFacetedFilter
          key={field.columnId}
          column={table.getColumn(field.columnId)}
          title={field.title}
          options={field.options}
        />
      ))}

      {/* Bouton reset global */}
      {isFiltered && (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => {
            table.resetColumnFilters();
            table.resetGlobalFilter();
          }}
          className="h-8 px-2 text-xs text-[var(--ink-3)] hover:text-[var(--ink)]"
        >
          Réinitialiser
          <X className="ml-1.5 h-3 w-3" />
        </Button>
      )}

      {/* Sélecteur de colonnes — poussé à droite */}
      {showViewOptions && <DataTableViewOptions table={table} />}
    </div>
  );
}
