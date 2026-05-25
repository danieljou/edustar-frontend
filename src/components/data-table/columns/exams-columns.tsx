"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Note, Student, Matiere } from "@/types";
import { EduAvatar, EduBadge } from "@/components/shared";
import { DataTableColumnHeader } from "../data-table-column-header";

export const examsColumns: ColumnDef<Note>[] = [
  {
    id: "student",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Étudiant" />,
    cell: ({ row }) => {
      const note = row.original;
      return (
        <div className="flex items-center gap-2">
          <EduAvatar name={`${note.etuCode}`} size={26} />
          <span className="font-semibold text-[var(--ink)]">{note.etuCode}</span>
        </div>
      );
    },
  },
  {
    id: "matiere",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Matière" />,
    cell: ({ row }) => {
      const note = row.original;
      return (
        <div>
          <div className="font-semibold text-[11px]">{note.matCode}</div>
          <div className="text-[10px] text-[var(--ink-4)] truncate max-w-[160px]">Matière</div>
        </div>
      );
    },
  },
  {
    accessorKey: "ds",
    header: ({ column }) => <DataTableColumnHeader column={column} title="DS" />,
    cell: ({ row }) => <span className="font-mono text-[12px]">{row.getValue("ds")}</span>,
    size: 60,
  },
  {
    accessorKey: "tp",
    header: ({ column }) => <DataTableColumnHeader column={column} title="TP" />,
    cell: ({ row }) => <span className="font-mono text-[12px]">{row.getValue("tp") ?? "—"}</span>,
    size: 60,
  },
  {
    accessorKey: "exam",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Exam" />,
    cell: ({ row }) => <span className="font-mono text-[12px]">{row.getValue("exam")}</span>,
    size: 60,
  },
  {
    accessorKey: "moy",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Moyenne" />,
    cell: ({ row }) => {
      const moy = row.getValue("moy") as number;
      return (
        <div>
          <span className="font-bold text-[16px] font-serif" style={{ color: moy >= 14 ? "var(--success)" : moy >= 10 ? "var(--warning)" : "var(--danger)" }}>
            {moy}
          </span>
          <span className="text-[10.5px] text-[var(--ink-4)]">/20</span>
        </div>
      );
    },
  },
  {
    accessorKey: "statut",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Statut" />,
    cell: ({ row }) => {
      const statut = row.getValue("statut") as string;
      return <EduBadge variant={statut === "Validé" ? "green" : statut === "Rattrapage" ? "amber" : "red"}>{statut}</EduBadge>;
    },
    size: 90,
  },
];
