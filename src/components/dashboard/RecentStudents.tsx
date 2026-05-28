"use client";
import Link from "next/link";
import { useTranslation } from "react-i18next";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { EduAvatar } from "@/components/shared/EduAvatar";
import { EduBadge, statusBadge } from "@/components/shared/EduBadge";
import { STUDENTS } from "@/constants/mock-data";
import { formatCurrency } from "@/lib/utils";
import { ArrowRight } from "lucide-react";

export function RecentStudents() {
  const { t } = useTranslation("dashboard");
  const recent = STUDENTS.slice(0, 6);

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("recentStudents.title")}</CardTitle>
        <Link
          href="/dashboard/students"
          className="flex items-center gap-1 text-[12px] text-[var(--blue)] font-semibold hover:underline shrink-0"
        >
          {t("recentStudents.viewAll")} <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </CardHeader>
      <div className="overflow-x-auto">
        <table className="w-full text-[12.5px]">
          <thead>
            <tr className="bg-[var(--ivory)]">
              {/* Code — masqué sous sm */}
              <th className="hidden sm:table-cell px-[14px] py-[9px] text-left text-[9.5px] font-bold uppercase tracking-[0.07em] text-[var(--ink-4)] border-b border-[var(--line)] whitespace-nowrap">
                {t("recentStudents.columns.code")}
              </th>
              <th className="px-[14px] py-[9px] text-left text-[9.5px] font-bold uppercase tracking-[0.07em] text-[var(--ink-4)] border-b border-[var(--line)] whitespace-nowrap">
                {t("recentStudents.columns.student")}
              </th>
              {/* Classe — masqué sous md */}
              <th className="hidden md:table-cell px-[14px] py-[9px] text-left text-[9.5px] font-bold uppercase tracking-[0.07em] text-[var(--ink-4)] border-b border-[var(--line)] whitespace-nowrap">
                {t("recentStudents.columns.class")}
              </th>
              <th className="px-[14px] py-[9px] text-left text-[9.5px] font-bold uppercase tracking-[0.07em] text-[var(--ink-4)] border-b border-[var(--line)] whitespace-nowrap">
                {t("recentStudents.columns.avg")}
              </th>
              {/* Solde — masqué sous sm */}
              <th className="hidden sm:table-cell px-[14px] py-[9px] text-left text-[9.5px] font-bold uppercase tracking-[0.07em] text-[var(--ink-4)] border-b border-[var(--line)] whitespace-nowrap">
                {t("recentStudents.columns.balance")}
              </th>
              <th className="px-[14px] py-[9px] text-left text-[9.5px] font-bold uppercase tracking-[0.07em] text-[var(--ink-4)] border-b border-[var(--line)] whitespace-nowrap">
                {t("recentStudents.columns.status")}
              </th>
            </tr>
          </thead>
          <tbody>
            {recent.map(s => (
              <tr key={s.code} className="border-b border-[var(--line)] last:border-0 hover:bg-[var(--blue-lighter)] transition-colors cursor-pointer">
                <td className="hidden sm:table-cell px-[14px] py-[10px]">
                  <span className="font-mono text-[11px] text-[var(--blue)] font-semibold">{s.code}</span>
                </td>
                <td className="px-[14px] py-[10px]">
                  <div className="flex items-center gap-2">
                    <EduAvatar name={`${s.prenom} ${s.nom}`} size={28} />
                    <div className="min-w-0">
                      <div className="font-semibold text-[var(--ink)] truncate">{s.prenom} {s.nom}</div>
                      <div className="text-[10.5px] text-[var(--ink-4)]">
                        {s.sexe === "F" ? t("recentStudents.feminine") : t("recentStudents.masculine")}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="hidden md:table-cell px-[14px] py-[10px]">
                  <div className="font-semibold text-[var(--ink)] text-[11px]">{s.classe}</div>
                  <div className="text-[10px] text-[var(--ink-4)]">{s.filiere}</div>
                </td>
                <td className="px-[14px] py-[10px]">
                  <EduBadge variant={s.moy >= 14 ? "green" : s.moy >= 10 ? "amber" : "red"}>
                    {s.moy}/20
                  </EduBadge>
                </td>
                <td className="hidden sm:table-cell px-[14px] py-[10px]">
                  {s.solde > 0 ? (
                    <span className="text-[var(--danger)] font-bold text-[12px]">{formatCurrency(s.solde)}</span>
                  ) : (
                    <EduBadge variant="green">{t("recentStudents.settled")}</EduBadge>
                  )}
                </td>
                <td className="px-[14px] py-[10px]">
                  <EduBadge variant={statusBadge(s.statut)}>{s.statut}</EduBadge>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}
