"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Payment } from "@/types";
import { EduAvatar, EduBadge } from "@/components/shared";
import { DataTableColumnHeader } from "../data-table-column-header";
import { formatCurrency } from "@/lib/utils";

export const paymentsColumns: ColumnDef<Payment>[] = [
  {
    accessorKey: "ref",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Référence" />,
    cell: ({ row }) => <span className="font-mono text-[11px] text-[var(--blue)] font-bold">{row.getValue("ref")}</span>,
    size: 120,
  },
  {
    id: "etudiant",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Étudiant" />,
    cell: ({ row }) => {
      const paiement = row.original;
      return (
        <div className="flex items-center gap-2">
          <EduAvatar name={paiement.etuCode} size={26} />
          <div>
            <div className="font-medium text-[var(--ink)]">{paiement.etuCode}</div>
            <div className="text-[10px] text-[var(--ink-4)]">Classe</div>
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "type",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Type" />,
    cell: ({ row }) => {
      const type = row.getValue("type") as string;
      return <EduBadge variant={type === "Inscription" ? "blue" : type === "Scolarité" ? "purple" : "neutral"}>{type}</EduBadge>;
    },
    size: 90,
  },
  {
    accessorKey: "montant",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Montant" />,
    cell: ({ row }) => <span className="font-bold text-[var(--ink)]">{formatCurrency(row.getValue("montant") as number)}</span>,
  },
  {
    accessorKey: "mode",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Mode paiement" />,
    cell: ({ row }) => {
      const mode = row.getValue("mode") as string;
      return <span className="text-[11px]">{mode}</span>;
    },
    size: 100,
  },
  {
    accessorKey: "date",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Date" />,
    cell: ({ row }) => {
      const date = new Date(row.getValue("date") as string);
      return <span className="text-[var(--ink-4)]">{date.toLocaleDateString("fr-FR")}</span>;
    },
  },
  {
    accessorKey: "statut",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Statut" />,
    cell: ({ row }) => {
      const statut = row.getValue("statut") as string;
      return <EduBadge variant={statut === "Payé" ? "green" : statut === "En attente" ? "amber" : "red"}>{statut}</EduBadge>;
    },
    size: 90,
  },
];
