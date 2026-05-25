"use client";
import { useState } from "react";
import { Plus, Filter } from "lucide-react";
import { PageHeader } from "@/components/shared/PageHeader";
import { EduBadge } from "@/components/shared/EduBadge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { EMPLOI_DU_TEMPS, CLASSES, MATIERES } from "@/constants/mock-data";
import { cn } from "@/lib/utils";

const JOURS = ["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi"];
const HEURES = ["08:00", "10:00", "12:00", "14:00", "16:00", "18:00"];

const TYPE_COLORS: Record<string, string> = {
  CM: "bg-[var(--blue-light)] text-[var(--blue)] border-[rgba(26,60,143,0.2)]",
  TD: "bg-[var(--success-light)] text-[var(--success)] border-[rgba(10,124,78,0.2)]",
  TP: "bg-[var(--warning-light)] text-[var(--warning)] border-[rgba(180,83,9,0.2)]",
};

export default function TimetablePage() {
  const [classeFilter, setClasseFilter] = useState("all");

  const filteredEDT = classeFilter === "all"
    ? EMPLOI_DU_TEMPS
    : EMPLOI_DU_TEMPS.filter(e => e.classe === classeFilter);

  const getSlot = (jour: string, hDebut: string) =>
    filteredEDT.filter(e => e.jour === jour && e.hDebut === hDebut);

  const getMatLib = (code: string) => MATIERES.find(m => m.code === code)?.lib || code;

  return (
    <div>
      <PageHeader
        title="Emplois du temps"
        subtitle={`${EMPLOI_DU_TEMPS.length} cours planifiés · Session 2025–2026`}
        actions={<Button size="sm"><Plus className="w-3.5 h-3.5" /> Ajouter créneau</Button>}
      />

      {/* Filter */}
      <div className="flex items-center gap-3 mb-5">
        <Filter className="w-4 h-4 text-[var(--ink-4)]" />
        <div className="w-48">
          <Select value={classeFilter} onValueChange={setClasseFilter}>
            <SelectTrigger><SelectValue placeholder="Toutes les classes" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Toutes les classes</SelectItem>
              {CLASSES.map(c => <SelectItem key={c.code} value={c.code}>{c.code}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
        {classeFilter !== "all" && (
          <button onClick={() => setClasseFilter("all")} className="text-[12px] text-[var(--blue)] hover:underline">
            Réinitialiser
          </button>
        )}
      </div>

      {/* Grid timetable */}
      <div className="overflow-x-auto">
        <div className="min-w-[700px]">
          <div className="grid gap-[1px] bg-[var(--line)] rounded-[14px] overflow-hidden border border-[var(--line)]" style={{ gridTemplateColumns: "80px repeat(5, 1fr)" }}>
            {/* Header row */}
            <div className="bg-[var(--ivory)] px-2 py-2.5 flex items-center justify-center">
              <span className="text-[9.5px] font-bold uppercase tracking-[0.07em] text-[var(--ink-4)]">Heure</span>
            </div>
            {JOURS.map(j => (
              <div key={j} className="bg-[var(--ivory)] px-2 py-2.5 flex items-center justify-center">
                <span className="text-[10px] font-bold uppercase tracking-[0.06em] text-[var(--ink-4)]">{j}</span>
              </div>
            ))}

            {/* Time slots */}
            {HEURES.slice(0, -1).map(h => (
              <>
                <div key={`time-${h}`} className="bg-white flex items-center justify-center px-2 min-h-[72px]">
                  <span className="font-mono text-[11px] text-[var(--ink-4)] font-semibold">{h}</span>
                </div>
                {JOURS.map(j => {
                  const slots = getSlot(j, h);
                  return (
                    <div key={`${j}-${h}`} className="bg-white p-1.5 min-h-[72px]">
                      {slots.map(slot => (
                        <div
                          key={slot.id}
                          className={cn(
                            "rounded-[6px] p-1.5 mb-1 cursor-pointer border text-[10px] font-bold hover:opacity-80 transition-opacity",
                            TYPE_COLORS[slot.type]
                          )}
                        >
                          <div className="truncate">{getMatLib(slot.matCode)}</div>
                          <div className="font-normal mt-0.5 opacity-80">{slot.classe} · {slot.salle}</div>
                          <div className="font-normal opacity-70">{slot.ens}</div>
                          <span className="inline-block mt-0.5 text-[8.5px] font-bold uppercase tracking-widest opacity-80">{slot.type}</span>
                        </div>
                      ))}
                    </div>
                  );
                })}
              </>
            ))}
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="flex items-center gap-4 mt-4">
        <span className="text-[11px] font-bold text-[var(--ink-4)] uppercase tracking-widest">Légende :</span>
        {Object.entries(TYPE_COLORS).map(([type, cls]) => (
          <div key={type} className={cn("flex items-center gap-1.5 px-2.5 py-1 rounded-[6px] text-[11px] font-bold border", cls)}>
            {type}
          </div>
        ))}
      </div>

      {/* List view */}
      <Card className="mt-5">
        <CardHeader>
          <CardTitle>Liste des cours planifiés</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-[12.5px]">
              <thead>
                <tr className="bg-[var(--ivory)]">
                  {["Jour", "Horaire", "Matière", "Classe", "Salle", "Enseignant", "Type"].map(h => (
                    <th key={h} className="px-3.5 py-[9px] text-left text-[9.5px] font-bold uppercase tracking-[0.07em] text-[var(--ink-4)] border-b border-[var(--line)] whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filteredEDT.map(e => (
                  <tr key={e.id} className="border-b border-[var(--line)] last:border-0 hover:bg-[var(--blue-lighter)] transition-colors cursor-pointer">
                    <td className="px-3.5 py-[10px] font-semibold">{e.jour}</td>
                    <td className="px-3.5 py-[10px] font-mono text-[11px] text-[var(--blue)]">{e.hDebut}–{e.hFin}</td>
                    <td className="px-3.5 py-[10px]">
                      <div className="font-semibold text-[11px]">{e.matCode}</div>
                      <div className="text-[10px] text-[var(--ink-4)] truncate max-w-[160px]">{getMatLib(e.matCode)}</div>
                    </td>
                    <td className="px-3.5 py-[10px]"><EduBadge variant="blue">{e.classe}</EduBadge></td>
                    <td className="px-3.5 py-[10px] text-[var(--ink-4)]">{e.salle}</td>
                    <td className="px-3.5 py-[10px] font-medium">{e.ens}</td>
                    <td className="px-3.5 py-[10px]">
                      <EduBadge variant={e.type === "CM" ? "blue" : e.type === "TD" ? "green" : "amber"}>{e.type}</EduBadge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
