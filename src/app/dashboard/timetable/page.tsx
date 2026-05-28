"use client";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Plus, Filter } from "lucide-react";
import { PageHeader } from "@/components/shared/PageHeader";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { DataTable } from "@/components/data-table";
import { getScheduleColumns } from "@/components/data-table/columns/schedule-columns";
import { EMPLOI_DU_TEMPS, CLASSES, MATIERES } from "@/constants/mock-data";
import { cn } from "@/lib/utils";

const JOURS_KEYS = ["monday", "tuesday", "wednesday", "thursday", "friday"] as const;
const JOURS_VALUES = ["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi"] as const;
const HEURES = ["08:00", "10:00", "12:00", "14:00", "16:00", "18:00"];

const TYPE_COLORS: Record<string, string> = {
  CM: "bg-[var(--blue-light)] text-[var(--blue)] border-[rgba(26,60,143,0.2)]",
  TD: "bg-[var(--success-light)] text-[var(--success)] border-[rgba(10,124,78,0.2)]",
  TP: "bg-[var(--warning-light)] text-[var(--warning)] border-[rgba(180,83,9,0.2)]",
};

export default function TimetablePage() {
  const { t } = useTranslation("pedagogie");
  const [classeFilter, setClasseFilter] = useState("all");

  const columns = getScheduleColumns(t);

  const filteredEDT = classeFilter === "all"
    ? EMPLOI_DU_TEMPS
    : EMPLOI_DU_TEMPS.filter(e => e.classe === classeFilter);

  const getSlot = (jour: string, hDebut: string) =>
    filteredEDT.filter(e => e.jour === jour && e.hDebut === hDebut);

  const getMatLib = (code: string) => MATIERES.find(m => m.code === code)?.lib || code;

  return (
    <div>
      <PageHeader
        title={t("timetable.pageTitle")}
        subtitle={t("timetable.subtitle", { count: EMPLOI_DU_TEMPS.length })}
        actions={<Button size="sm"><Plus className="w-3.5 h-3.5" /> {t("timetable.addSlot")}</Button>}
      />

      {/* Filter */}
      <div className="flex items-center gap-3 mb-5">
        <Filter className="w-4 h-4 text-[var(--ink-4)]" />
        <div className="w-48">
          <Select value={classeFilter} onValueChange={setClasseFilter}>
            <SelectTrigger><SelectValue placeholder={t("timetable.allClasses")} /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t("timetable.allClasses")}</SelectItem>
              {CLASSES.map(c => <SelectItem key={c.code} value={c.code}>{c.code}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
        {classeFilter !== "all" && (
          <button onClick={() => setClasseFilter("all")} className="text-[12px] text-[var(--blue)] hover:underline">
            {t("timetable.reset")}
          </button>
        )}
      </div>

      {/* Grid timetable */}
      <div className="overflow-x-auto">
        <div className="min-w-[700px]">
          <div className="grid gap-[1px] bg-[var(--line)] rounded-[14px] overflow-hidden border border-[var(--line)]" style={{ gridTemplateColumns: "80px repeat(5, 1fr)" }}>
            {/* Header row */}
            <div className="bg-[var(--ivory)] px-2 py-2.5 flex items-center justify-center">
              <span className="text-[9.5px] font-bold uppercase tracking-[0.07em] text-[var(--ink-4)]">{t("timetable.timeHeader")}</span>
            </div>
            {JOURS_KEYS.map((key, i) => (
              <div key={key} className="bg-[var(--ivory)] px-2 py-2.5 flex items-center justify-center">
                <span className="text-[10px] font-bold uppercase tracking-[0.06em] text-[var(--ink-4)]">{t(`timetable.days.${key}`)}</span>
              </div>
            ))}

            {/* Time slots */}
            {HEURES.slice(0, -1).map(h => (
              <>
                <div key={`time-${h}`} className="bg-white flex items-center justify-center px-2 min-h-[72px]">
                  <span className="font-mono text-[11px] text-[var(--ink-4)] font-semibold">{h}</span>
                </div>
                {JOURS_VALUES.map((jour, i) => {
                  const slots = getSlot(jour, h);
                  return (
                    <div key={`${jour}-${h}`} className="bg-white p-1.5 min-h-[72px]">
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
        <span className="text-[11px] font-bold text-[var(--ink-4)] uppercase tracking-widest">{t("timetable.legend")}</span>
        {Object.entries(TYPE_COLORS).map(([type, cls]) => (
          <div key={type} className={cn("flex items-center gap-1.5 px-2.5 py-1 rounded-[6px] text-[11px] font-bold border", cls)}>
            {type}
          </div>
        ))}
      </div>

      {/* List view */}
      <Card className="mt-5">
        <CardHeader>
          <CardTitle>{t("timetable.scheduledCourses")}</CardTitle>
        </CardHeader>
        <CardContent>
          <DataTable
            columns={columns}
            data={filteredEDT}
            searchKey="jour"
            searchPlaceholder={t("timetable.searchPlaceholder")}
            filterFields={[
              { columnId: "jour", title: t("timetable.filterDay"), options: JOURS_VALUES.map((v, i) => ({ label: t(`timetable.days.${JOURS_KEYS[i]}`), value: v })) },
              { columnId: "classe", title: t("timetable.filterClass"), options: [
                { label: "L1-INFO-A", value: "L1-INFO-A" },
                { label: "L1-INFO-B", value: "L1-INFO-B" },
                { label: "L2-INFO-B", value: "L2-INFO-B" },
                { label: "L1-GESTION-A", value: "L1-GESTION-A" },
                { label: "L2-GESTION-B", value: "L2-GESTION-B" },
                { label: "L3-DROIT-A", value: "L3-DROIT-A" },
                { label: "M1-INFO-A", value: "M1-INFO-A" },
              ]},
              { columnId: "type", title: t("timetable.filterType"), options: [
                { label: "CM", value: "CM" },
                { label: "TD", value: "TD" },
                { label: "TP", value: "TP" },
              ]},
            ]}
            pagination
            pageSize={10}
          />
        </CardContent>
      </Card>
    </div>
  );
}
