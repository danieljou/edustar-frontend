"use client";
import { useState, useMemo } from "react";
import { UserCheck, UserX, Clock, ChevronDown, CheckSquare, Save, RotateCcw, Filter } from "lucide-react";
import { PageHeader } from "@/components/shared/PageHeader";
import { EduAvatar } from "@/components/shared/EduAvatar";
import { EduBadge } from "@/components/shared/EduBadge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { STUDENTS, CLASSES, EMPLOI_DU_TEMPS, MATIERES } from "@/constants/mock-data";
import { useToast } from "@/components/ui/toast";
import { cn } from "@/lib/utils";

type PresenceStatut = "Présent" | "Absent" | "Retard" | "Excusé";

const STATUT_CONFIG: Record<PresenceStatut, { label: string; color: string; icon: React.ReactNode; bg: string }> = {
  Présent: { label: "Présent", color: "text-[var(--success)]", icon: <UserCheck className="w-3.5 h-3.5" />, bg: "bg-[var(--success-light)] border-[rgba(10,124,78,0.3)]" },
  Absent: { label: "Absent", color: "text-[var(--danger)]", icon: <UserX className="w-3.5 h-3.5" />, bg: "bg-[var(--danger-light)] border-[rgba(192,57,43,0.3)]" },
  Retard: { label: "Retard", color: "text-[var(--warning)]", icon: <Clock className="w-3.5 h-3.5" />, bg: "bg-[var(--warning-light)] border-[rgba(180,83,9,0.3)]" },
  Excusé: { label: "Excusé", color: "text-[var(--ink-3)]", icon: <CheckSquare className="w-3.5 h-3.5" />, bg: "bg-[var(--ivory)] border-[var(--line-dark)]" },
};

const TODAY = new Date().toISOString().split("T")[0];
const TODAY_FR = new Date().toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long", year: "numeric" });

