"use client";
import { useState, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { Plus, Search } from "lucide-react";
import { PageHeader } from "@/components/shared/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DataTable } from "@/components/data-table";
import { getMatieresColumns } from "@/components/data-table/columns/matieres-columns";
import { MATIERES } from "@/constants/mock-data";

const TYPE_COLORS: Record<string, string> = {
  CM: "var(--blue)",
  TD: "var(--cyan)",
  TP: "var(--purple)",
  "CM+TD": "var(--blue)",
  "CM+TP": "var(--purple)",
  "CM+TD+TP": "var(--success)",
};

const TYPE_BADGE: Record<string, "blue" | "cyan" | "purple" | "green"> = {
  CM: "blue", TD: "cyan", TP: "purple", "CM+TD": "blue", "CM+TP": "purple", "CM+TD+TP": "green",
};

export default function SubjectsPage() {
  const { t } = useTranslation("academique");
  const { t: tc } = useTranslation("common");

  const [query, setQuery] = useState("");
  const [filiere, setFiliere] = useState("all");
  const [niveau, setNiveau] = useState("all");

  const columns = useMemo(() => getMatieresColumns(t), [t]);

  const filieres = ["all", ...Array.from(new Set(MATIERES.map(m => m.filiere)))];
  const niveaux = ["all", ...Array.from(new Set(MATIERES.map(m => m.niveau)))];

  const filtered = MATIERES.filter(m => {
    const matchFiliere = filiere === "all" || m.filiere === filiere;
    const matchNiveau = niveau === "all" || m.niveau === niveau;
    const matchQuery = !query.trim() || m.lib.toLowerCase().includes(query.toLowerCase()) || m.code.toLowerCase().includes(query.toLowerCase());
    return matchFiliere && matchNiveau && matchQuery;
  });

  const totalCredits = filtered.reduce((s, m) => s + m.credits, 0);
  const totalCoeff = filtered.reduce((s, m) => s + m.coeff, 0);

  return (
    <div>
      <PageHeader
        title={t("subjects.pageTitle")}
        subtitle={`${MATIERES.length} matières au programme`}
        actions={<Button size="sm"><Plus className="w-3.5 h-3.5" /> {t("subjects.addSubject")}</Button>}
      />

      {/* KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5 mb-5">
        {[
          { label: t("subjects.pageTitle"), value: MATIERES.length, color: "var(--blue)" },
          { label: "Total crédits", value: totalCredits, color: "var(--cyan)" },
          { label: "Enseignants", value: new Set(MATIERES.map(m => m.ens)).size, color: "var(--purple)" },
          { label: "Filières", value: new Set(MATIERES.map(m => m.filiere)).size, color: "var(--success)" },
        ].map(k => (
          <div key={k.label} className="bg-white border border-[var(--line)] rounded-[14px] p-4 text-center">
            <div className="text-[10px] font-bold uppercase tracking-widest text-[var(--ink-4)] mb-1">{k.label}</div>
            <div className="font-serif text-[26px]" style={{ color: k.color }}>{k.value}</div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex items-center gap-2.5 mb-4 flex-wrap">
        <div className="relative flex-1 max-w-xs">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[var(--ink-4)] pointer-events-none" />
          <Input placeholder="Rechercher une matière…" value={query} onChange={e => setQuery(e.target.value)} className="pl-8" />
        </div>
        <div className="w-40">
          <Select value={filiere} onValueChange={setFiliere}>
            <SelectTrigger><SelectValue placeholder={t("students.columns.filiere")} /></SelectTrigger>
            <SelectContent>
              {filieres.map(f => <SelectItem key={f} value={f}>{f === "all" ? "Toutes filières" : f}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
        <div className="w-32">
          <Select value={niveau} onValueChange={setNiveau}>
            <SelectTrigger><SelectValue placeholder={t("classes.columns.level")} /></SelectTrigger>
            <SelectContent>
              {niveaux.map(n => <SelectItem key={n} value={n}>{n === "all" ? "Tous niveaux" : n}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Table */}
      <Card>
        <DataTable
          columns={columns}
          data={filtered}
          searchKey="code"
          searchPlaceholder="Rechercher une matière…"
          filterFields={[
            { columnId: "filiere", title: t("students.columns.filiere"), options: [
              { label: "Informatique", value: "Informatique" },
              { label: "Gestion", value: "Gestion" },
              { label: "Droit", value: "Droit" },
              { label: "Toutes", value: "Toutes" },
            ]},
            { columnId: "niveau", title: t("classes.columns.level"), options: [
              { label: "L1", value: "L1" },
              { label: "L2", value: "L2" },
              { label: "L3", value: "L3" },
            ]},
            { columnId: "type", title: tc("fields.type"), options: [
              { label: "CM", value: "CM" },
              { label: "CM+TD", value: "CM+TD" },
              { label: "CM+TD+TP", value: "CM+TD+TP" },
              { label: "CM+TP", value: "CM+TP" },
              { label: "TD", value: "TD" },
            ]},
          ]}
          pagination
          pageSize={10}
        />
      </Card>
    </div>
  );
}
