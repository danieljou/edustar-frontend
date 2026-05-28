"use client";
import { useState } from "react";
import { Plus, Megaphone, AlertTriangle, Info, Bell, Filter } from "lucide-react";
import { useTranslation } from "react-i18next";
import { PageHeader } from "@/components/shared/PageHeader";
import { EduBadge } from "@/components/shared/EduBadge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ANNONCES } from "@/constants/mock-data";

const PRIORITE_ICON: Record<string, React.ReactNode> = {
  Urgente: <AlertTriangle className="w-3.5 h-3.5" />,
  Normale: <Bell className="w-3.5 h-3.5" />,
  Info: <Info className="w-3.5 h-3.5" />,
};

const PRIORITE_COLOR: Record<string, string> = {
  Urgente: "var(--danger)",
  Normale: "var(--blue)",
  Info: "var(--cyan)",
};

const PRIORITE_BG: Record<string, string> = {
  Urgente: "var(--danger-light)",
  Normale: "var(--blue-light)",
  Info: "var(--blue-lighter)",
};

const CIBLE_VARIANT: Record<string, "blue" | "green" | "purple" | "neutral"> = {
  Tous: "neutral",
  Étudiants: "blue",
  Enseignants: "green",
  Administratifs: "purple",
};

export default function AnnouncementsPage() {
  const { t } = useTranslation("communication");
  const [cible, setCible] = useState("all");
  const [priorite, setPriorite] = useState("all");

  const filtered = ANNONCES.filter(a => {
    const matchCible = cible === "all" || a.cible === cible;
    const matchPriorite = priorite === "all" || a.priorite === priorite;
    return matchCible && matchPriorite && a.statut === "Publiée";
  });

  const urgentes = ANNONCES.filter(a => a.priorite === "Urgente" && a.statut === "Publiée").length;
  const publishedCount = ANNONCES.filter(a => a.statut === "Publiée").length;

  const subtitle = publishedCount + " " + (publishedCount > 1 ? t("announcements.announcementCountPlural") : t("announcements.announcementCount")) + " " + t("announcements.publish").toLowerCase() + (urgentes > 0 ? ` · ${urgentes > 1 ? t("announcements.urgentCountPlural", { count: urgentes }) : t("announcements.urgentCount", { count: urgentes })}` : "");

  const CIBLE_LABELS: Record<string, string> = {
    Tous: t("announcements.audience.tous"),
    Étudiants: t("announcements.audience.etudiants"),
    Enseignants: t("announcements.audience.enseignants"),
    Administratifs: t("announcements.audience.administratifs"),
  };

  return (
    <div>
      <PageHeader
        title={t("announcements.pageTitle")}
        subtitle={subtitle}
        actions={<Button size="sm"><Plus className="w-3.5 h-3.5" /> {t("announcements.newAnnouncementBtn")}</Button>}
      />

      {/* Summary by cible */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5 mb-5">
        {["Tous", "Étudiants", "Enseignants", "Administratifs"].map(c => {
          const count = ANNONCES.filter(a => (c === "Tous" ? true : a.cible === c || a.cible === "Tous") && a.statut === "Publiée").length;
          return (
            <button
              key={c}
              onClick={() => setCible(c === "Tous" ? "all" : c)}
              className={`bg-white border rounded-[14px] p-4 text-left transition-all ${(cible === c || (cible === "all" && c === "Tous")) ? "border-[var(--blue)] shadow-sm" : "border-[var(--line)] hover:border-[var(--blue-mid)]"}`}
            >
              <div className="text-[10px] font-bold uppercase tracking-widest text-[var(--ink-4)] mb-1">{CIBLE_LABELS[c]}</div>
              <div className="font-serif text-[22px] text-[var(--blue)]">{count}</div>
              <div className="text-[10.5px] text-[var(--ink-4)]">{count > 1 ? t("announcements.announcementCountPlural") : t("announcements.announcementCount")}</div>
            </button>
          );
        })}
      </div>

      {/* Filters */}
      <div className="flex items-center gap-2.5 mb-4">
        <Filter className="w-3.5 h-3.5 text-[var(--ink-4)]" />
        <div className="w-44">
          <Select value={cible} onValueChange={setCible}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t("announcements.allTargets")}</SelectItem>
              <SelectItem value="Tous">{t("announcements.audience.tous")}</SelectItem>
              <SelectItem value="Étudiants">{t("announcements.audience.etudiants")}</SelectItem>
              <SelectItem value="Enseignants">{t("announcements.audience.enseignants")}</SelectItem>
              <SelectItem value="Administratifs">{t("announcements.audience.administratifs")}</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="w-44">
          <Select value={priorite} onValueChange={setPriorite}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t("announcements.allPriorities")}</SelectItem>
              <SelectItem value="Urgente">{t("announcements.priorities.urgent")}</SelectItem>
              <SelectItem value="Normale">{t("announcements.priorities.normal")}</SelectItem>
              <SelectItem value="Info">{t("announcements.priorities.info")}</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Annonces list */}
      <div className="space-y-3 max-w-3xl">
        {filtered.map(ann => (
          <Card key={ann.id} className={`overflow-hidden transition-all hover:shadow-sm ${ann.priorite === "Urgente" ? "border-[var(--danger)]/30" : ""}`}>
            <div className="h-[3px]" style={{ background: PRIORITE_COLOR[ann.priorite] }} />
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-[8px] flex items-center justify-center shrink-0 mt-0.5" style={{ background: PRIORITE_BG[ann.priorite], color: PRIORITE_COLOR[ann.priorite] }}>
                  {PRIORITE_ICON[ann.priorite]}
                </div>

                <div className="flex-1">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <h3 className="font-semibold text-[13px] text-[var(--ink)] leading-snug">{ann.titre}</h3>
                    <div className="flex items-center gap-1.5 shrink-0">
                      <span className="text-[10.5px] font-semibold px-2 py-0.5 rounded-full" style={{ background: PRIORITE_BG[ann.priorite], color: PRIORITE_COLOR[ann.priorite] }}>
                        {ann.priorite}
                      </span>
                      <EduBadge variant={CIBLE_VARIANT[ann.cible]}>{ann.cible}</EduBadge>
                    </div>
                  </div>

                  <p className="text-[12px] text-[var(--ink-3)] leading-relaxed mb-3">{ann.corps}</p>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-[10.5px] text-[var(--ink-4)]">
                      <Megaphone className="w-3 h-3" />
                      <span>{ann.auteur}</span>
                      <span>·</span>
                      <span>{new Date(ann.date).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" })}</span>
                    </div>
                    <div className="flex gap-1.5">
                      <Button variant="ghost" size="xs">{t("announcements.modify")}</Button>
                      <Button variant="ghost" size="xs" className="text-[var(--danger)]">{t("announcements.archive")}</Button>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}

        {filtered.length === 0 && (
          <div className="text-center py-16 text-[var(--ink-4)]">
            <Megaphone className="w-10 h-10 mx-auto mb-2 opacity-30" />
            <p className="text-[13px]">{t("announcements.noResults")}</p>
          </div>
        )}
      </div>
    </div>
  );
}
