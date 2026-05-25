"use client";
import { useState, useMemo } from "react";
import { Plus, Search, Download, Award, Save, X } from "lucide-react";
import { PageHeader } from "@/components/shared/PageHeader";
import { EduAvatar } from "@/components/shared/EduAvatar";
import { EduBadge } from "@/components/shared/EduBadge";
import { EmptyState } from "@/components/shared/EmptyState";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogBody, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { NOTES, MATIERES, STUDENTS, CLASSES } from "@/constants/mock-data";
import { useToast } from "@/components/ui/toast";
import { cn } from "@/lib/utils";

type NoteEntry = { ds: string; tp: string; exam: string };

export default function ExamsPage() {
  const toast = useToast();
  const [query, setQuery] = useState("");
  const [showSaisie, setShowSaisie] = useState(false);
  const [saisieClasse, setSaisieClasse] = useState(CLASSES[0]?.code ?? "");
  const [saisieMatiere, setSaisieMatiere] = useState(MATIERES[0]?.code ?? "");
  const [entries, setEntries] = useState<Record<string, NoteEntry>>({});

  const getStudent = (code: string) => STUDENTS.find(s => s.code === code);
  const getMatiere = (code: string) => MATIERES.find(m => m.code === code);

  const filtered = NOTES.filter(n => {
    if (!query.trim()) return true;
    const q = query.toLowerCase();
    const stu = getStudent(n.etuCode);
    return n.etuCode.toLowerCase().includes(q) ||
      (stu && (`${stu.prenom} ${stu.nom}`).toLowerCase().includes(q));
  });

  const classeStudents = useMemo(
    () => STUDENTS.filter(s => s.classe === saisieClasse),
    [saisieClasse]
  );

  const selectedMatiere = getMatiere(saisieMatiere);

  const openSaisie = () => {
    setEntries(Object.fromEntries(classeStudents.map(s => [s.code, { ds: "", tp: "", exam: "" }])));
    setShowSaisie(true);
  };

  const updateEntry = (code: string, field: keyof NoteEntry, value: string) => {
    const num = value === "" ? "" : Math.min(20, Math.max(0, parseFloat(value) || 0)).toString();
    setEntries(prev => ({ ...prev, [code]: { ...prev[code], [field]: num } }));
  };

  const calcMoy = (e: NoteEntry) => {
    const ds = parseFloat(e.ds) || 0;
    const tp = parseFloat(e.tp) || null;
    const exam = parseFloat(e.exam) || 0;
    if (tp !== null) return ((ds * 0.3 + tp * 0.2 + exam * 0.5)).toFixed(2);
    return ((ds * 0.4 + exam * 0.6)).toFixed(2);
  };

  const handleSave = () => {
    const filled = Object.values(entries).filter(e => e.ds || e.exam).length;
    setShowSaisie(false);
    toast(`Notes saisies pour ${filled} étudiant(s) — ${selectedMatiere?.lib ?? saisieMatiere}`, "success");
  };

  return (
    <div>
      <PageHeader
        title="Examens & Notes"
        subtitle={`${NOTES.length} notes saisies · ${MATIERES.length} matières`}
        actions={
          <>
            <Button variant="outline" size="sm"><Download className="w-3.5 h-3.5" /> Export</Button>
            <Button size="sm" onClick={openSaisie}><Plus className="w-3.5 h-3.5" /> Saisir notes</Button>
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

      {/* Grade entry dialog */}
      <Dialog open={showSaisie} onOpenChange={setShowSaisie}>
        <DialogContent size="lg">
          <DialogHeader>
            <DialogTitle>Saisie des notes</DialogTitle>
          </DialogHeader>
          <DialogBody>
            {/* Selectors */}
            <div className="grid grid-cols-2 gap-3 mb-5 p-4 bg-[var(--ivory)] rounded-[10px]">
              <div>
                <Label>Classe</Label>
                <Select value={saisieClasse} onValueChange={val => {
                  setSaisieClasse(val);
                  const newStudents = STUDENTS.filter(s => s.classe === val);
                  setEntries(Object.fromEntries(newStudents.map(s => [s.code, { ds: "", tp: "", exam: "" }])));
                }}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {CLASSES.map(c => <SelectItem key={c.code} value={c.code}>{c.code}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Matière</Label>
                <Select value={saisieMatiere} onValueChange={setSaisieMatiere}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {MATIERES.filter(m => m.filiere === CLASSES.find(c => c.code === saisieClasse)?.filiere || true).map(m => (
                      <SelectItem key={m.code} value={m.code}>{m.code} — {m.lib}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Grade table */}
            <div className="overflow-x-auto max-h-[380px] overflow-y-auto">
              <table className="w-full text-[12.5px]">
                <thead className="sticky top-0 bg-white z-10">
                  <tr className="bg-[var(--ivory)]">
                    <th className="px-3 py-2.5 text-left text-[9.5px] font-bold uppercase tracking-[0.07em] text-[var(--ink-4)] border-b border-[var(--line)]">Étudiant</th>
                    <th className="px-3 py-2.5 text-center text-[9.5px] font-bold uppercase tracking-[0.07em] text-[var(--ink-4)] border-b border-[var(--line)] w-24">DS (/20)</th>
                    <th className="px-3 py-2.5 text-center text-[9.5px] font-bold uppercase tracking-[0.07em] text-[var(--ink-4)] border-b border-[var(--line)] w-24">TP (/20)</th>
                    <th className="px-3 py-2.5 text-center text-[9.5px] font-bold uppercase tracking-[0.07em] text-[var(--ink-4)] border-b border-[var(--line)] w-24">Exam (/20)</th>
                    <th className="px-3 py-2.5 text-center text-[9.5px] font-bold uppercase tracking-[0.07em] text-[var(--ink-4)] border-b border-[var(--line)] w-20">Moy.</th>
                  </tr>
                </thead>
                <tbody>
                  {classeStudents.length === 0 && (
                    <tr><td colSpan={5} className="py-8 text-center text-[var(--ink-4)] text-[12px]">Aucun étudiant dans cette classe</td></tr>
                  )}
                  {classeStudents.map(stu => {
                    const e = entries[stu.code] ?? { ds: "", tp: "", exam: "" };
                    const moy = (e.ds || e.exam) ? calcMoy(e) : "—";
                    const moyNum = parseFloat(moy);
                    return (
                      <tr key={stu.code} className="border-b border-[var(--line)] last:border-0 hover:bg-[var(--blue-lighter)] transition-colors">
                        <td className="px-3 py-2.5">
                          <div className="flex items-center gap-2">
                            <EduAvatar name={`${stu.prenom} ${stu.nom}`} size={24} />
                            <div>
                              <div className="font-semibold text-[var(--ink)]">{stu.prenom} {stu.nom}</div>
                              <div className="text-[10px] text-[var(--ink-4)]">{stu.code}</div>
                            </div>
                          </div>
                        </td>
                        {(["ds", "tp", "exam"] as const).map(field => (
                          <td key={field} className="px-3 py-2.5 text-center">
                            <input
                              type="number"
                              min="0" max="20" step="0.25"
                              value={e[field]}
                              onChange={ev => updateEntry(stu.code, field, ev.target.value)}
                              placeholder="—"
                              className="w-20 h-8 text-center text-[12.5px] font-mono border border-[var(--line-dark)] rounded-[6px] bg-white text-[var(--ink)] focus:outline-none focus:border-[var(--blue)] focus:ring-2 focus:ring-[var(--blue)]/10 placeholder:text-[var(--ink-5)]"
                            />
                          </td>
                        ))}
                        <td className="px-3 py-2.5 text-center">
                          {moy === "—" ? (
                            <span className="text-[var(--ink-4)] font-mono">—</span>
                          ) : (
                            <span className={cn("font-bold text-[14px] font-serif", moyNum >= 14 ? "text-[var(--success)]" : moyNum >= 10 ? "text-[var(--warning)]" : "text-[var(--danger)]")}>
                              {moy}
                            </span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </DialogBody>
          <DialogFooter>
            <Button variant="outline" size="sm" onClick={() => setShowSaisie(false)}>Annuler</Button>
            <Button size="sm" onClick={handleSave}>
              <Save className="w-3.5 h-3.5" /> Enregistrer les notes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
