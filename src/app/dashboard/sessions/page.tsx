"use client";
import { useState } from "react";
import { Plus, CalendarRange, Users, Check } from "lucide-react";
import { PageHeader } from "@/components/shared/PageHeader";
import { EduBadge, statusBadge } from "@/components/shared/EduBadge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { SESSIONS, CLASSES } from "@/constants/mock-data";
import { formatDate } from "@/lib/utils";

export default function SessionsPage() {
  const activeSession = SESSIONS.find(s => s.statut === "Active");

  return (
    <div>
      <PageHeader
        title="Sessions scolaires"
        subtitle={`${SESSIONS.length} sessions · Session active : ${activeSession?.lib || "Aucune"}`}
        actions={<Button size="sm"><Plus className="w-3.5 h-3.5" /> Nouvelle session</Button>}
      />

      {/* Sessions timeline */}
      <div className="space-y-4 mb-6">
        {SESSIONS.map(s => (
          <Card key={s.id} className={`overflow-hidden transition-all ${s.statut === "Active" ? "border-[var(--blue)] shadow-md" : ""}`}>
            <div className="flex items-stretch">
              <div className={`w-[4px] shrink-0 ${s.statut === "Active" ? "bg-gradient-to-b from-[var(--blue)] to-[var(--cyan)]" : "bg-[var(--line)]"}`} />
              <div className="flex-1 p-4">
                <div className="flex items-start justify-between gap-4 flex-wrap">
                  <div>
                    <div className="flex items-center gap-2.5 mb-1">
                      <CalendarRange className="w-4 h-4 text-[var(--blue)]" />
                      <span className="font-serif text-[18px] text-[var(--ink)]">{s.lib}</span>
                      <EduBadge variant={statusBadge(s.statut)}>{s.statut}</EduBadge>
                      {s.statut === "Active" && (
                        <span className="flex items-center gap-1 text-[10.5px] text-[var(--success)] font-bold">
                          <span className="w-1.5 h-1.5 rounded-full bg-[var(--success)]" />
                          En cours
                        </span>
                      )}
                    </div>
                    <div className="text-[12px] text-[var(--ink-4)]">
                      {formatDate(s.debut)} → {formatDate(s.fin)}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="w-3.5 h-3.5 text-[var(--ink-4)]" />
                    <span className="text-[13px] font-bold text-[var(--ink)]">{s.effectif}</span>
                    <span className="text-[11px] text-[var(--ink-4)]">étudiants inscrits</span>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Classes section */}
      <div className="mb-2">
        <h2 className="font-serif text-[16px] text-[var(--ink)] mb-4">Classes — Session active</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3.5">
          {CLASSES.map(c => (
            <Card key={c.id} className="p-4 hover:border-[var(--blue)] cursor-pointer transition-colors">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <div className="font-mono text-[12.5px] font-bold text-[var(--blue)]">{c.code}</div>
                  <div className="text-[11px] text-[var(--ink-4)]">{c.filiere} · {c.niveau}</div>
                </div>
                <EduBadge variant="blue">{c.effectif} étu.</EduBadge>
              </div>
              <div className="space-y-1.5 text-[12px]">
                {[
                  { label: "Salle", value: c.salle },
                  { label: "Responsable", value: c.responsable },
                  { label: "Délégué", value: c.delegue },
                ].map(({ label, value }) => (
                  <div key={label} className="flex justify-between">
                    <span className="text-[var(--ink-4)]">{label}</span>
                    <span className="font-medium text-[var(--ink)]">{value}</span>
                  </div>
                ))}
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
