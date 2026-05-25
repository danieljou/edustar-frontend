"use client";
import { useState } from "react";
import { Plus, Search, Users, BookOpen, TrendingUp } from "lucide-react";
import { PageHeader } from "@/components/shared/PageHeader";
import { EduBadge } from "@/components/shared/EduBadge";
import { EduAvatar } from "@/components/shared/EduAvatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CLASSES, STUDENTS, MATIERES } from "@/constants/mock-data";

const FILIERES = ["Toutes", "Informatique", "Gestion", "Droit"];

const FILIERE_COLORS: Record<string, string> = {
  Informatique: "var(--blue)",
  Gestion: "var(--cyan)",
  Droit: "var(--purple)",
  Lettres: "var(--success)",
};

export default function ClassesPage() {
  const [query, setQuery] = useState("");
  const [filiere, setFiliere] = useState("Toutes");

  const filtered = CLASSES.filter(c => {
    const matchFiliere = filiere === "Toutes" || c.filiere === filiere;
    const matchQuery = !query.trim() || c.code.toLowerCase().includes(query.toLowerCase()) || c.responsable.toLowerCase().includes(query.toLowerCase());
    return matchFiliere && matchQuery;
  });

  const totalStudents = CLASSES.reduce((s, c) => s + c.effectif, 0);
  const avgPerClass = Math.round(totalStudents / CLASSES.length);

  return (
    <div>
      <PageHeader
        title="Classes & Filières"
        subtitle={`${CLASSES.length} classes · Session 2025–2026`}
        actions={<Button size="sm"><Plus className="w-3.5 h-3.5" /> Nouvelle classe</Button>}
      />

      {/* KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5 mb-5">
        {[
          { label: "Total classes", value: CLASSES.length, color: "var(--blue)", icon: <BookOpen className="w-4 h-4" /> },
          { label: "Étudiants inscrits", value: totalStudents, color: "var(--cyan)", icon: <Users className="w-4 h-4" /> },
          { label: "Moy. par classe", value: avgPerClass, color: "var(--purple)", icon: <TrendingUp className="w-4 h-4" /> },
          { label: "Filieres actives", value: 4, color: "var(--success)", icon: <BookOpen className="w-4 h-4" /> },
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
      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-[12.5px]">
            <thead>
              <tr className="bg-[var(--ivory)]">
                {["Code classe", "Filière", "Niveau", "Effectif", "Délégué", "Responsable", "Salle", "Actions"].map(h => (
                  <th key={h} className="px-3.5 py-[9px] text-left text-[9.5px] font-bold uppercase tracking-[0.07em] text-[var(--ink-4)] border-b border-[var(--line)] whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map(c => {
                const classStudents = STUDENTS.filter(s => s.classe === c.code);
                const avg = classStudents.length > 0 ? classStudents.reduce((s, st) => s + st.moy, 0) / classStudents.length : 0;
                return (
                  <tr key={c.id} className="border-b border-[var(--line)] last:border-0 hover:bg-[var(--blue-lighter)] transition-colors">
                    <td className="px-3.5 py-[10px]">
                      <span className="font-mono font-bold text-[var(--blue)]">{c.code}</span>
                    </td>
                    <td className="px-3.5 py-[10px]">
                      <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full" style={{ background: `${FILIERE_COLORS[c.filiere]}18`, color: FILIERE_COLORS[c.filiere] }}>{c.filiere}</span>
                    </td>
                    <td className="px-3.5 py-[10px] text-[var(--ink-3)]">{c.niveau}</td>
                    <td className="px-3.5 py-[10px]">
                      <div className="flex items-center gap-2">
                        <div className="w-16 h-1.5 bg-[var(--line)] rounded-full overflow-hidden">
                          <div className="h-full rounded-full" style={{ width: `${(c.effectif / 55) * 100}%`, background: FILIERE_COLORS[c.filiere] }} />
                        </div>
                        <span className="font-semibold text-[var(--ink)]">{c.effectif}</span>
                      </div>
                    </td>
                    <td className="px-3.5 py-[10px]">
                      {c.delegue !== "—" ? (
                        <div className="flex items-center gap-1.5">
                          <EduAvatar name={c.delegue} size={20} />
                          <span className="text-[var(--ink-3)]">{c.delegue}</span>
                        </div>
                      ) : (
                        <span className="text-[var(--ink-4)]">—</span>
                      )}
                    </td>
                    <td className="px-3.5 py-[10px] text-[var(--ink-3)]">{c.responsable}</td>
                    <td className="px-3.5 py-[10px]">
                      <EduBadge variant="neutral">{c.salle}</EduBadge>
                    </td>
                    <td className="px-3.5 py-[10px]">
                      <Button variant="ghost" size="xs">Détails</Button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
