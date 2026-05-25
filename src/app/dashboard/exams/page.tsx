"use client";
import { useState } from "react";
import { Plus, Search, Download, Award, BarChart3 } from "lucide-react";
import { PageHeader } from "@/components/shared/PageHeader";
import { EduAvatar } from "@/components/shared/EduAvatar";
import { EduBadge } from "@/components/shared/EduBadge";
import { EmptyState } from "@/components/shared/EmptyState";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { NOTES, MATIERES, STUDENTS, CLASSES } from "@/constants/mock-data";

export default function ExamsPage() {
  const [query, setQuery] = useState("");

  const getStudent = (code: string) => STUDENTS.find(s => s.code === code);
  const getMatiere = (code: string) => MATIERES.find(m => m.code === code);

  const filtered = NOTES.filter(n => {
    if (!query.trim()) return true;
    const q = query.toLowerCase();
    const stu = getStudent(n.etuCode);
    return n.etuCode.toLowerCase().includes(q) ||
      (stu && (`${stu.prenom} ${stu.nom}`).toLowerCase().includes(q));
  });

  return (
    <div>
      <PageHeader
        title="Examens & Notes"
        subtitle={`${NOTES.length} notes saisies · ${MATIERES.length} matières`}
        actions={
          <>
            <Button variant="outline" size="sm"><Download className="w-3.5 h-3.5" /> Export</Button>
            <Button size="sm"><Plus className="w-3.5 h-3.5" /> Saisir notes</Button>
          </>
        }
      />

      {/* Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5 mb-5">
        {[
          { label: "Matières", value: MATIERES.length, color: "var(--blue)" },
          { label: "Notes saisies", value: NOTES.length, color: "var(--cyan)" },
          { label: "Taux validation", value: `${Math.round(NOTES.filter(n => n.statut === "Validé").length / NOTES.length * 100)}%`, color: "var(--success)" },
          { label: "En rattrapage", value: NOTES.filter(n => n.statut === "Rattrapage").length, color: "var(--warning)" },
        ].map(c => (
          <div key={c.label} className="bg-white border border-[var(--line)] rounded-[14px] p-4 text-center relative overflow-hidden">
            <div className="absolute bottom-0 left-0 right-0 h-[3px] rounded-b-[14px]" style={{ background: c.color }} />
            <div className="text-[10px] font-bold uppercase tracking-widest text-[var(--ink-4)] mb-1.5">{c.label}</div>
            <div className="font-serif text-[24px] text-[var(--ink)]" style={{ color: c.color }}>{c.value}</div>
          </div>
        ))}
      </div>

      <Tabs defaultValue="notes">
        <TabsList>
          <TabsTrigger value="notes">Notes <span className="ml-1 text-[9.5px] font-bold font-mono bg-[var(--ivory)] text-[var(--ink-4)] rounded-full px-1.5 py-0.5">{NOTES.length}</span></TabsTrigger>
          <TabsTrigger value="matieres">Matières <span className="ml-1 text-[9.5px] font-bold font-mono bg-[var(--ivory)] text-[var(--ink-4)] rounded-full px-1.5 py-0.5">{MATIERES.length}</span></TabsTrigger>
          <TabsTrigger value="classes">Par classe</TabsTrigger>
        </TabsList>

        <TabsContent value="notes">
          <div className="flex items-center gap-2.5 mb-4">
            <div className="relative flex-1 max-w-xs">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[var(--ink-4)] pointer-events-none" />
              <Input placeholder="Étudiant, code…" value={query} onChange={e => setQuery(e.target.value)} className="pl-8" />
            </div>
          </div>
          <Card className="overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-[12.5px]">
                <thead>
                  <tr className="bg-[var(--ivory)]">
                    {["Étudiant", "Matière", "DS", "TP", "Exam", "Moyenne", "Statut"].map(h => (
                      <th key={h} className="px-3.5 py-[9px] text-left text-[9.5px] font-bold uppercase tracking-[0.07em] text-[var(--ink-4)] border-b border-[var(--line)] whitespace-nowrap">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filtered.length === 0 && <tr><td colSpan={7}><EmptyState title="Aucune note" description="Aucune note saisie pour ce critère." /></td></tr>}
                  {filtered.map(n => {
                    const stu = getStudent(n.etuCode);
                    const mat = getMatiere(n.matCode);
                    return (
                      <tr key={n.id} className="border-b border-[var(--line)] last:border-0 hover:bg-[var(--blue-lighter)] cursor-pointer transition-colors">
                        <td className="px-3.5 py-[10px]">
                          <div className="flex items-center gap-2">
                            {stu && <EduAvatar name={`${stu.prenom} ${stu.nom}`} size={26} />}
                            <span className="font-semibold text-[var(--ink)]">{stu ? `${stu.prenom} ${stu.nom}` : n.etuCode}</span>
                          </div>
                        </td>
                        <td className="px-3.5 py-[10px]">
                          <div className="font-semibold text-[11px]">{mat?.code || n.matCode}</div>
                          <div className="text-[10px] text-[var(--ink-4)] truncate max-w-[160px]">{mat?.lib}</div>
                        </td>
                        <td className="px-3.5 py-[10px] font-mono text-[12px]">{n.ds}</td>
                        <td className="px-3.5 py-[10px] font-mono text-[12px]">{n.tp ?? "—"}</td>
                        <td className="px-3.5 py-[10px] font-mono text-[12px]">{n.exam}</td>
                        <td className="px-3.5 py-[10px]">
                          <span className="font-bold text-[16px] font-serif" style={{ color: n.moy >= 14 ? "var(--success)" : n.moy >= 10 ? "var(--warning)" : "var(--danger)" }}>
                            {n.moy}
                          </span>
                          <span className="text-[10.5px] text-[var(--ink-4)]">/20</span>
                        </td>
                        <td className="px-3.5 py-[10px]">
                          <EduBadge variant={n.statut === "Validé" ? "green" : n.statut === "Rattrapage" ? "amber" : "red"}>{n.statut}</EduBadge>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="matieres">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {MATIERES.map(m => (
              <Card key={m.code} className="p-4 hover:border-[var(--blue)] transition-colors cursor-pointer">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-mono text-[11px] text-[var(--blue)] font-semibold">{m.code}</span>
                      <EduBadge variant="neutral">{m.type}</EduBadge>
                    </div>
                    <div className="text-[13px] font-semibold text-[var(--ink)] leading-tight">{m.lib}</div>
                    <div className="text-[11px] text-[var(--ink-4)] mt-1">{m.ens} · {m.filiere} {m.niveau}</div>
                  </div>
                  <div className="text-right shrink-0">
                    <div className="text-[10px] text-[var(--ink-4)]">Crédits</div>
                    <div className="font-bold text-[16px] text-[var(--blue)]">{m.credits}</div>
                    <div className="text-[10px] text-[var(--ink-4)]">Coeff. {m.coeff}</div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="classes">
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
            {CLASSES.map(c => {
              const classStudents = STUDENTS.filter(s => s.classe === c.code);
              const avgMoy = classStudents.length > 0
                ? (classStudents.reduce((s, st) => s + st.moy, 0) / classStudents.length).toFixed(1)
                : "0.0";
              return (
                <Card key={c.id} className="p-4 hover:border-[var(--blue)] transition-colors cursor-pointer">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <div className="font-mono text-[12px] text-[var(--blue)] font-bold">{c.code}</div>
                      <div className="text-[11px] text-[var(--ink-4)]">{c.filiere} · {c.niveau}</div>
                    </div>
                    <EduBadge variant="blue">{c.effectif} étu.</EduBadge>
                  </div>
                  <div className="flex items-center justify-between text-[12px]">
                    <span className="text-[var(--ink-4)]">Moy. classe</span>
                    <span className="font-bold text-[var(--ink)]">{avgMoy}/20</span>
                  </div>
                  <div className="text-[11px] text-[var(--ink-4)] mt-1">{c.responsable}</div>
                </Card>
              );
            })}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
