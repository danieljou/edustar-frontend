"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Clock } from "lucide-react";
import { EmploiDuTemps } from "@/types";
import { DataTableColumnHeader } from "../data-table-column-header";

const JOUR_ORDER: Record<string, number> = {
  "Lundi": 1,
  "Mardi": 2,
  "Mercredi": 3,
  "Jeudi": 4,
  "Vendredi": 5,
  "Samedi": 6,
};

export const scheduleColumns: ColumnDef<EmploiDuTemps>[] = [
  {
    accessorKey: "jour",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Jour" />,
    cell: ({ row }) => {
      const jour = row.getValue("jour") as string;
      return (
        <div>
          <div className="font-bold text-[var(--ink)]">{jour}</div>
        </div>
      );
    },
    size: 80,
  },
  {
    id: "horaire",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Horaire" />,
    cell: ({ row }) => {
      const emploi = row.original;
      return (
        <div className="flex items-center gap-1.5">
          <Clock className="w-3.5 h-3.5 text-[var(--ink-4)]" />
          <span className="font-mono font-bold text-[11px]">{emploi.hDebut} - {emploi.hFin}</span>
        </div>
      );
    },
  },
  {
    accessorKey: "matiere",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Matière" />,
    cell: ({ row }) => <span className="font-semibold text-[var(--ink)]">{row.getValue("matiere")}</span>,
  },
  {
    accessorKey: "classe",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Classe" />,
    cell: ({ row }) => <span className="text-[11px] font-medium">{row.getValue("classe")}</span>,
    size: 80,
  },
  {
    accessorKey: "salle",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Salle" />,
    cell: ({ row }) => (
      <div className="flex items-center justify-center px-2 py-1 bg-[var(--line)] rounded-[5px] w-fit">
        <span className="font-bold text-[11px] text-[var(--ink)]">{row.getValue("salle")}</span>
      </div>
    ),
    size: 70,
  },
  {
    accessorKey: "enseignant",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Enseignant" />,
    cell: ({ row }) => <span className="text-[var(--ink-3)]">{row.getValue("enseignant")}</span>,
  },
  {
    accessorKey: "type",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Type" />,
    cell: ({ row }) => {
      const type = row.getValue("type") as string;
      const variant = type === "CM" ? "blue" : type === "TD" ? "green" : "amber";
      return (
        <span className={`px-2 py-1 rounded-[5px] text-[10px] font-bold ${
          variant === "blue" ? "bg-[var(--blue-light)] text-[var(--blue)]" :
          variant === "green" ? "bg-[var(--success-light)] text-[var(--success)]" :
          "bg-[var(--warning-light)] text-[var(--warning)]"
        }`}>
          {type}
        </span>
      );
    },
    size: 60,
  },
];
