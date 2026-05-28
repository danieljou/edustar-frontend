"use client";

import { TFunction } from "i18next";
import { ColumnDef } from "@tanstack/react-table";
import { Bus, MapPin } from "lucide-react";
import { Bus as BusType } from "@/types";
import { EduBadge } from "@/components/shared";
import { DataTableColumnHeader } from "../data-table-column-header";

const STATUT_COLOR: Record<string, string> = {
  "En service": "var(--success)",
  "En panne": "var(--danger)",
  "En maintenance": "var(--warning)",
};

const STATUT_VARIANT: Record<string, "green" | "red" | "amber"> = {
  "En service": "green",
  "En panne": "red",
  "En maintenance": "amber",
};

export const getTransportColumns = (t: TFunction): ColumnDef<BusType>[] => [
  {
    id: "bus",
    header: ({ column }) => <DataTableColumnHeader column={column} title={t("transport.columns.vehicle")} />,
    cell: ({ row }) => {
      const bus = row.original;
      return (
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-[6px] flex items-center justify-center" style={{ background: `${STATUT_COLOR[bus.statut]}18`, color: STATUT_COLOR[bus.statut] }}>
            <Bus className="w-3.5 h-3.5" />
          </div>
          <span className="font-bold text-[var(--ink)]">Bus {bus.numero}</span>
        </div>
      );
    },
  },
  {
    accessorKey: "immatriculation",
    header: ({ column }) => <DataTableColumnHeader column={column} title={t("transport.columns.licensePlate")} />,
    cell: ({ row }) => <span className="font-mono text-[11px] text-[var(--ink-4)]">{row.getValue("immatriculation")}</span>,
  },
  {
    accessorKey: "chauffeur",
    header: ({ column }) => <DataTableColumnHeader column={column} title={t("transport.columns.driver")} />,
    cell: ({ row }) => <span className="text-[var(--ink-3)]">{row.getValue("chauffeur")}</span>,
  },
  {
    accessorKey: "itineraire",
    header: ({ column }) => <DataTableColumnHeader column={column} title={t("transport.columns.routeName")} />,
    cell: ({ row }) => (
      <div className="flex items-center gap-1.5">
        <MapPin className="w-3 h-3 text-[var(--ink-4)] shrink-0" />
        <span className="text-[11.5px] text-[var(--ink-3)] truncate">{row.getValue("itineraire")}</span>
      </div>
    ),
  },
  {
    accessorKey: "depart",
    header: ({ column }) => <DataTableColumnHeader column={column} title={t("transport.columns.departureTime")} />,
    cell: ({ row }) => <span className="font-mono font-bold text-[var(--blue)]">{row.getValue("depart")}</span>,
    size: 70,
  },
  {
    accessorKey: "capacite",
    header: ({ column }) => <DataTableColumnHeader column={column} title={t("transport.columns.capacity")} />,
    cell: ({ row }) => <span className="text-center font-medium">{row.getValue("capacite")}</span>,
    size: 70,
  },
  {
    accessorKey: "passagers",
    header: ({ column }) => <DataTableColumnHeader column={column} title={t("transport.columns.studentsCount")} />,
    cell: ({ row }) => {
      const bus = row.original;
      return bus.statut === "En service" ? (
        <span className={`font-bold ${bus.passagers / bus.capacite > 0.9 ? "text-[var(--warning)]" : "text-[var(--ink)]"}`}>{bus.passagers}</span>
      ) : <span className="text-[var(--ink-4)]">—</span>;
    },
    size: 70,
  },
  {
    accessorKey: "statut",
    filterFn: 'arrIncludes',
    header: ({ column }) => <DataTableColumnHeader column={column} title={t("transport.columns.status")} />,
    cell: ({ row }) => {
      const statut = row.getValue("statut") as string;
      return <EduBadge variant={STATUT_VARIANT[statut]}>{statut}</EduBadge>;
    },
    size: 100,
  },
];
