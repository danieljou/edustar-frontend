"use client";

import { ColumnDef } from "@tanstack/react-table";
import { TFunction } from "i18next";
import { Clock } from "lucide-react";
import { EmploiDuTemps } from "@/types";
import { DataTableColumnHeader } from "../data-table-column-header";

// Called with t from useTranslation("pedagogie")
export const getScheduleColumns = (t: TFunction): ColumnDef<EmploiDuTemps>[] => [
  {
    accessorKey: "jour",
    filterFn: "arrIncludes",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title={t("timetable.columns.time")} />
    ),
    cell: ({ row }) => (
      <div className="font-bold text-[var(--ink)]">{row.getValue("jour")}</div>
    ),
    size: 80,
  },
  {
    id: "horaire",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title={t("timetable.columns.time")} />
    ),
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
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title={t("timetable.columns.subject")} />
    ),
    cell: ({ row }) => (
      <span className="font-semibold text-[var(--ink)]">{row.getValue("matiere")}</span>
    ),
  },
  {
    accessorKey: "classe",
    filterFn: "arrIncludes",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title={t("timetable.columns.class")} />
    ),
    cell: ({ row }) => (
      <span className="text-[11px] font-medium">{row.getValue("classe")}</span>
    ),
    size: 80,
  },
  {
    accessorKey: "salle",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title={t("timetable.columns.room")} />
    ),
    cell: ({ row }) => (
      <div className="flex items-center justify-center px-2 py-1 bg-[var(--line)] rounded-[5px] w-fit">
        <span className="font-bold text-[11px] text-[var(--ink)]">{row.getValue("salle")}</span>
      </div>
    ),
    size: 70,
  },
  {
    accessorKey: "enseignant",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title={t("timetable.columns.teacher")} />
    ),
    cell: ({ row }) => (
      <span className="text-[var(--ink-3)]">{row.getValue("enseignant")}</span>
    ),
  },
  {
    accessorKey: "type",
    filterFn: "arrIncludes",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title={t("fields.type", { ns: "common" })} />
    ),
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
