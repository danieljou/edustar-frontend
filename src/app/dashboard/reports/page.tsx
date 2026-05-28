"use client";
import { useTranslation } from "react-i18next";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from "recharts";
import { PageHeader } from "@/components/shared/PageHeader";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { CHART_DATA, STUDENTS, CLASSES } from "@/constants/mock-data";
import { formatCurrency } from "@/lib/utils";

const FILIERE_DATA = [
  { name: "Informatique", value: 153, color: "#1a3c8f" },
  { name: "Gestion", value: 132, color: "#0099cc" },
  { name: "Droit", value: 70, color: "#6b48ff" },
  { name: "Lettres", value: 36, color: "#0a7c4e" },
];

export default function ReportsPage() {
  const { t } = useTranslation("systeme");

  return (
    <div>
      <PageHeader
        title={t("reports.pageTitle2")}
        subtitle={t("reports.pageSubtitle2")}
        actions={<Button variant="outline" size="sm"><Download className="w-3.5 h-3.5" /> {t("reports.exportPdf")}</Button>}
      />

      {/* Summary row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5 mb-5">
        {[
          { label: t("reports.totalEnrolled"), value: "391", trend: "+12%", color: "var(--blue)" },
          { label: t("reports.successRate"), value: "78%", trend: "+3%", color: "var(--success)" },
          { label: t("reports.totalRevenue"), value: "61.7M", trend: "+8%", color: "var(--cyan)" },
          { label: t("reports.attendanceRate"), value: "84%", trend: "-2%", color: "var(--warning)" },
        ].map(c => (
          <div key={c.label} className="bg-white border border-[var(--line)] rounded-[14px] p-4 text-center">
            <div className="text-[10px] font-bold uppercase tracking-widest text-[var(--ink-4)] mb-1">{c.label}</div>
            <div className="font-serif text-[26px]" style={{ color: c.color }}>{c.value}</div>
            <div className={`text-[11px] font-semibold mt-1 ${c.trend.startsWith("+") ? "text-[var(--success)]" : "text-[var(--danger)]"}`}>{c.trend} {t("reports.vsLastYear")}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Effectifs */}
        <Card>
          <CardHeader><CardTitle>{t("reports.effectifsTitle")}</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={CHART_DATA} barSize={20}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--line)" vertical={false} />
                <XAxis dataKey="mois" tick={{ fontSize: 11, fill: "var(--ink-4)" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: "var(--ink-4)" }} axisLine={false} tickLine={false} domain={[350, 410]} />
                <Tooltip />
                <Bar dataKey="inscrits" name={t("reports.types.students")} fill="#1a3c8f" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Répartition filieres */}
        <Card>
          <CardHeader><CardTitle>{t("reports.filiereTitle")}</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie data={FILIERE_DATA} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`} labelLine={true}>
                  {FILIERE_DATA.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [value, t("reports.types.students")]} />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Paiements */}
        <Card>
          <CardHeader><CardTitle>{t("reports.revenueTitle")}</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={CHART_DATA} barSize={20}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--line)" vertical={false} />
                <XAxis dataKey="mois" tick={{ fontSize: 11, fill: "var(--ink-4)" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: "var(--ink-4)" }} axisLine={false} tickLine={false} tickFormatter={v => `${(v / 1e6).toFixed(0)}M`} />
                <Tooltip formatter={(v: number) => [formatCurrency(v), t("reports.totalRevenue")]} />
                <Bar dataKey="paiements" name={t("reports.types.financial")} fill="#0099cc" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Top classes */}
        <Card>
          <CardHeader><CardTitle>{t("reports.performanceTitle")}</CardTitle></CardHeader>
          <CardContent className="p-0">
            {CLASSES.map(c => {
              const classStudents = STUDENTS.filter(s => s.classe === c.code);
              const avg = classStudents.length > 0
                ? classStudents.reduce((s, st) => s + st.moy, 0) / classStudents.length
                : 0;
              const pct = (avg / 20) * 100;
              return (
                <div key={c.id} className="flex items-center gap-3 px-[18px] py-3 border-b border-[var(--line)] last:border-0">
                  <div className="w-28 text-[11px] font-bold font-mono text-[var(--blue)]">{c.code}</div>
                  <div className="flex-1 h-2 bg-[var(--line)] rounded-full overflow-hidden">
                    <div className="h-full rounded-full progress-gradient transition-all duration-500" style={{ width: `${pct}%` }} />
                  </div>
                  <div className="w-12 text-right text-[12px] font-bold text-[var(--ink)]">{avg.toFixed(1)}/20</div>
                </div>
              );
            })}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
