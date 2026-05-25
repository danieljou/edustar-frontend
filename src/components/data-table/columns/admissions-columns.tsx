"use client";

import { ColumnDef } from "@tanstack/react-table";
import { MoreVertical, Eye, X, Check } from "lucide-react";
import { Admission } from "@/types";
import { EduAvatar, EduBadge, statusBadge } from "@/components/shared";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { DataTableColumnHeader } from "../data-table-column-header";
import { age, formatDate } from "@/lib/utils";

export const admissionsColumns: ColumnDef<Admission>[] = [
  {
    accessorKey: "id",
    header: ({ column }) => <DataTableColumnHeader column={column} title="ID" />,
    cell: ({ row }) => <span className="font-mono text-[11px] text-[var(--blue)] font-semibold">{row.getValue("id")}</span>,
    size: 80,
  },
  {
    id: "candidat",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Candidat" />,
    cell: ({ row }) => {
      const admission = row.original;
      return (
        <div className="flex items-center gap-2">
          <EduAvatar name={`${admission.prenom} ${admission.nom}`} size={28} />
          <div>
            <div className="font-semibold text-[var(--ink)]">{admission.prenom} {admission.nom}</div>
            <div className="text-[10.5px] text-[var(--ink-4)]">{admission.sexe === "F" ? "Féminin" : "Masculin"} · {age(admission.dob)} ans</div>
          </div>
        </div>
      );
    },
  },
  {
    id: "formation",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Filière / Niveau" />,
    cell: ({ row }) => {
      const admission = row.original;
      return (
        <div>
          <div className="font-semibold text-[11px]">{admission.filiere}</div>
          <div className="text-[10px] text-[var(--ink-4)]">{admission.niveau}</div>
        </div>
      );
    },
  },
  {
    id: "docs",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Documents" />,
    cell: ({ row }) => {
      const admission = row.original;
      return (
        <div>
          <div className="flex items-center gap-1">
            <span className="text-[12px] font-bold text-[var(--ink)]">{admission.docs.length}</span>
            <span className="text-[10.5px] text-[var(--ink-4)]">/ 5 docs</span>
          </div>
          <div className="flex gap-1 mt-1">
            {[0, 1, 2, 3, 4].map(i => (
              <div key={i} className={`w-4 h-1.5 rounded-full ${i < admission.docs.length ? "bg-[var(--success)]" : "bg-[var(--line)]"}`} />
            ))}
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "date",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Date" />,
    cell: ({ row }) => <span className="text-[var(--ink-4)] whitespace-nowrap">{formatDate(row.getValue("date") as string)}</span>,
  },
  {
    accessorKey: "statut",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Statut" />,
    cell: ({ row }) => {
      const statut = row.getValue("statut") as string;
      return <EduBadge variant={statusBadge(statut)}>{statut}</EduBadge>;
    },
    size: 90,
  },
  {
    id: "actions",
    header: () => null,
    cell: ({ row }) => {
      const admission = row.original;
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon"><MoreVertical className="w-3.5 h-3.5" /></Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem><Eye className="w-3.5 h-3.5" /> Voir dossier</DropdownMenuItem>
            {admission.statut === "En attente" && (
              <>
                <DropdownMenuItem><Check className="w-3.5 h-3.5" /> Valider</DropdownMenuItem>
                <DropdownMenuItem destructive><X className="w-3.5 h-3.5" /> Rejeter</DropdownMenuItem>
              </>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
    size: 40,
  },
];
