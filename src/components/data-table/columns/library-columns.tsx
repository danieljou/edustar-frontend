"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { EduBadge } from "@/components/shared";
import { Emprunt, Livre, Student } from "@/types";
import { EduAvatar } from "@/components/shared/EduAvatar";
import { DataTableColumnHeader } from "../data-table-column-header";

export const libraryColumns: ColumnDef<Emprunt>[] = [
  {
    id: "livre",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Ouvrage" />,
    cell: ({ row }) => {
      const emprunt = row.original;
      return (
        <div>
          <div className="font-medium text-[var(--ink)] max-w-[200px] truncate">Titre du livre</div>
          <div className="text-[10px] text-[var(--ink-4)]">Auteur</div>
        </div>
      );
    },
  },
  {
    id: "etudiant",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Étudiant" />,
    cell: ({ row }) => {
      const emprunt = row.original;
      return (
        <div className="flex items-center gap-1.5">
          <EduAvatar name={emprunt.etuCode} size={24} />
          <div>
            <div className="font-medium text-[var(--ink)]">Nom Prénom</div>
            <div className="text-[10px] text-[var(--ink-4)]">Classe</div>
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "dateEmprunt",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Date emprunt" />,
    cell: ({ row }) => {
      const date = new Date(row.getValue("dateEmprunt") as string);
      return <span className="text-[var(--ink-3)]">{date.toLocaleDateString("fr-FR")}</span>;
    },
  },
  {
    accessorKey: "dateRetourPrevu",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Date retour prévue" />,
    cell: ({ row }) => {
      const date = new Date(row.getValue("dateRetourPrevu") as string);
      return <span className="text-[var(--ink-3)]">{date.toLocaleDateString("fr-FR")}</span>;
    },
  },
  {
    accessorKey: "statut",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Statut" />,
    cell: ({ row }) => {
      const statut = row.getValue("statut") as string;
      return <EduBadge variant={statut === "En cours" ? "blue" : statut === "Retourné" ? "green" : "red"}>{statut}</EduBadge>;
    },
    size: 90,
  },
  {
    id: "actions",
    header: () => null,
    cell: ({ row }) => {
      const emprunt = row.original;
      return emprunt.statut === "En cours" ? (
        <Button variant="outline" size="xs">Retour</Button>
      ) : emprunt.statut === "En retard" ? (
        <Button variant="outline" size="xs" className="border-[var(--danger)] text-[var(--danger)]">Relancer</Button>
      ) : null;
    },
    size: 70,
  },
];
