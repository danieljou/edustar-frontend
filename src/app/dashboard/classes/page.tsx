"use client";
import { useState, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { BookOpen, Plus, Search, TrendingUp, Users } from "lucide-react";
import { PageHeader } from "@/components/shared/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DataTable } from "@/components/data-table";
import { getClassesColumns } from "@/components/data-table/columns/classes-columns";
import { CLASSES, STUDENTS, MATIERES } from "@/constants/mock-data";
import type { Classe } from "@/types";

const FILIERE_COLORS: Record<string, string> = {
  Informatique: "var(--blue)",
  Gestion: "var(--cyan)",
  Droit: "var(--purple)",
  Lettres: "var(--success)",
};

export default function ClassesPage() {
  const { t } = useTranslation("academique");
  const { t: tc } = useTranslation("common");

  const FILIERES = [tc("misc.all"), "Informatique", "Gestion", "Droit"];

  const [query, setQuery] = useState("");
  const [filiere, setFiliere] = useState(tc("misc.all"));

  const columns = useMemo(() => getClassesColumns(t), [t]);

  const filtered = CLASSES.filter(c => {
    const matchFiliere = filiere === tc("misc.all") || c.filiere === filiere;
    const matchQuery = !query.trim() || c.code.toLowerCase().includes(query.toLowerCase()) || c.responsable.toLowerCase().includes(query.toLowerCase());
    return matchFiliere && matchQuery;
  });

  const totalStudents = CLASSES.reduce((s, c) => s + c.effectif, 0);
  const avgPerClass = Math.round(totalStudents / CLASSES.length);

  return (
    <div>
      <PageHeader
        title={t("classes.pageTitle")}
        subtitle={`${CLASSES.length} classes · Session 2025–2026`}
        actions={<Button size="sm"><Plus className="w-3.5 h-3.5" /> {t("classes.addClass")}</Button>}
      />

      {/* KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5 mb-5">
        {[
          { label: t("classes.pageTitle"), value: CLASSES.length, color: "var(--blue)", icon: <BookOpen className="w-4 h-4" /> },
          { label: t("students.pageTitle"), value: totalStudents, color: "var(--cyan)", icon: <Users className="w-4 h-4" /> },
          { label: "Moy. par classe", value: avgPerClass, color: "var(--purple)", icon: <TrendingUp className="w-4 h-4" /> },
          { label: "Filières actives", value: 4, color: "var(--success)", icon: <BookOpen className="w-4 h-4" /> },
        ].map(k => (
          <div key={k.label} className="bg-white border border-[var(--line)] rounded-[14px] p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-[10px] flex items-center justify-center shrink-0" style={{ background: `${k.color}18`, color: k.color }}>
              {k.icon}
            </div>
            <div>
              <div className="text-[10px] font-bold uppercase tracking-widest text-[var(--ink-4)]">{k.label}</div>
              <div className="font-serif text-[22px]" style={{ color: k.color }}>{k.value}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Filière summary cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 mb-5">
        {["Informatique", "Gestion", "Droit"].map(f => {
          const fClasses = CLASSES.filter(c => c.filiere === f);
          const fStudents = fClasses.reduce((s, c) => s + c.effectif, 0);
          const fMatieres = MATIERES.filter(m => m.filiere === f || m.filiere === "Toutes");
          return (
            <Card key={f} className="overflow-hidden">
              <div className="h-1" style={{ background: FILIERE_COLORS[f] }} />
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="font-semibold text-[13px] text-[var(--ink)]">{f}</div>
                  <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full" style={{ background: `${FILIERE_COLORS[f]}18`, color: FILIERE_COLORS[f] }}>
                    {fClasses.length} classe{fClasses.length > 1 ? "s" : ""}
                  </span>
                </div>
                <div className="flex gap-4 text-center">
                  <div>
                    <div className="font-serif text-[18px] text-[var(--ink)]">{fStudents}</div>
                    <div className="text-[10px] text-[var(--ink-4)]">étudiants</div>
                  </div>
                  <div>
                    <div className="font-serif text-[18px] text-[var(--ink)]">{fMatieres.length}</div>
                    <div className="text-[10px] text-[var(--ink-4)]">matières</div>
                  </div>
                </div>
                <div className="mt-3 space-y-1">
                  {fClasses.map(c => (
                    <div key={c.id} className="flex items-center justify-between text-[11px]">
                      <span className="font-mono font-bold text-[var(--ink-2)]">{c.code}</span>
                      <span className="text-[var(--ink-4)]">{c.effectif} étudiants</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Filters */}
      <div className="flex items-center gap-2.5 mb-4 flex-wrap">
        <div className="relative flex-1 max-w-xs">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[var(--ink-4)] pointer-events-none" />
          <Input placeholder="Rechercher une classe…" value={query} onChange={e => setQuery(e.target.value)} className="pl-8" />
        </div>
        <div className="w-40">
          <Select value={filiere} onValueChange={setFiliere}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              {FILIERES.map(f => <SelectItem key={f} value={f}>{f}</SelectItem>)}
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
          searchPlaceholder="Rechercher une classe…"
          filterFields={[
            {
              columnId: "filiere", title: t("classes.columns.filiere"), options: [
                { label: "Informatique", value: "Informatique" },
                { label: "Gestion", value: "Gestion" },
                { label: "Droit", value: "Droit" },
              ]
            },
            {
              columnId: "niveau", title: t("classes.columns.level"), options: [
                { label: "Licence 1", value: "Licence 1" },
                { label: "Licence 2", value: "Licence 2" },
                { label: "Licence 3", value: "Licence 3" },
                { label: "Master 1", value: "Master 1" },
              ]
            },
          ]}
          pagination
          pageSize={10}
        />
      </Card>
    </div>
  );
}
