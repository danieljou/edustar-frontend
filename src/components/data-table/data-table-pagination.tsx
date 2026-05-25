"use client";

import { type Table } from "@tanstack/react-table";
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface DataTablePaginationProps<TData> {
  table: Table<TData>;
  pageSizeOptions?: number[];
}

export function DataTablePagination<TData>({
  table,
  pageSizeOptions = [5, 10, 20, 50],
}: DataTablePaginationProps<TData>) {
  return (
    <div className="flex items-center justify-between px-3 py-2.5 border-t border-[var(--line)]">
      {/* Rows per page */}
      <div className="flex items-center gap-2">
        <span className="text-[11px] text-[var(--ink-4)]">Lignes par page</span>
        <Select
          value={`${table.getState().pagination.pageSize}`}
          onValueChange={(v) => table.setPageSize(Number(v))}
        >
          <SelectTrigger className="h-7 w-[60px] text-xs border-[var(--line-d)] bg-white">
            <SelectValue />
          </SelectTrigger>
          <SelectContent side="top" className="text-xs">
            {pageSizeOptions.map((n) => (
              <SelectItem key={n} value={`${n}`} className="text-xs">
                {n}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Page info + nav */}
      <div className="flex items-center gap-1.5">
        <span className="text-[11px] text-[var(--ink-4)]">
          Page{" "}
          <span className="font-semibold text-[var(--ink-2)]">
            {table.getState().pagination.pageIndex + 1}
          </span>{" "}
          / {table.getPageCount()}
        </span>

        <div className="flex items-center gap-0.5 ml-1">
          <Button
            variant="outline"
            size="icon"
            className="h-7 w-7 border-[var(--line-d)]"
            onClick={() => table.setPageIndex(0)}
            disabled={!table.getCanPreviousPage()}
            aria-label="Première page"
          >
            <ChevronsLeft className="h-3.5 w-3.5" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="h-7 w-7 border-[var(--line-d)]"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
            aria-label="Page précédente"
          >
            <ChevronLeft className="h-3.5 w-3.5" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="h-7 w-7 border-[var(--line-d)]"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
            aria-label="Page suivante"
          >
            <ChevronRight className="h-3.5 w-3.5" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="h-7 w-7 border-[var(--line-d)]"
            onClick={() => table.setPageIndex(table.getPageCount() - 1)}
            disabled={!table.getCanNextPage()}
            aria-label="Dernière page"
          >
            <ChevronsRight className="h-3.5 w-3.5" />
          </Button>
        </div>
      </div>
    </div>
  );
}
