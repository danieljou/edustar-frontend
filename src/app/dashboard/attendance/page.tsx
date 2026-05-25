"use client";
import { useState } from "react";
import { Search, UserCheck, UserX, Clock } from "lucide-react";
import { PageHeader } from "@/components/shared/PageHeader";
import { EduAvatar } from "@/components/shared/EduAvatar";
import { EduBadge } from "@/components/shared/EduBadge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { STUDENTS, CLASSES } from "@/constants/mock-data";

const MOCK_PRESENCE = STUDENTS.map(s => ({
  ...s,
  statut: s.absences === 0 ? "Présent" : s.absences >= 10 ? "Absent" : s.absences >= 5 ? "Retard" : "Présent",
}));

export default function AttendancePage() {
  const [query, setQuery] = useState("");
  const [classe, setClasse] = useState("all");
  const [date] = useState(new Date().toISOString().split("T")[0]);

  const filtered = MOCK_PRESENCE.filter(s => {
    const matchClass = classe === "all" || s.classe === classe;
    const matchQuery = !query.trim() || (`${s.prenom} ${s.nom}`).toLowerCase().includes(query.toLowerCase());
    return matchClass && matchQuery;
  });

  const counts = {
    present: filtered.filter(s => s.statut === "Présent").length,
    absent: filtered.filter(s => s.statut === "Absent").length,
    late: filtered.filter(s => s.statut === "Retard").length,
  };

  return (
    <div>
      <PageHeader
        title="Présences"
        subtitle={`Feuille de présence · ${new Date(date).toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long" })}`}
        actions={<Button size="sm"><UserCheck className="w-3.5 h-3.5" /> Valider la feuille</Button>}
      />

      {/* Summary */}
      <div className="grid grid-cols-3 gap-3.5 mb-5">
        {[
          { label: "Présents", value: counts.present, icon: <UserCheck className="w-4 h-4" />, color: "bg-[var(--success-light)] text-[var(--success)]", accent: "var(--success)" },
          { label: "Absents", value: counts.absent, icon: <UserX className="w-4 h-4" />, color: "bg-[var(--danger-light)] text-[var(--danger)]", accent: "var(--danger)" },
          { label: "En retard", value: counts.late, icon: <Clock className="w-4 h-4" />, color: "bg-[var(--warning-light)] text-[var(--warning)]", accent: "var(--warning)" },
        ].map(c => (
          <div key={c.label} className="bg-white border border-[var(--line)] rounded-[14px] p-4 flex items-center gap-3">
            <div className={`w-10 h-10 rounded-[10px] flex items-center justify-center ${c.color}`}>{c.icon}</div>
            <div>
              <div className="text-[10px] font-bold uppercase tracking-widest text-[var(--ink-4)]">{c.label}</div>
              <div className="font-serif text-[22px] text-[var(--ink)]">{c.value}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="flex items-center gap-2.5 mb-4 flex-wrap">
        <div className="relative flex-1 max-w-xs">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[var(--ink-4)] pointer-events-none" />
          <Input placeholder="Rechercher un étudiant…" value={query} onChange={e => setQuery(e.target.value)} className="pl-8" />
        </div>
        <div className="w-44">
          <Select value={classe} onValueChange={setClasse}>
            <SelectTrigger><SelectValue placeholder="Toutes les classes" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Toutes les classes</SelectItem>
              {CLASSES.map(c => <SelectItem key={c.code} value={c.code}>{c.code}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
      </div>

      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-[12.5px]">
            <thead>
              <tr className="bg-[var(--ivory)]">
                {["Étudiant", "Classe", "Total absences", "Statut aujourd'hui", "Action"].map(h => (
                  <th key={h} className="px-3.5 py-[9px] text-left text-[9.5px] font-bold uppercase tracking-[0.07em] text-[var(--ink-4)] border-b border-[var(--line)] whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map(s => (
                <tr key={s.code} className="border-b border-[var(--line)] last:border-0 hover:bg-[var(--blue-lighter)] transition-colors">
                  <td className="px-3.5 py-[10px]">
                    <div className="flex items-center gap-2">
                      <EduAvatar name={`${s.prenom} ${s.nom}`} size={28} />
                      <div>
                        <div className="font-semibold text-[var(--ink)]">{s.prenom} {s.nom}</div>
                        <div className="text-[10.5px] text-[var(--ink-4)]">{s.code}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-3.5 py-[10px] text-[11px] font-semibold">{s.classe}</td>
                  <td className="px-3.5 py-[10px]">
                    <EduBadge variant={s.absences >= 10 ? "red" : s.absences >= 5 ? "amber" : "neutral"}>{s.absences} absences</EduBadge>
                  </td>
                  <td className="px-3.5 py-[10px]">
                    <EduBadge variant={s.statut === "Présent" ? "green" : s.statut === "Absent" ? "red" : "amber"}>
                      {s.statut}
                    </EduBadge>
                  </td>
                  <td className="px-3.5 py-[10px]">
                    <div className="flex gap-1">
                      <button className="px-2.5 py-1 rounded-[5px] text-[10.5px] font-bold bg-[var(--success-light)] text-[var(--success)] hover:opacity-80 transition-opacity">P</button>
                      <button className="px-2.5 py-1 rounded-[5px] text-[10.5px] font-bold bg-[var(--danger-light)] text-[var(--danger)] hover:opacity-80 transition-opacity">A</button>
                      <button className="px-2.5 py-1 rounded-[5px] text-[10.5px] font-bold bg-[var(--warning-light)] text-[var(--warning)] hover:opacity-80 transition-opacity">R</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
