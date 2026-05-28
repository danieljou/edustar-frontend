"use client";
import { useTranslation } from "react-i18next";
import { Bell, AlertTriangle, CheckCircle, CreditCard, GraduationCap, FileText } from "lucide-react";
import { PageHeader } from "@/components/shared/PageHeader";
import { EduBadge } from "@/components/shared/EduBadge";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ACTIVITY_FEED } from "@/constants/mock-data";

const EXTRA_NOTIFS = [
  { id: 7,  text: "Réunion du conseil pédagogique — Jeudi 29 Mai 2026 à 14h00", time: "Hier",         color: "bg-[var(--purple)]",  type: "info"    },
  { id: 8,  text: "5 dossiers d'admission non traités depuis plus de 7 jours",  time: "Il y a 2 jours", color: "bg-[var(--warning)]", type: "warning" },
  { id: 9,  text: "Résultats L1-INFO-A publiés avec succès — 48 notes",         time: "Il y a 3 jours", color: "bg-[var(--success)]", type: "success" },
  { id: 10, text: "Mise à jour système disponible — Version 2.4.1",             time: "Il y a 1 semaine", color: "bg-[var(--cyan)]",  type: "info"    },
];

const ALL_NOTIFS = [...ACTIVITY_FEED, ...EXTRA_NOTIFS];

export default function NotificationsPage() {
  const { t } = useTranslation("systeme");

  return (
    <div>
      <PageHeader
        title={t("notifications.pageTitle")}
        subtitle={t("notifications.notifCount", { count: ALL_NOTIFS.length, unread: 7 })}
        actions={<Button variant="outline" size="sm">{t("notifications.markAllReadBtn")}</Button>}
      />

      <div className="space-y-2 max-w-2xl">
        {ALL_NOTIFS.map((n, i) => (
          <Card key={n.id} className={`p-4 cursor-pointer hover:border-[var(--blue)] transition-colors ${i < 7 ? "border-[var(--blue-light)] bg-[var(--blue-lighter)]" : ""}`}>
            <div className="flex items-start gap-3">
              <div className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${n.color}`} />
              <div className="flex-1">
                <p className="text-[13px] font-medium text-[var(--ink)] leading-snug">{n.text}</p>
                <p className="text-[11px] text-[var(--ink-4)] mt-1">{n.time}</p>
              </div>
              {i < 7 && <EduBadge variant="blue" className="shrink-0">{t("notifications.newBadge")}</EduBadge>}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
