// @i18n-ally-namespace systeme
"use client";

import { ColumnDef } from "@tanstack/react-table";
import { TFunction } from "i18next";
import { UserCog, Shield, Key } from "lucide-react";
import { AppUser } from "@/types";

import { Button } from "@/components/ui/button";
import { DataTableColumnHeader } from "../data-table-column-header";
import { EduAvatar, EduBadge } from "@/components/shared";

const PROFIL_COLOR: Record<string, string> = {
  ADM: "var(--danger)",
  DIR: "var(--purple)",
  ENS: "var(--blue)",
  SCO: "var(--cyan)",
  CPT: "var(--success)",
  BIB: "var(--warning)",
};

const STATUT_VARIANT: Record<string, "green" | "red" | "amber"> = {
  Actif: "green",
  Inactif: "amber",
  Suspendu: "red",
};

export function getUsersColumns(t: TFunction): ColumnDef<AppUser>[] {
  const PROFIL_LABELS: Record<string, string> = {
    ADM: t("users.roles.admin"),
    DIR: t("users.roles.direction"),
    ENS: t("users.roles.teacher"),
    SCO: t("users.roles.scolarite"),
    CPT: t("users.roles.comptabilite"),
    BIB: t("users.roles.librarian"),
  };

  return [
    {
      id: "user",
      header: ({ column }) => <DataTableColumnHeader column={column} title={t("users.columns.user")} />,
      cell: ({ row }) => {
        const user = row.original;
        return (
          <div className="flex items-center gap-2">
            <EduAvatar name={`${user.prenom} ${user.nom}`} size={28} />
            <div>
              <div className="font-semibold text-[var(--ink)]">{user.prenom} {user.nom}</div>
              <div className="text-[10px] font-mono text-[var(--ink-4)]">{user.id}</div>
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: "profil",
      filterFn: "arrIncludes",
      header: ({ column }) => <DataTableColumnHeader column={column} title={t("users.columns.profile")} />,
      cell: ({ row }) => {
        const profil = row.getValue("profil") as string;
        return (
          <div className="flex items-center gap-1.5">
            <div className="w-6 h-6 rounded-[5px] flex items-center justify-center text-[9px] font-bold" style={{ background: `${PROFIL_COLOR[profil]}18`, color: PROFIL_COLOR[profil] }}>
              {profil}
            </div>
            <span className="text-[11.5px] text-[var(--ink-3)]">{PROFIL_LABELS[profil]}</span>
          </div>
        );
      },
    },
    {
      accessorKey: "email",
      header: ({ column }) => <DataTableColumnHeader column={column} title={t("users.columns.email")} />,
      cell: ({ row }) => <span className="text-[var(--ink-3)]">{row.getValue("email")}</span>,
    },
    {
      accessorKey: "tel",
      header: ({ column }) => <DataTableColumnHeader column={column} title={t("users.columns.phone")} />,
      cell: ({ row }) => <span className="font-mono text-[11px] text-[var(--ink-4)]">{row.getValue("tel")}</span>,
    },
    {
      accessorKey: "lastLogin",
      header: ({ column }) => <DataTableColumnHeader column={column} title={t("users.columns.lastLoginShort")} />,
      cell: ({ row }) => {
        const date = new Date(row.getValue("lastLogin") as string);
        return <span className="text-[11px] text-[var(--ink-4)]">{date.toLocaleDateString("fr-FR", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })}</span>;
      },
    },
    {
      accessorKey: "statut",
      filterFn: "arrIncludes",
      header: ({ column }) => <DataTableColumnHeader column={column} title={t("users.columns.status")} />,
      cell: ({ row }) => {
        const statut = row.getValue("statut") as string;
        return <EduBadge variant={STATUT_VARIANT[statut]}>{statut}</EduBadge>;
      },
      size: 90,
    },
    {
      id: "actions",
      header: () => null,
      cell: () => (
        <div className="flex gap-1">
          <Button variant="ghost" size="xs" title={t("users.tooltips.edit")}>
            <UserCog className="w-3 h-3" />
          </Button>
          <Button variant="ghost" size="xs" title={t("users.tooltips.permissions")}>
            <Shield className="w-3 h-3" />
          </Button>
          <Button variant="ghost" size="xs" title={t("users.tooltips.resetPassword")}>
            <Key className="w-3 h-3" />
          </Button>
        </div>
      ),
      size: 80,
    },
  ];
}

/** @deprecated Use getUsersColumns(t) instead */
export const usersColumns = getUsersColumns(((k: string) => k) as TFunction);
