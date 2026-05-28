"use client";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Plus, CalendarRange, Users, AlertTriangle, Lock } from "lucide-react";
import { PageHeader } from "@/components/shared/PageHeader";
import { EduBadge, statusBadge } from "@/components/shared/EduBadge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogBody, DialogFooter } from "@/components/ui/dialog";
import { CLASSES } from "@/constants/mock-data";
import { formatDate } from "@/lib/utils";
import { useToast } from "@/components/ui/toast";
import type { Session } from "@/types";

const INITIAL_SESSIONS: Session[] = [
  { id: "ses-1", lib: "2023–2024", debut: "2023-09-04", fin: "2024-07-05", statut: "Clôturée", effectif: 342 },
  { id: "ses-2", lib: "2024–2025", debut: "2024-09-02", fin: "2025-07-04", statut: "Clôturée", effectif: 378 },
  { id: "ses-3", lib: "2025–2026", debut: "2025-09-01", fin: "2026-07-03", statut: "Active", effectif: 391 },
];

export default function SessionsPage() {
  const { t } = useTranslation("academique");
  const { t: tc } = useTranslation("common");
  const toast = useToast();
  const [sessions, setSessions] = useState<Session[]>(INITIAL_SESSIONS);
  const [showForm, setShowForm] = useState(false);
  const [showCloseConfirm, setShowCloseConfirm] = useState<Session | null>(null);
  const [form, setForm] = useState({ lib: "", debut: "", fin: "" });

  const activeSession = sessions.find(s => s.statut === "Active");

  const handleCreate = () => {
    if (!form.lib || !form.debut || !form.fin) {
      toast("Tous les champs sont obligatoires.", "error");
      return;
    }
    if (new Date(form.fin) <= new Date(form.debut)) {
      toast("La date de fin doit être postérieure à la date de début.", "error");
      return;
    }
    const newSession: Session = {
      id: `ses-${Date.now()}`,
      lib: form.lib,
      debut: form.debut,
      fin: form.fin,
      statut: "À venir",
      effectif: 0,
    };
    setSessions(prev => [...prev, newSession]);
    setForm({ lib: "", debut: "", fin: "" });
    setShowForm(false);
    toast(`Session ${form.lib} créée avec succès !`, "success");
  };

  const handleActivate = (id: string) => {
    if (activeSession) {
      toast("Une session est déjà active. Clôturez-la d'abord avant d'en activer une autre.", "warning");
      return;
    }
    setSessions(prev => prev.map(s => s.id === id ? { ...s, statut: "Active" as const } : s));
    toast("Session activée !", "success");
  };

  const handleClose = (session: Session) => {
    setShowCloseConfirm(session);
  };

  const confirmClose = () => {
    if (!showCloseConfirm) return;
    setSessions(prev => prev.map(s => s.id === showCloseConfirm.id ? { ...s, statut: "Clôturée" as const } : s));
    setShowCloseConfirm(null);
    toast("Session clôturée et archivée. Cette action est irréversible.", "info");
  };

  return (
    <div>
      <PageHeader
        title={t("sessions.pageTitle")}
        subtitle={`${sessions.length} sessions · ${t("sessions.currentSession")} : ${activeSession?.lib || tc("misc.none")}`}
        actions={
          <Button size="sm" onClick={() => setShowForm(true)}>
            <Plus className="w-3.5 h-3.5" /> {t("sessions.newSession")}
          </Button>
        }
      />

      {/* Sessions timeline */}
      <div className="space-y-4 mb-6">
        {sessions.map(s => (
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
                          <span className="w-1.5 h-1.5 rounded-full bg-[var(--success)] animate-pulse" />
                          En cours
                        </span>
                      )}
                    </div>
                    <div className="text-[12px] text-[var(--ink-4)]">
                      {formatDate(s.debut)} → {formatDate(s.fin)}
                    </div>
                  </div>

                  <div className="flex items-center gap-3 flex-wrap">
                    <div className="flex items-center gap-1.5">
                      <Users className="w-3.5 h-3.5 text-[var(--ink-4)]" />
                      <span className="text-[13px] font-bold text-[var(--ink)]">{s.effectif}</span>
                      <span className="text-[11px] text-[var(--ink-4)]">{t("sessions.columns.studentsCount")}</span>
                    </div>

                    {s.statut === "À venir" && (
                      <Button size="sm" variant="outline" onClick={() => handleActivate(s.id)}>
                        Activer
                      </Button>
                    )}
                    {s.statut === "Active" && (
                      <Button size="sm" variant="danger" onClick={() => handleClose(s)}>
                        <Lock className="w-3.5 h-3.5" /> Clôturer
                      </Button>
                    )}
                    {s.statut === "Clôturée" && (
                      <span className="flex items-center gap-1 text-[11px] text-[var(--ink-4)]">
                        <Lock className="w-3.5 h-3.5" /> Archivée
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Classes section */}
      <div className="mb-2">
        <h2 className="font-serif text-[16px] text-[var(--ink)] mb-4">{t("classes.pageTitle")} — {t("sessions.currentSession")}</h2>
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

      {/* Create session dialog */}
      <Dialog open={showForm} onOpenChange={setShowForm}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t("sessions.newSession")}</DialogTitle>
          </DialogHeader>
          <DialogBody>
            <div className="space-y-4">
              <div>
                <Label htmlFor="lib">{t("sessions.columns.name")} *</Label>
                <Input
                  id="lib"
                  placeholder="ex : 2026–2027"
                  value={form.lib}
                  onChange={e => setForm(prev => ({ ...prev, lib: e.target.value }))}
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label htmlFor="debut">{t("sessions.columns.startDate")} *</Label>
                  <Input
                    id="debut"
                    type="date"
                    value={form.debut}
                    onChange={e => setForm(prev => ({ ...prev, debut: e.target.value }))}
                  />
                </div>
                <div>
                  <Label htmlFor="fin">{t("sessions.columns.endDate")} *</Label>
                  <Input
                    id="fin"
                    type="date"
                    value={form.fin}
                    onChange={e => setForm(prev => ({ ...prev, fin: e.target.value }))}
                  />
                </div>
              </div>
              <div className="flex items-start gap-2 p-3 bg-[var(--blue-lighter)] border border-[var(--blue-light)] rounded-[8px] text-[11.5px] text-[var(--ink-2)]">
                <AlertTriangle className="w-3.5 h-3.5 text-[var(--blue)] shrink-0 mt-0.5" />
                La session sera créée avec le statut <strong>"À venir"</strong>. Une seule session peut être active à la fois (règle RG-SES-001).
              </div>
            </div>
          </DialogBody>
          <DialogFooter>
            <Button variant="outline" size="sm" onClick={() => setShowForm(false)}>{tc("actions.cancel")}</Button>
            <Button size="sm" onClick={handleCreate}>
              <Plus className="w-3.5 h-3.5" /> {tc("actions.create")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Close confirmation dialog */}
      <Dialog open={!!showCloseConfirm} onOpenChange={() => setShowCloseConfirm(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Clôturer la session</DialogTitle>
          </DialogHeader>
          <DialogBody>
            <div className="flex items-start gap-3 p-4 bg-[var(--danger-light)] border border-[rgba(192,57,43,0.2)] rounded-[10px]">
              <AlertTriangle className="w-5 h-5 text-[var(--danger)] shrink-0 mt-0.5" />
              <div>
                <div className="font-semibold text-[13px] text-[var(--danger)] mb-1">Action irréversible</div>
                <p className="text-[12.5px] text-[var(--ink-2)]">
                  La clôture de la session <strong>{showCloseConfirm?.lib}</strong> est définitive. Toutes les données académiques seront archivées dans un snapshot historique (règle RG-SES-002).
                </p>
              </div>
            </div>
          </DialogBody>
          <DialogFooter>
            <Button variant="outline" size="sm" onClick={() => setShowCloseConfirm(null)}>{tc("actions.cancel")}</Button>
            <Button variant="danger" size="sm" onClick={confirmClose}>
              <Lock className="w-3.5 h-3.5" /> {tc("actions.confirm")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
