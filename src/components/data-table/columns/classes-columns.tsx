"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { EduBadge } from "@/components/shared";
import { Classe } from "@/types";
import { DataTableColumnHeader } from "../data-table-column-header";
import { EduAvatar } from "@/components/shared/EduAvatar";

const FILIERE_COLORS: Record<string, string> = {
  Informatique: "var(--blue)",
  Gestion: "var(--cyan)",
  Droit: "var(--purple)",
  Lettres: "var(--success)",
};

export const classesColumns: ColumnDef<Classe>[] = [
  {
    accessorKey: "code",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Code classe" />,
    cell: ({ row }) => <span className="font-mono font-bold text-[var(--blue)]">{row.getValue("code")}</span>,
    size: 100,
  },
  {
    accessorKey: "filiere",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Filière" />,
    cell: ({ row }) => {
      const filiere = row.getValue("filiere") as string;
      return <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full" style={{ background: `${FILIERE_COLORS[filiere]}18`, color: FILIERE_COLORS[filiere] }}>{filiere}</span>;
    },
  },
  {
    accessorKey: "niveau",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Niveau" />,
    cell: ({ row }) => <span className="text-[var(--ink-3)]">{row.getValue("niveau")}</span>,
  },
  {
    accessorKey: "effectif",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Effectif" />,
    cell: ({ row }) => {
      const effectif = row.getValue("effectif") as number;
      const filiere = row.original.filiere;
      return (
        <div className="flex items-center gap-2">
          <div className="w-16 h-1.5 bg-[var(--line)] rounded-full overflow-hidden">
            <div className="h-full rounded-full" style={{ width: `${(effectif / 55) * 100}%`, background: FILIERE_COLORS[filiere] }} />
          </div>
          <span className="font-semibold text-[var(--ink)]">{effectif}</span>
        </div>
      );
    },
  },
  {
    accessorKey: "delegue",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Délégué" />,
    cell: ({ row }) => {
      const delegue = row.getValue("delegue") as string;
      return delegue !== "—" ? (
        <div className="flex items-center gap-1.5">
          <EduAvatar name={delegue} size={20} />
          <span className="text-[var(--ink-3)]">{delegue}</span>
        </div>
      ) : (
        <span className="text-[var(--ink-4)]">—</span>
      );
    },
  },
  {
    accessorKey: "responsable",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Responsable" />,
    cell: ({ row }) => <span className="text-[var(--ink-3)]">{row.getValue("responsable")}</span>,
  },
  {
    accessorKey: "salle",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Salle" />,
    cell: ({ row }) => <EduBadge variant="neutral">{row.getValue("salle")}</EduBadge>,
  },
  {
    id: "actions",
    header: () => null,
    cell: () => <Button variant="ghost" size="xs">Détails</Button>,
    size: 70,
  },
];
