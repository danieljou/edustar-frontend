"use client";

import { ColumnDef } from "@tanstack/react-table";
import { MoreVertical, Eye, Edit, Trash2 } from "lucide-react";
import { Student } from "@/types";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { DataTableColumnHeader } from "../data-table-column-header";
import { formatCurrency, age } from "@/lib/utils";
import { EduAvatar, EduBadge, statusBadge } from "@/components/shared";

export const studentsColumns: ColumnDef<Student>[] = [
    {
        accessorKey: "code",
        header: ({ column }) => <DataTableColumnHeader column={column} title="Code" />,
        cell: ({ row }) => <span className="font-mono text-[11px] text-[var(--blue)] font-semibold">{row.getValue("code")}</span>,
        size: 80,
    },
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
                        <div className="text-[10.5px] text-[var(--ink-4)]">{student.sexe === "F" ? "Féminin" : "Masculin"} · {age(student.dob)} ans</div>
                    </div>
                </div>
            );
        },
    },
    {
        id: "classe",
        accessorFn: (row) => row.classe,
        header: ({ column }) => <DataTableColumnHeader column={column} title="Classe" />,
        cell: ({ row }) => {
            const student = row.original;
            return (
                <div>
                    <div className="font-semibold text-[var(--ink)] text-[11px]">{student.classe}</div>
                    <div className="text-[10px] text-[var(--ink-4)]">{student.filiere}</div>
                </div>
            );
        },
    },
    {
        accessorKey: "filiere",
        header: ({ column }) => <DataTableColumnHeader column={column} title="Filière" />,
        cell: ({ row }) => <span className="text-[var(--ink-3)] text-[11px]">{row.getValue("filiere") as string}</span>,
        size: 100,
    },
    {
        accessorKey: "moy",
        header: ({ column }) => <DataTableColumnHeader column={column} title="Moy." />,
        cell: ({ row }) => {
            const moy = row.getValue("moy") as number;
            return <EduBadge variant={moy >= 14 ? "green" : moy >= 10 ? "amber" : "red"}>{moy}/20</EduBadge>;
        },
        size: 80,
    },
    {
        accessorKey: "absences",
        header: ({ column }) => <DataTableColumnHeader column={column} title="Absences" />,
        cell: ({ row }) => {
            const absences = row.getValue("absences") as number;
            return <EduBadge variant={absences >= 10 ? "red" : absences >= 5 ? "amber" : "neutral"}>{absences} abs.</EduBadge>;
        },
        size: 90,
    },
    {
        accessorKey: "solde",
        header: ({ column }) => <DataTableColumnHeader column={column} title="Solde" />,
        cell: ({ row }) => {
            const solde = row.getValue("solde") as number;
            return solde > 0 ? <span className="text-[var(--danger)] font-bold">{formatCurrency(solde)}</span> : <EduBadge variant="green">Soldé</EduBadge>;
        },
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
        cell: ({ row }) => (
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon"><MoreVertical className="w-3.5 h-3.5" /></Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    <DropdownMenuItem><Eye className="w-3.5 h-3.5" /> Voir dossier</DropdownMenuItem>
                    <DropdownMenuItem><Edit className="w-3.5 h-3.5" /> Modifier</DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem destructive><Trash2 className="w-3.5 h-3.5" /> Supprimer</DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        ),
        size: 40,
    },
];
