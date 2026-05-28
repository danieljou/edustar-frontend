"use client";
import { useState } from "react";
import { Plus, Search } from "lucide-react";
import { useTranslation } from "react-i18next";
import { PageHeader } from "@/components/shared/PageHeader";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DataTable } from "@/components/data-table";
import { getUsersColumns } from "@/components/data-table/columns/users-columns";
import { APP_USERS } from "@/constants/mock-data";
import type { AppUser } from "@/types";
import { Input } from "@/components/ui/input";

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

export default function UsersPage() {
  const { t } = useTranslation("systeme");
  const [query, setQuery] = useState("");
  const [profil, setProfil] = useState("all");
  const [statut, setStatut] = useState("all");

  const PROFIL_LABELS: Record<string, string> = {
    ADM: t("users.roles.admin"),
    DIR: t("users.roles.direction"),
    ENS: t("users.roles.teacher"),
    SCO: t("users.roles.scolarite"),
    CPT: t("users.roles.comptabilite"),
    BIB: t("users.roles.librarian"),
  };

  const filtered = APP_USERS.filter(u => {
    const matchProfil = profil === "all" || u.profil === profil;
    const matchStatut = statut === "all" || u.statut === statut;
    const matchQuery = !query.trim() || (`${u.prenom} ${u.nom}`).toLowerCase().includes(query.toLowerCase()) || u.email.toLowerCase().includes(query.toLowerCase());
    return matchProfil && matchStatut && matchQuery;
  });

  const actifs = APP_USERS.filter(u => u.statut === "Actif").length;
  const columns = getUsersColumns(t);

  return (
    <div>
      <PageHeader
        title={t("users.pageTitle2")}
        subtitle={t("users.accountsCount", { count: APP_USERS.length, active: actifs })}
        actions={<Button size="sm"><Plus className="w-3.5 h-3.5" /> {t("users.createAccount")}</Button>}
      />

      {/* Role distribution */}
      <div className="grid grid-cols-3 md:grid-cols-6 gap-3 mb-5">
        {Object.entries(PROFIL_LABELS).map(([code, label]) => {
          const count = APP_USERS.filter(u => u.profil === code).length;
          return (
            <button
              key={code}
              onClick={() => setProfil(profil === code ? "all" : code)}
              className={`bg-white border rounded-[12px] p-3 text-center transition-all ${profil === code ? "border-[var(--blue)] shadow-sm" : "border-[var(--line)] hover:border-[var(--blue-mid)]"}`}
            >
              <div className="w-8 h-8 rounded-[8px] flex items-center justify-center mx-auto mb-1.5 text-[11px] font-bold" style={{ background: `${PROFIL_COLOR[code]}18`, color: PROFIL_COLOR[code] }}>
                {code}
              </div>
              <div className="font-serif text-[18px]" style={{ color: PROFIL_COLOR[code] }}>{count}</div>
              <div className="text-[9.5px] text-[var(--ink-4)] truncate">{label}</div>
            </button>
          );
        })}
      </div>

      {/* Filters */}
      <div className="flex items-center gap-2.5 mb-4 flex-wrap">
        <div className="relative flex-1 max-w-xs">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[var(--ink-4)] pointer-events-none" />
          <Input placeholder={t("users.searchNameEmail")} value={query} onChange={e => setQuery(e.target.value)} className="pl-8" />
        </div>
        <div className="w-44">
          <Select value={profil} onValueChange={setProfil}>
            <SelectTrigger><SelectValue placeholder={t("users.columns.profile")} /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t("users.allProfiles")}</SelectItem>
              {Object.entries(PROFIL_LABELS).map(([code, label]) => <SelectItem key={code} value={code}>{code} — {label}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
        <div className="w-36">
          <Select value={statut} onValueChange={setStatut}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t("users.allStatuses")}</SelectItem>
              <SelectItem value="Actif">{t("users.statuses.active")}</SelectItem>
              <SelectItem value="Inactif">{t("users.statuses.inactive")}</SelectItem>
              <SelectItem value="Suspendu">{t("users.statuses.suspended")}</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* DataTable */}
      <Card>
        <DataTable
          columns={columns}
          data={filtered}
          searchKey="id"
          searchPlaceholder={t("users.searchPlaceholder")}
          filterFields={[
            { columnId: "profil", title: t("users.columns.profile"), options: [
              { label: t("users.roles.admin"), value: "ADM" },
              { label: t("users.roles.direction"), value: "DIR" },
              { label: t("users.roles.teacher"), value: "ENS" },
              { label: t("users.roles.scolarite"), value: "SCO" },
              { label: t("users.roles.comptabilite"), value: "CPT" },
              { label: t("users.roles.librarian"), value: "BIB" },
            ]},
            { columnId: "statut", title: t("users.columns.status"), options: [
              { label: t("users.statuses.active"), value: "Actif" },
              { label: t("users.statuses.inactive"), value: "Inactif" },
              { label: t("users.statuses.suspended"), value: "Suspendu" },
            ]},
          ]}
          pagination
          pageSize={10}
        />
      </Card>
    </div>
  );
}
