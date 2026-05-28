"use client";

import { ColumnDef, FilterFn } from "@tanstack/react-table";
import { TFunction } from "i18next";

// row value must be included in the filter array (for faceted filters)
const includesOneOf: FilterFn<any> = (row, columnId, filterValues: string[]) =>
  filterValues.includes(row.getValue(columnId));
includesOneOf.autoRemove = (val: unknown) => !Array.isArray(val) || val.length === 0;
import { MoreVertical, Eye, Edit, Trash2 } from "lucide-react";
import Link from "next/link";
import { Student } from "@/types";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { DataTableColumnHeader } from "../data-table-column-header";
import { formatCurrency, age } from "@/lib/utils";
import { EduAvatar, EduBadge, statusBadge } from "@/components/shared";

export const getStudentsColumns = (t: TFunction): ColumnDef<Student>[] => [
    {
        accessorKey: "code",
        header: ({ column }) => <DataTableColumnHeader column={column} title={t("students.columns.code")} />,
        cell: ({ row }) => <span className="font-mono text-[11px] text-[var(--blue)] font-semibold">{row.getValue("code")}</span>,
        size: 80,
    },
    {
        id: "student",
        header: ({ column }) => <DataTableColumnHeader column={column} title={t("students.columns.fullName")} />,
        cell: ({ row }) => {
            const student = row.original;
            return (
                <div className="flex items-center gap-2">
                    <EduAvatar name={`${student.prenom} ${student.nom}`} size={28} />
                    <div>
                        <div className="font-semibold text-[var(--ink)]">{student.prenom} {student.nom}</div>
                        <div className="text-[10.5px] text-[var(--ink-4)]">{student.sexe === "F" ? t("fields.female", { ns: "common" }) : t("fields.male", { ns: "common" })} · {age(student.dob)} ans</div>
                    </div>
                </div>
            );
        },
    },
    {
        id: "classe",
        accessorFn: (row) => row.classe,
        filterFn: 'arrIncludes',
        header: ({ column }) => <DataTableColumnHeader column={column} title={t("students.columns.class")} />,
        cell: ({ row }) => {
            const student = row.original;
            return (
                <div>
                    <div className="font-semibold text-[var(--ink)] text-[11px]">{student.classe}</div>
                    <div className="text-[10px] text-[var(--ink-4)]">{student.filiere}</div>
                </div>
            );
        },
        // filterFn: includesOneOf,
    },
    {
        accessorKey: "filiere",
        filterFn: 'arrIncludes',
        header: ({ column }) => <DataTableColumnHeader column={column} title={t("students.columns.filiere")} />,
        cell: ({ row }) => <span className="text-[var(--ink-3)] text-[11px]">{row.getValue("filiere") as string}</span>,
        size: 100,
        // filterFn: includesOneOf,
    },
    {
        accessorKey: "moy",
        header: ({ column }) => <DataTableColumnHeader column={column} title={t("students.columns.average")} />,
        cell: ({ row }) => {
            const moy = row.getValue("moy") as number;
            return <EduBadge variant={moy >= 14 ? "green" : moy >= 10 ? "amber" : "red"}>{moy}/20</EduBadge>;
        },
        size: 80,
    },
    {
        accessorKey: "absences",
        header: ({ column }) => <DataTableColumnHeader column={column} title={t("students.columns.absences")} />,
        cell: ({ row }) => {
            const absences = row.getValue("absences") as number;
            return <EduBadge variant={absences >= 10 ? "red" : absences >= 5 ? "amber" : "neutral"}>{absences} abs.</EduBadge>;
        },
        size: 90,
    },
    {
        accessorKey: "solde",
        header: ({ column }) => <DataTableColumnHeader column={column} title={t("students.columns.balance")} />,
        cell: ({ row }) => {
            const solde = row.getValue("solde") as number;
            return solde > 0 ? <span className="text-[var(--danger)] font-bold">{formatCurrency(solde)}</span> : <EduBadge variant="green">Soldé</EduBadge>;
        },
    },
    {
        accessorKey: "statut",
        filterFn: 'arrIncludes',
        header: ({ column }) => <DataTableColumnHeader column={column} title={t("students.columns.status")} />,
        cell: ({ row }) => {
            const statut = row.getValue("statut") as string;
            return <EduBadge variant={statusBadge(statut)}>{statut}</EduBadge>;
        },
        size: 90,
        // filterFn: includesOneOf,
    },
    {
        id: "actions",
        enableHiding: false,
        header: () => null,
        cell: ({ row }) => (
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon"><MoreVertical className="w-3.5 h-3.5" /></Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    <DropdownMenuItem asChild>
                        <Link href={`/dashboard/students/${row.original.code}`}><Eye className="w-3.5 h-3.5" /> {t("actions.view", { ns: "common" })}</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem><Edit className="w-3.5 h-3.5" /> {t("actions.edit", { ns: "common" })}</DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem destructive><Trash2 className="w-3.5 h-3.5" /> {t("actions.delete", { ns: "common" })}</DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        ),
        size: 40,
    },
];
