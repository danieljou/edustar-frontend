"use client";

import {
  flexRender,
  getCoreRowModel,
  getExpandedRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  type ColumnDef,
  type ColumnFiltersState,
  type ExpandedState,
  type Row,
  type SortingState,
  type VisibilityState,
} from "@tanstack/react-table";
import { useMemo, useState } from "react";
import { ChevronRight, ChevronDown } from "lucide-react";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { DataTablePagination } from "./data-table-pagination";
import { DataTableToolbar, type FilterField } from "./data-table-toolbar";

// Skeleton widths — deterministic to avoid hydration mismatch
const SKELETON_WIDTHS = ["72%", "58%", "83%", "65%", "75%", "50%", "68%", "80%", "55%", "70%"];

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  /** Clé de colonne pour la recherche texte */
  searchKey?: string;
  searchPlaceholder?: string;
  /** Filtres facettés dynamiques */
  filterFields?: FilterField[];
  /** Affiche le sélecteur de colonnes visibles */
  showViewOptions?: boolean;
  /** Affiche la pagination */
  pagination?: boolean;
  /** Lignes par page (défaut : 10) */
  pageSize?: number;
  /** Options du sélecteur de taille de page */
  pageSizeOptions?: number[];
  /** Contenu de l'état vide */
  emptyContent?: React.ReactNode;
  /** Visibilité initiale des colonnes (ex: { filiere: false } pour masquer) */
  initialColumnVisibility?: VisibilityState;
  /** Métadonnées transmises aux cellules via table.options.meta */
  meta?: Record<string, unknown>;
  /** En-tête collant au scroll vertical */
  stickyHeader?: boolean;
  /** Hauteur max du conteneur scroll (utilisé avec stickyHeader) */
  maxHeight?: string;
  /** Affiche des lignes skeleton pendant le chargement */
  isLoading?: boolean;
  /** Rendu du contenu de la ligne expandée */
  renderSubComponent?: (row: Row<TData>) => React.ReactNode;
  className?: string;
}

export function DataTable<TData, TValue>({
  columns,
  data,
  searchKey,
  searchPlaceholder = "Rechercher…",
  filterFields = [],
  showViewOptions = true,
  pagination = true,
  pageSize = 10,
  pageSizeOptions,
  emptyContent,
  meta,
  stickyHeader = false,
  maxHeight = "480px",
  isLoading = false,
  renderSubComponent,
  initialColumnVisibility,
  className,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>(initialColumnVisibility ?? {});
  const [expanded, setExpanded] = useState<ExpandedState>({});

  // Injecte automatiquement la colonne d'expansion en première position
  const allColumns = useMemo<ColumnDef<TData, TValue>[]>(() => {
    if (!renderSubComponent) return columns;
    const expandCol: ColumnDef<TData, TValue> = {
      id: "__expand__",
      size: 36,
      enableHiding: false,
      header: () => null,
      cell: ({ row }) =>
        row.getCanExpand() ? (
          <button
            onClick={(e) => { e.stopPropagation(); row.toggleExpanded(); }}
            className="flex items-center justify-center w-5 h-5 rounded hover:bg-[var(--violet-subtle,#ede9ff)] transition-colors"
            aria-label={row.getIsExpanded() ? "Réduire" : "Développer"}
          >
            {row.getIsExpanded()
              ? <ChevronDown className="w-3.5 h-3.5 text-[var(--violet)]" />
              : <ChevronRight className="w-3.5 h-3.5 text-[var(--ink-4)]" />
            }
          </button>
        ) : null,
    } as ColumnDef<TData, TValue>;
    return [expandCol, ...columns];
  }, [columns, renderSubComponent]);

  const table = useReactTable({
    data,
    columns: allColumns,
    meta,
    state: { sorting, columnFilters, columnVisibility, expanded },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onExpandedChange: setExpanded,
    getRowCanExpand: renderSubComponent ? () => true : undefined,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    getExpandedRowModel: getExpandedRowModel(),
    initialState: { pagination: { pageSize } },
  });

  const hasToolbar = !!searchKey || filterFields.length > 0 || showViewOptions;
  const colCount = allColumns.length;

  return (
    <div className={className}>
      {/* Toolbar */}
      {hasToolbar && (
        <DataTableToolbar
          table={table}
          searchKey={searchKey}
          searchPlaceholder={searchPlaceholder}
          filterFields={filterFields}
          showViewOptions={showViewOptions}
        />
      )}

      {/* Table — scroll container (sticky header) */}
      <div
        className="overflow-x-auto"
        style={stickyHeader ? { maxHeight, overflowY: "auto" } : undefined}
      >
        <Table>
          <TableHeader className={stickyHeader ? "sticky top-0 z-10" : undefined}>
            {table.getHeaderGroups().map((hg) => (
              <TableRow
                key={hg.id}
                className="bg-[var(--ivory)] border-b border-[var(--line)] hover:bg-[var(--ivory)]"
              >
                {hg.headers.map((header) => (
                  <TableHead
                    key={header.id}
                    style={{
                      width: header.getSize() !== 150 ? header.getSize() : undefined,
                    }}
                    className="h-8 px-3 text-[9.5px] font-bold uppercase tracking-wider text-[var(--ink-4)] whitespace-nowrap bg-[var(--ivory)]"
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>

          <TableBody>
            {/* Skeleton rows */}
            {isLoading &&
              Array.from({ length: Math.min(pageSize, 6) }).map((_, i) => (
                <TableRow key={`sk-${i}`} className="border-b border-[var(--line)]">
                  {allColumns.map((_, j) => (
                    <TableCell key={j} className="px-3 py-3">
                      <div
                        className="h-2.5 rounded-full bg-[var(--line)] animate-pulse"
                        style={{ width: SKELETON_WIDTHS[(i * allColumns.length + j) % SKELETON_WIDTHS.length] }}
                      />
                    </TableCell>
                  ))}
                </TableRow>
              ))}

            {/* Data rows */}
            {!isLoading && (
              table.getRowModel().rows.length ? (
                table.getRowModel().rows.map((row) => (
                  <>
                    <TableRow
                      key={row.id}
                      data-state={row.getIsSelected() && "selected"}
                      className="border-b border-[var(--line)] last:border-b-0 hover:bg-[var(--ivory)] transition-colors"
                    >
                      {row.getVisibleCells().map((cell) => (
                        <TableCell key={cell.id} className="px-3 py-2.5 text-xs">
                          {flexRender(cell.column.columnDef.cell, cell.getContext())}
                        </TableCell>
                      ))}
                    </TableRow>

                    {/* Expanded sub-row */}
                    {row.getIsExpanded() && renderSubComponent && (
                      <TableRow key={`${row.id}-expanded`} className="hover:bg-transparent">
                        <TableCell
                          colSpan={colCount}
                          className="p-0 border-b border-[var(--line)] bg-[#faf9f7]"
                        >
                          {renderSubComponent(row)}
                        </TableCell>
                      </TableRow>
                    )}
                  </>
                ))
              ) : (
                <TableRow className="hover:bg-transparent">
                  <TableCell colSpan={colCount} className="p-0">
                    {emptyContent ?? (
                      <div className="flex items-center justify-center py-10 text-xs text-[var(--ink-4)]">
                        Aucun résultat
                      </div>
                    )}
                  </TableCell>
                </TableRow>
              )
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {pagination && !isLoading && (
        <DataTablePagination table={table} pageSizeOptions={pageSizeOptions} />
      )}
    </div>
  );
}
