"use client";
import { useState } from "react";
import { Download, Award, TrendingUp, BookOpen, User } from "lucide-react";
import { PageHeader } from "@/components/shared/PageHeader";
import { EduBadge } from "@/components/shared/EduBadge";
import { EduAvatar } from "@/components/shared/EduAvatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { BULLETINS, STUDENTS } from "@/constants/mock-data";

const getMention = (moy: number) => {
  if (moy >= 16) return { label: "Très bien", color: "var(--success)" };
  if (moy >= 14) return { label: "Bien", color: "var(--cyan)" };
  if (moy >= 12) return { label: "Assez bien", color: "var(--blue)" };
  if (moy >= 10) return { label: "Passable", color: "var(--warning)" };
  return { label: "Insuffisant", color: "var(--danger)" };
};

export default function BulletinsPage() {
  const [etuCode, setEtuCode] = useState(BULLETINS[0].etuCode);
  const [semestre, setSemestre] = useState<"S1" | "S2">("S1");

  const bulletin = BULLETINS.find(b => b.etuCode === etuCode && b.semestre === semestre);
  const etudiant = STUDENTS.find(s => s.code === etuCode);
  const mention = bulletin ? getMention(bulletin.moyGeneral) : null;

  const bulletinStudents = STUDENTS.filter(s => BULLETINS.some(b => b.etuCode === s.code));

  return (
    <div>
      <PageHeader
        title="Bulletins de notes"
        subtitle="Résultats académiques par étudiant"
        actions={
          <Button variant="outline" size="sm" disabled={!bulletin}>
            <Download className="w-3.5 h-3.5" /> Télécharger PDF
          </Button>
        }
      />

      {/* Selector */}
      <div className="flex items-center gap-3 mb-5 p-4 bg-white border border-[var(--line)] rounded-[14px]">
        <User className="w-4 h-4 text-[var(--ink-4)] shrink-0" />
        <div className="w-64">
          <Select value={etuCode} onValueChange={setEtuCode}>
            <SelectTrigger>
              <SelectValue placeholder="Sélectionner un étudiant" />
            </SelectTrigger>
            <SelectContent>
              {bulletinStudents.map(s => (
                <SelectItem key={s.code} value={s.code}>
                  {s.prenom} {s.nom} — {s.classe}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="w-32">
          <Select value={semestre} onValueChange={v => setSemestre(v as "S1" | "S2")}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="S1">Semestre 1</SelectItem>
              <SelectItem value="S2">Semestre 2</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="text-[11px] text-[var(--ink-4)]">Session 2025–2026</div>
      </div>

      {!bulletin ? (
        <Card className="p-12 text-center">
          <Award className="w-10 h-10 text-[var(--ink-4)] mx-auto mb-2 opacity-40" />
          <p className="text-[13px] text-[var(--ink-4)]">Aucun bulletin disponible pour cet étudiant / semestre</p>
        </Card>
      ) : (
        <div className="max-w-3xl">
          {/* Student header */}
          <Card className="mb-4 overflow-hidden">
            <div className="h-1 progress-gradient" />
            <CardContent className="p-5">
              <div className="flex items-center gap-4">
                {etudiant && <EduAvatar name={`${etudiant.prenom} ${etudiant.nom}`} size={52} />}
                <div className="flex-1">
                  {etudiant && (
                    <>
                      <div className="font-serif text-[18px] text-[var(--ink)]">{etudiant.prenom} {etudiant.nom}</div>
                      <div className="text-[11.5px] text-[var(--ink-4)] mt-0.5">
                        {etudiant.code} · {etudiant.classe} · {etudiant.filiere}
                      </div>
                    </>
                  )}
                  <div className="flex items-center gap-2 mt-2">
                    <EduBadge variant="blue">Semestre {semestre.replace("S", "")}</EduBadge>
                    <EduBadge variant="neutral">{bulletin.statut}</EduBadge>
                  </div>
                </div>

                {/* Moyenne générale */}
                <div className="text-center px-5 border-l border-[var(--line)]">
                  <div className="text-[10px] font-bold uppercase tracking-widest text-[var(--ink-4)] mb-1">Moyenne générale</div>
                  <div className="font-serif text-[38px] leading-none" style={{ color: mention?.color }}>{bulletin.moyGeneral.toFixed(2)}</div>
                  <div className="text-[11px] font-semibold mt-1" style={{ color: mention?.color }}>{mention?.label}</div>
                </div>

                {/* Rang */}
                <div className="text-center px-5 border-l border-[var(--line)]">
                  <div className="text-[10px] font-bold uppercase tracking-widest text-[var(--ink-4)] mb-1">Rang</div>
                  <div className="font-serif text-[38px] leading-none text-[var(--purple)]">{bulletin.rang}</div>
                  <div className="text-[11px] text-[var(--ink-4)]">/{bulletin.effectifClasse}</div>
                </div>
              </div>

              {/* Credits summary */}
              <div className="grid grid-cols-3 gap-3 mt-4 pt-4 border-t border-[var(--line)]">
                {[
                  { label: "Crédits totaux", value: bulletin.totalCredits, color: "var(--blue)", icon: <BookOpen className="w-3.5 h-3.5" /> },
                  { label: "Crédits validés", value: bulletin.creditsValides, color: "var(--success)", icon: <Award className="w-3.5 h-3.5" /> },
                  { label: "Taux validation", value: `${Math.round((bulletin.creditsValides / bulletin.totalCredits) * 100)}%`, color: "var(--cyan)", icon: <TrendingUp className="w-3.5 h-3.5" /> },
                ].map(k => (
                  <div key={k.label} className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-[6px] flex items-center justify-center" style={{ background: `${k.color}18`, color: k.color }}>
                      {k.icon}
                    </div>
                    <div>
                      <div className="text-[9.5px] text-[var(--ink-4)] uppercase font-bold tracking-wide">{k.label}</div>
                      <div className="font-bold text-[13px]" style={{ color: k.color }}>{k.value}</div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Notes table */}
          <Card className="overflow-hidden mb-4">
            <CardHeader className="py-3.5 px-4 border-b border-[var(--line)]">
              <CardTitle className="text-[13px]">Détail des notes</CardTitle>
            </CardHeader>
            <div className="overflow-x-auto">
              <table className="w-full text-[12.5px]">
                <thead>
                  <tr className="bg-[var(--ivory)]">
                    {["Matière", "Cr.", "Coef.", "DS", "TP", "Exam.", "Moy.", "Statut"].map(h => (
                      <th key={h} className="px-3.5 py-[9px] text-left text-[9.5px] font-bold uppercase tracking-[0.07em] text-[var(--ink-4)] border-b border-[var(--line)] whitespace-nowrap">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {bulletin.notes.map(note => {
                    const moyColor = note.moy >= 10 ? "var(--success)" : "var(--danger)";
                    return (
                      <tr key={note.matCode} className="border-b border-[var(--line)] last:border-0 hover:bg-[var(--blue-lighter)] transition-colors">
                        <td className="px-3.5 py-[10px]">
                          <div className="font-medium text-[var(--ink)]">{note.matLib}</div>
                          <div className="text-[10px] font-mono text-[var(--ink-4)]">{note.matCode}</div>
                        </td>
                        <td className="px-3.5 py-[10px] text-center font-bold text-[var(--blue)]">{note.credits}</td>
                        <td className="px-3.5 py-[10px] text-center text-[var(--ink-3)]">{note.coeff}</td>
                        <td className="px-3.5 py-[10px] text-center text-[var(--ink-3)]">{note.ds}</td>
                        <td className="px-3.5 py-[10px] text-center text-[var(--ink-3)]">{note.tp ?? "—"}</td>
                        <td className="px-3.5 py-[10px] text-center text-[var(--ink-3)]">{note.exam}</td>
                        <td className="px-3.5 py-[10px]">
                          <span className="font-bold text-[13px]" style={{ color: moyColor }}>{note.moy.toFixed(1)}</span>
                          <span className="text-[10px] text-[var(--ink-4)]">/20</span>
                        </td>
                        <td className="px-3.5 py-[10px]">
                          <EduBadge variant={note.statut === "Validé" ? "green" : note.statut === "Rattrapage" ? "amber" : "red"}>
                            {note.statut}
                          </EduBadge>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </Card>

          {/* Appreciation */}
          <Card className="p-4">
            <div className="text-[10px] font-bold uppercase tracking-widest text-[var(--ink-4)] mb-2">Appréciation du jury</div>
            <p className="text-[13px] text-[var(--ink-2)] leading-relaxed italic">"{bulletin.appreciation}"</p>
          </Card>
        </div>
      )}
    </div>
  );
}
