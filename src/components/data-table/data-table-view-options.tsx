"use client";

import { type Table } from "@tanstack/react-table";
import { Check, Columns3 } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

// Resolve a human-readable label for a column
function resolveLabel(id: string, meta: unknown): string {
  if (meta && typeof meta === "object" && "label" in meta && typeof (meta as Record<string, unknown>).label === "string") {
    return (meta as Record<string, string>).label;
  }
  // prettify raw ID
  const map: Record<string, string> = {
    code: "Code",
    student: "Étudiant",
    classe: "Classe",
    moy: "Moyenne",
    absences: "Absences",
    solde: "Solde",
    statut: "Statut",
    actions: "Actions",
    nom: "Nom",
    prenom: "Prénom",
    email: "E-mail",
    tel: "Téléphone",
    role: "Rôle",
    date: "Date",
    matiere: "Matière",
    professeur: "Professeur",
    salle: "Salle",
    jour: "Jour",
    heure: "Heure",
    filiere: "Filière",
    session: "Session",
    montant: "Montant",
    type: "Type",
  };
  if (map[id]) return map[id];
  return id
    .replace(/_/g, " ")
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

interface DataTableViewOptionsProps<TData> {
  table: Table<TData>;
}

export function DataTableViewOptions<TData>({
  table,
}: DataTableViewOptionsProps<TData>) {
  const toggleableColumns = table
    .getAllColumns()
    .filter((col) => col.getCanHide() && col.id !== "actions" && col.id !== "__expand__");

  if (toggleableColumns.length === 0) return null;

  const allVisible = toggleableColumns.every((col) => col.getIsVisible());
  const noneVisible = toggleableColumns.every((col) => !col.getIsVisible());

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="h-8 border-[var(--line-dark)] text-xs text-[var(--ink-3)] gap-1.5 ml-auto"
        >
          <Columns3 className="h-3.5 w-3.5" />
          Colonnes
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-[180px]">
        <DropdownMenuLabel className="text-[10px] font-bold uppercase tracking-wider text-[var(--ink-4)] py-1.5">
          Colonnes visibles
        </DropdownMenuLabel>
        <DropdownMenuSeparator />

        <div className="py-1 px-1">
          {toggleableColumns.map((col) => {
            const isVisible = col.getIsVisible();
            const label = resolveLabel(col.id, col.columnDef.meta);

            return (
              <button
                key={col.id}
                onClick={() => col.toggleVisibility(!isVisible)}
                className={cn(
                  "flex w-full items-center gap-2.5 px-2 py-[7px] text-[12px] rounded-[5px] transition-colors",
                  "hover:bg-[var(--blue-lighter)] text-[var(--ink-2)]"
                )}
              >
                {/* Checkbox */}
                <div
                  className={cn(
                    "flex h-[15px] w-[15px] shrink-0 items-center justify-center rounded-[3px] border transition-colors",
                    isVisible
                      ? "bg-[var(--blue)] border-[var(--blue)]"
                      : "bg-white border-[var(--line-dark)]"
                  )}
                >
                  {isVisible && <Check className="h-2.5 w-2.5 text-white stroke-[2.5]" />}
                </div>
                <span className="truncate">{label}</span>
              </button>
            );
          })}
        </div>

        <DropdownMenuSeparator />

        {/* Tout afficher / Tout masquer */}
        <div className="flex gap-1 px-1.5 py-1.5">
          <button
            onClick={() => toggleableColumns.forEach((col) => col.toggleVisibility(true))}
            disabled={allVisible}
            className={cn(
              "flex-1 text-[10.5px] text-center py-1 rounded-[4px] transition-colors font-medium",
              allVisible
                ? "text-[var(--ink-5)] cursor-not-allowed"
                : "hover:bg-[var(--blue-light)] text-[var(--blue)] hover:text-[var(--blue-dark)]"
            )}
          >
            Tout afficher
          </button>
          <div className="w-px bg-[var(--line)]" />
          <button
            onClick={() => toggleableColumns.forEach((col) => col.toggleVisibility(false))}
            disabled={noneVisible}
            className={cn(
              "flex-1 text-[10.5px] text-center py-1 rounded-[4px] transition-colors font-medium",
              noneVisible
                ? "text-[var(--ink-5)] cursor-not-allowed"
                : "hover:bg-[var(--blue-light)] text-[var(--blue)] hover:text-[var(--blue-dark)]"
            )}
          >
            Tout masquer
          </button>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