export default function AttendancePage() {
  const toast = useToast();
  const [classeId, setClasseId] = useState(CLASSES[0].code);
  const [coursId, setCoursId] = useState<string>("all");
  const [date, setDate] = useState(TODAY);
  const [saved, setSaved] = useState(false);

  const classeStudents = useMemo(
    () => STUDENTS.filter(s => s.classe === classeId),
    [classeId]
  );

  const [presences, setPresences] = useState<Record<string, PresenceStatut>>(() =>
    Object.fromEntries(classeStudents.map(s => [s.code, "Présent"]))
  );

  const coursDuJour = useMemo(() =>
    EMPLOI_DU_TEMPS.filter(e => e.classe === classeId),
    [classeId]
  );

  const markAll = (statut: PresenceStatut) => {
    setPresences(Object.fromEntries(classeStudents.map(s => [s.code, statut])));
  };

  const toggle = (code: string, statut: PresenceStatut) => {
    setPresences(prev => ({ ...prev, [code]: statut }));
    setSaved(false);
  };

  const handleClasseChange = (val: string) => {
    setClasseId(val);
    setSaved(false);
    const newStudents = STUDENTS.filter(s => s.classe === val);
    setPresences(Object.fromEntries(newStudents.map(s => [s.code, "Présent" as PresenceStatut])));
  };

  const handleSave = () => {
    const absents = Object.values(presences).filter(p => p === "Absent").length;
    setSaved(true);
    toast(`Feuille de présence sauvegardée${absents > 0 ? ` · ${absents} absence(s) enregistrée(s)` : " · Tous présents !"}`, absents > 0 ? "warning" : "success");
  };

  const counts = {
    present: Object.values(presences).filter(p => p === "Présent").length,
    absent: Object.values(presences).filter(p => p === "Absent").length,
    retard: Object.values(presences).filter(p => p === "Retard").length,
    excuse: Object.values(presences).filter(p => p === "Excusé").length,
  };

  const tauxPresence = classeStudents.length > 0
    ? Math.round((counts.present / classeStudents.length) * 100)
    : 0;

  return (
    <div>
      <PageHeader
        title="Présences"
        subtitle={TODAY_FR}
        actions={
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => markAll("Présent")}>
              <RotateCcw className="w-3.5 h-3.5" /> Tout présent
            </Button>
            <Button size="sm" onClick={handleSave} disabled={saved}>
              <Save className="w-3.5 h-3.5" /> {saved ? "Sauvegardé" : "Valider la feuille"}
            </Button>
          </div>
        }
      />

      {/* Filters */}
      <div className="flex items-center gap-3 mb-5 flex-wrap">
        <div className="flex items-center gap-2">
          <Filter className="w-3.5 h-3.5 text-[var(--ink-4)]" />
          <span className="text-[12px] font-semibold text-[var(--ink-3)]">Classe :</span>
          <div className="w-44">
            <Select value={classeId} onValueChange={handleClasseChange}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {CLASSES.map(c => <SelectItem key={c.code} value={c.code}>{c.code} — {c.filiere}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[12px] font-semibold text-[var(--ink-3)]">Cours :</span>
          <div className="w-52">
            <Select value={coursId} onValueChange={setCoursId}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les cours</SelectItem>
                {coursDuJour.map(c => {
                  const mat = MATIERES.find(m => m.code === c.matCode);
                  return (
                    <SelectItem key={c.id} value={c.id}>
                      {c.hDebut} · {mat?.lib || c.matCode}
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[12px] font-semibold text-[var(--ink-3)]">Date :</span>
          <input
            type="date"
            value={date}
            onChange={e => setDate(e.target.value)}
            className="h-9 px-3 text-[12.5px] border border-[var(--line-dark)] rounded-[8px] bg-white text-[var(--ink)] focus:outline-none focus:border-[var(--blue)] focus:ring-2 focus:ring-[var(--blue)]/10"
          />
        </div>
      </div>

      {/* Summary KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-5">
        {[
          { value: counts.present, total: classeStudents.length, ...STATUT_CONFIG.Présent },
          { value: counts.absent, total: classeStudents.length, ...STATUT_CONFIG.Absent },
          { value: counts.retard, total: classeStudents.length, ...STATUT_CONFIG.Retard },
          { value: counts.excuse, total: classeStudents.length, ...STATUT_CONFIG.Excusé },
        ].map(c => (
          <div key={c.label} className={`border rounded-[12px] p-3.5 flex items-center gap-3 ${c.bg}`}>
            <div className={cn("w-9 h-9 rounded-[8px] flex items-center justify-center shrink-0", c.bg, "border")}>
              <span className={c.color}>{c.icon}</span>
            </div>
            <div>
              <div className="text-[10px] font-bold uppercase tracking-widest text-[var(--ink-4)]">{c.label}</div>
              <div className={cn("font-serif text-[22px] leading-tight", c.color)}>
                {c.value}
                <span className="text-[13px] font-sans font-normal text-[var(--ink-4)] ml-1">/{c.total}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Taux de présence */}
      <div className="flex items-center gap-3 mb-5 p-4 bg-white border border-[var(--line)] rounded-[14px]">
        <div className="flex-1">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[12px] font-semibold text-[var(--ink-3)]">Taux de présence</span>
            <span className={cn("text-[14px] font-bold", tauxPresence >= 85 ? "text-[var(--success)]" : tauxPresence >= 70 ? "text-[var(--warning)]" : "text-[var(--danger)]")}>
              {tauxPresence}%
            </span>
          </div>
          <div className="h-2 bg-[var(--line)] rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{
                width: `${tauxPresence}%`,
                background: tauxPresence >= 85 ? "var(--success)" : tauxPresence >= 70 ? "var(--warning)" : "var(--danger)",
              }}
            />
          </div>
        </div>
        {tauxPresence < 85 && (
          <div className="text-[11px] text-[var(--warning)] font-semibold flex items-center gap-1.5 shrink-0">
            <span className="w-2 h-2 rounded-full bg-[var(--warning)]" />
            Seuil alerte &lt; 85%
          </div>
        )}
      </div>

      {/* Student list */}
      <Card className="overflow-hidden">
        <CardHeader className="py-3 px-4 border-b border-[var(--line)] flex flex-row items-center justify-between">
          <CardTitle className="text-[13px]">
            {classeId} — {classeStudents.length} étudiant(s)
          </CardTitle>
          <div className="flex gap-1.5">
            {(["Présent", "Absent", "Retard"] as PresenceStatut[]).map(s => (
              <button
                key={s}
                onClick={() => markAll(s)}
                className={cn(
                  "px-2.5 py-1 rounded-[6px] text-[11px] font-semibold border transition-all",
                  STATUT_CONFIG[s].bg, STATUT_CONFIG[s].color
                )}
              >
                Tous {STATUT_CONFIG[s].label}
              </button>
            ))}
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {classeStudents.length === 0 ? (
            <div className="py-12 text-center text-[13px] text-[var(--ink-4)]">
              Aucun étudiant dans cette classe
            </div>
          ) : (
            <div className="divide-y divide-[var(--line)]">
              {classeStudents.map((student, idx) => {
                const statut = presences[student.code] ?? "Présent";
                const cfg = STATUT_CONFIG[statut];
                return (
                  <div
                    key={student.code}
                    className={cn(
                      "flex items-center gap-4 px-4 py-3 transition-colors",
                      statut === "Absent" && "bg-[var(--danger-light)]/30",
                      statut === "Retard" && "bg-[var(--warning-light)]/30",
                    )}
                  >
                    {/* Index */}
                    <span className="text-[11px] font-mono text-[var(--ink-4)] w-6 shrink-0 text-right">{idx + 1}</span>

                    {/* Avatar + name */}
                    <EduAvatar name={`${student.prenom} ${student.nom}`} size={32} />
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold text-[12.5px] text-[var(--ink)]">
                        {student.prenom} {student.nom}
                      </div>
                      <div className="text-[10.5px] text-[var(--ink-4)]">{student.code}</div>
                    </div>

                    {/* Absence history badge */}
                    {student.absences > 0 && (
                      <EduBadge variant={student.absences >= 10 ? "red" : "amber"} className="shrink-0">
                        {student.absences} abs. hist.
                      </EduBadge>
                    )}

                    {/* Toggle buttons */}
                    <div className="flex gap-1 shrink-0">
                      {(["Présent", "Absent", "Retard", "Excusé"] as PresenceStatut[]).map(s => (
                        <button
                          key={s}
                          onClick={() => toggle(student.code, s)}
                          title={s}
                          className={cn(
                            "flex items-center gap-1 px-2.5 py-1.5 rounded-[6px] text-[11px] font-semibold border transition-all",
                            statut === s
                              ? cn(STATUT_CONFIG[s].bg, STATUT_CONFIG[s].color, "shadow-sm")
                              : "bg-white border-[var(--line)] text-[var(--ink-4)] hover:border-[var(--ink-3)] hover:text-[var(--ink-3)]"
                          )}
                        >
                          <span className={statut === s ? STATUT_CONFIG[s].color : ""}>{STATUT_CONFIG[s].icon}</span>
                          <span className="hidden sm:inline">{s}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
