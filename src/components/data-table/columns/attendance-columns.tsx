"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Student } from "@/types";
import { EduAvatar, EduBadge } from "@/components/shared";
import { DataTableColumnHeader } from "../data-table-column-header";

export const attendanceColumns: ColumnDef<Student>[] = [
    {
        id: "student",
        header: ({ column }) => <DataTableColumnHeader column={column} title="Étudiant" />,
        cell: ({ row }) => {
            const student = row.original;
            return (
                <div className="flex items-center gap-2">
                    <EduAvatar name={`${student.prenom} ${student.nom}`} size={28} />
                    <div>
                        <div className="font-semibold text-[var(--ink)]">{student.prenom} {student.nom}</div>
                        <div className="text-[10.5px] text-[var(--ink-4)]">{student.code}</div>
                    </div>
                </div>
            );
        },
    },
    {
        accessorKey: "classe",
        header: ({ column }) => <DataTableColumnHeader column={column} title="Classe" />,
        cell: ({ row }) => <span className="text-[11px] font-semibold">{row.getValue("classe")}</span>,
    },
    {
        accessorKey: "absences",
        header: ({ column }) => <DataTableColumnHeader column={column} title="Total absences" />,
        cell: ({ row }) => {
            const absences = row.getValue("absences") as number;
            return <EduBadge variant={absences >= 10 ? "red" : absences >= 5 ? "amber" : "neutral"}>{absences} absences</EduBadge>;
        },
    },
    {
        id: "statut",
        header: ({ column }) => <DataTableColumnHeader column={column} title="Statut aujourd'hui" />,
        cell: ({ row }) => {
            const student = row.original;
            const statut = student.statut || "Absent";
            return <EduBadge variant={statut === "Actif" ? "green" : statut === "Abandonné" ? "red" : "amber"}>{statut}</EduBadge>;
        },
    },
    {
        id: "actions",
        header: () => null,
        cell: () => (
            <div className="flex gap-1">
                <button className="px-2.5 py-1 rounded-[5px] text-[10.5px] font-bold bg-[var(--success-light)] text-[var(--success)] hover:opacity-80 transition-opacity">P</button>
                <button className="px-2.5 py-1 rounded-[5px] text-[10.5px] font-bold bg-[var(--danger-light)] text-[var(--danger)] hover:opacity-80 transition-opacity">A</button>
                <button className="px-2.5 py-1 rounded-[5px] text-[10.5px] font-bold bg-[var(--warning-light)] text-[var(--warning)] hover:opacity-80 transition-opacity">R</button>
            </div>
        ),
        size: 100,
    },
];
