"use client";
import Link from "next/link";
import { useTranslation } from "react-i18next";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { GraduationCap, ClipboardList, CreditCard, FileText, UserCheck, Users } from "lucide-react";

export function QuickActions() {
  const { t } = useTranslation("dashboard");

  const ACTIONS = [
    { labelKey: "quickActions.newStudent", icon: GraduationCap, href: "/dashboard/students", color: "bg-[var(--blue-light)] text-[var(--blue)]" },
    { labelKey: "quickActions.newAdmission", icon: ClipboardList, href: "/dashboard/admissions", color: "bg-[var(--warning-light)] text-[var(--warning)]" },
    { labelKey: "quickActions.recordPaymentShort", icon: CreditCard, href: "/dashboard/payments", color: "bg-[var(--success-light)] text-[var(--success)]" },
    { labelKey: "quickActions.enterGrades", icon: FileText, href: "/dashboard/exams", color: "bg-purple-50 text-[var(--purple)]" },
    { labelKey: "quickActions.attendance", icon: UserCheck, href: "/dashboard/attendance", color: "bg-[var(--cyan-light)] text-[var(--cyan)]" },
    { labelKey: "quickActions.newHR", icon: Users, href: "/dashboard/hr", color: "bg-[var(--blue-light)] text-[var(--blue)]" },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("sections.quickActions")}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {ACTIONS.map((a) => (
            <Link
              key={a.labelKey}
              href={a.href}
              className="flex items-center gap-2.5 p-2.5 rounded-[10px] border border-[var(--line)] hover:border-[var(--blue)] hover:bg-[var(--blue-lighter)] transition-all group"
            >
              <div className={`w-8 h-8 rounded-[8px] flex items-center justify-center shrink-0 ${a.color}`}>
                <a.icon className="w-3.5 h-3.5" />
              </div>
              <span className="text-[12px] font-semibold text-[var(--ink)] group-hover:text-[var(--blue)] transition-colors leading-tight">
                {t(a.labelKey)}
              </span>
            </Link>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
