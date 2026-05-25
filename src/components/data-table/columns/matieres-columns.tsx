"use client";

import { ColumnDef } from "@tanstack/react-table";
import { BookOpen } from "lucide-react";
import { Matiere } from "@/types";
import { EduBadge } from "@/components/shared";
import { Button } from "@/components/ui/button";
import { DataTableColumnHeader } from "../data-table-column-header";

const TYPE_COLORS: Record<string, string> = {
  "CM": "var(--blue)",
  "TD": "var(--green)",
  "TP": "var(--orange)",
};

const TYPE_BADGE: Record<string, "blue" | "green" | "amber" | "neutral"> = {
  "CM": "blue",
  "TD": "green",
  "TP": "amber",
};

export const matieresColumns: ColumnDef<Matiere>[] = [
  {
    accessorKey: "code",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Code" />,
    cell: ({ row }) => <span className="font-mono font-bold text-[11px] text-[var(--blue)]">{row.getValue("code")}</span>,
    size: 80,
  },
  {
    id: "matiere",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Intitulé de la matière" />,
    cell: ({ row }) => {
      const matiere = row.original;
      return (
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-[5px] flex items-center justify-center shrink-0" style={{ background: `${TYPE_COLORS[matiere.type] ?? "var(--blue)"}18` }}>
            <BookOpen className="w-3 h-3" style={{ color: TYPE_COLORS[matiere.type] ?? "var(--blue)" }} />
          </div>
          <span className="font-medium text-[var(--ink)] max-w-[200px] truncate">{matiere.lib}</span>
        </div>
      );
    },
  },
  {
    accessorKey: "filiere",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Filière" />,
    cell: ({ row }) => <span className="text-[var(--ink-3)]">{row.getValue("filiere")}</span>,
  },
  {
    accessorKey: "niveau",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Niveau" />,
    cell: ({ row }) => <EduBadge variant="neutral">{row.getValue("niveau")}</EduBadge>,
    size: 90,
  },
  {
    accessorKey: "credits",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Crédits" />,
    cell: ({ row }) => <div className="flex items-center justify-center w-8 h-6 rounded-[5px] bg-[var(--blue-light)] text-[var(--blue)] font-bold text-[11px]">{row.getValue("credits")}</div>,
    size: 70,
  },
  {
    accessorKey: "coeff",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Coeff." />,
    cell: ({ row }) => <div className="flex items-center justify-center w-8 h-6 rounded-[5px] bg-[var(--line)] text-[var(--ink-3)] font-bold text-[11px]">{row.getValue("coeff")}</div>,
    size: 70,
  },
  {
    accessorKey: "type",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Type" />,
    cell: ({ row }) => {
      const type = row.getValue("type") as string;
      return <EduBadge variant={TYPE_BADGE[type] ?? "blue"}>{type}</EduBadge>;
    },
    size: 70,
  },
  {
    accessorKey: "ens",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Enseignant" />,
    cell: ({ row }) => <span className="text-[var(--ink-3)]">{row.getValue("ens")}</span>,
  },
  {
    id: "actions",
    header: () => null,
    cell: () => <Button variant="ghost" size="xs">Modifier</Button>,
    size: 70,
  },
];
