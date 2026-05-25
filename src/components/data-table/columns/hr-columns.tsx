"use client";

import { ColumnDef } from "@tanstack/react-table";
import { MoreVertical, Eye, Edit } from "lucide-react";
import { Personnel } from "@/types";
import { EduAvatar, EduBadge, statusBadge } from "@/components/shared";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { DataTableColumnHeader } from "../data-table-column-header";
import { formatDate, formatCurrency } from "@/lib/utils";

export const hrColumns: ColumnDef<Personnel>[] = [
  {
    accessorKey: "id",
    header: ({ column }) => <DataTableColumnHeader column={column} title="ID" />,
    cell: ({ row }) => <span className="font-mono text-[11px] text-[var(--blue)] font-semibold">{row.getValue("id")}</span>,
    size: 70,
  },
  {
    id: "member",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Membre" />,
    cell: ({ row }) => {
      const personnel = row.original;
      return (
        <div className="flex items-center gap-2">
          <EduAvatar name={`${personnel.prenom} ${personnel.nom}`} size={30} />
          <div>
            <div className="font-semibold text-[var(--ink)]">{personnel.prenom} {personnel.nom}</div>
            <div className="text-[10.5px] text-[var(--ink-4)]">{personnel.email}</div>
          </div>
        </div>
      );
    },
  },
  {
    id: "role",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Rôle / Dept." />,
    cell: ({ row }) => {
      const personnel = row.original;
      return (
        <div>
          <EduBadge variant={personnel.role === "Enseignant" ? "blue" : personnel.role === "Direction" ? "purple" : "neutral"}>{personnel.role}</EduBadge>
          <div className="text-[10.5px] text-[var(--ink-4)] mt-1">{personnel.dept}</div>
        </div>
      );
    },
  },
  {
    id: "contact",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Contact" />,
    cell: ({ row }) => {
      const personnel = row.original;
      return (
        <div>
          <div className="text-[12px]">{personnel.tel}</div>
          <div className="text-[10.5px] text-[var(--ink-4)]">Depuis {formatDate(personnel.entree)}</div>
        </div>
      );
    },
  },
  {
    accessorKey: "salaire",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Salaire" />,
    cell: ({ row }) => <span className="font-bold text-[var(--ink)]">{formatCurrency(row.getValue("salaire") as number)}</span>,
  },
  {
    accessorKey: "contrat",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Contrat" />,
    cell: ({ row }) => {
      const contrat = row.getValue("contrat") as string;
      return <EduBadge variant={contrat === "CDI" ? "green" : contrat === "CDD" ? "amber" : "neutral"}>{contrat}</EduBadge>;
    },
    size: 90,
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
    cell: () => (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon"><MoreVertical className="w-3.5 h-3.5" /></Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem><Eye className="w-3.5 h-3.5" /> Voir fiche</DropdownMenuItem>
          <DropdownMenuItem><Edit className="w-3.5 h-3.5" /> Modifier</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    ),
    size: 40,
  },
];
