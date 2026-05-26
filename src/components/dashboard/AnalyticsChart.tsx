"use client";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
} from "recharts";
import { CHART_DATA } from "@/constants/mock-data";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { useState } from "react";
import { cn } from "@/lib/utils";

const VIEWS = [
  { key: "inscrits", label: "Effectifs" },
  { key: "paiements", label: "Paiements" },
  { key: "reussite", label: "Réussite" },
  { key: "presences", label: "Présences" },
] as const;

type View = (typeof VIEWS)[number]["key"];

const REUSSITE_DATA = [
  { classe: "M1-INFO", excellent: 8, bien: 9, passable: 3, rattrapage: 2 },
  { classe: "L3-DROIT", excellent: 4, bien: 8, passable: 7, rattrapage: 2 },
  { classe: "L1-INFO-A", excellent: 5, bien: 12, passable: 18, rattrapage: 8 },
  { classe: "L2-INFO-B", excellent: 3, bien: 8, passable: 15, rattrapage: 5 },
  { classe: "L1-GEST", excellent: 2, bien: 10, passable: 22, rattrapage: 8 },
  { classe: "L2-GEST", excellent: 3, bien: 9, passable: 16, rattrapage: 5 },
];

const PRESENCE_DATA = [
  { classe: "L1-INFO", pct: 92 },
  { classe: "L2-INFO", pct: 91 },
  { classe: "L1-GESTION", pct: 93 },
  { classe: "L2-GESTION", pct: 94 },
  { classe: "L3-DROIT", pct: 95 },
  { classe: "M1-INFO", pct: 97 },
];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white border border-[var(--line-dark)] rounded-[10px] shadow-md p-3 text-[12px]">
        <p className="font-bold text-[var(--ink)] mb-1.5">{label}</p>
        {payload.map((entry: any) => (
          <p key={entry.dataKey} style={{ color: entry.color ?? entry.stroke }} className="font-medium">
            {entry.name}:{" "}
            {typeof entry.value === "number"
              ? entry.value.toLocaleString("fr-FR")
              : entry.value}
            {entry.dataKey === "pct" ? "%" : ""}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

const VIEW_DESC: Record<View, string> = {
  inscrits: "Inscrits & admissions / mois",
  paiements: "Revenus mensuels en FCFA",
  reussite: "Répartition des mentions par classe",
  presences: "Taux de présence par classe",
};

export function AnalyticsChart() {
  const [view, setView] = useState<View>("inscrits");

  return (
    <Card>
      <CardHeader className="flex-wrap gap-y-2">
        <div>
          <CardTitle>Activité — Session 2025–2026</CardTitle>
          <p className="text-[10.5px] text-[var(--ink-4)] mt-0.5">{VIEW_DESC[view]}</p>
        </div>
        <div className="flex items-center gap-0.5 shrink-0 flex-wrap">
          {VIEWS.map((v) => (
            <button
              key={v.key}
              onClick={() => setView(v.key)}
              className={cn(
                "px-2.5 py-1 rounded-[6px] text-[11px] font-semibold transition-colors",
                view === v.key
                  ? "bg-[var(--blue-light)] text-[var(--blue)]"
                  : "text-[var(--ink-4)] hover:bg-[var(--ivory)]"
              )}
            >
              {v.label}
            </button>
          ))}
        </div>
      </CardHeader>

      <CardContent className="pt-4 px-2 sm:px-6">
        <ResponsiveContainer width="100%" height={230}>
          {view === "inscrits" ? (
            <BarChart data={CHART_DATA} barSize={16} barGap={3}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--line)" vertical={false} />
              <XAxis
                dataKey="mois"
                tick={{ fontSize: 10, fill: "var(--ink-4)" }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fontSize: 10, fill: "var(--ink-4)" }}
                axisLine={false}
                tickLine={false}
                domain={[350, 410]}
                width={32}
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="inscrits" name="Étudiants" fill="#1a3c8f" radius={[4, 4, 0, 0]} />
              <Bar dataKey="admissions" name="Admissions" fill="#0099cc" radius={[4, 4, 0, 0]} />
            </BarChart>
          ) : view === "paiements" ? (
            <AreaChart data={CHART_DATA}>
              <defs>
                <linearGradient id="payGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#1a3c8f" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#1a3c8f" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--line)" vertical={false} />
              <XAxis
                dataKey="mois"
                tick={{ fontSize: 10, fill: "var(--ink-4)" }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fontSize: 10, fill: "var(--ink-4)" }}
                axisLine={false}
                tickLine={false}
                tickFormatter={(v) => `${(v / 1e6).toFixed(0)}M`}
                width={36}
              />
              <Tooltip content={<CustomTooltip />} />
              <Area
                type="monotone"
                dataKey="paiements"
                name="FCFA"
                stroke="#1a3c8f"
                strokeWidth={2.5}
                fill="url(#payGrad)"
                dot={{ fill: "#1a3c8f", r: 4 }}
                activeDot={{ r: 6 }}
              />
            </AreaChart>
          ) : view === "reussite" ? (
            <BarChart data={REUSSITE_DATA} barSize={14}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--line)" vertical={false} />
              <XAxis
                dataKey="classe"
                tick={{ fontSize: 9.5, fill: "var(--ink-4)" }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fontSize: 10, fill: "var(--ink-4)" }}
                axisLine={false}
                tickLine={false}
                width={28}
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="excellent" name="Excellent (≥15)" stackId="s" fill="#10b981" radius={[0, 0, 0, 0]} />
              <Bar dataKey="bien" name="Bien (12–14)" stackId="s" fill="#0099cc" radius={[0, 0, 0, 0]} />
              <Bar dataKey="passable" name="Passable (10–11)" stackId="s" fill="#f59e0b" radius={[0, 0, 0, 0]} />
              <Bar dataKey="rattrapage" name="Rattrapage (<10)" stackId="s" fill="#ef4444" radius={[4, 4, 0, 0]} />
            </BarChart>
          ) : (
            <BarChart data={PRESENCE_DATA} barSize={22}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--line)" vertical={false} />
              <XAxis
                dataKey="classe"
                tick={{ fontSize: 9, fill: "var(--ink-4)" }}
                axisLine={false}
                tickLine={false}
                angle={-20}
                textAnchor="end"
                height={36}
                interval={0}
              />
              <YAxis
                tick={{ fontSize: 10, fill: "var(--ink-4)" }}
                axisLine={false}
                tickLine={false}
                tickFormatter={(v) => `${v}%`}
                domain={[80, 100]}
                width={36}
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="pct" name="Taux présence" fill="#0099cc" radius={[4, 4, 0, 0]} />
            </BarChart>
          )}
        </ResponsiveContainer>

        {/* Legend for stacked chart */}
        {view === "reussite" && (
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 mt-3 pt-3 border-t border-[var(--line)]">
            {[
              { color: "#10b981", label: "Excellent ≥15" },
              { color: "#0099cc", label: "Bien 12–14" },
              { color: "#f59e0b", label: "Passable 10–11" },
              { color: "#ef4444", label: "Rattrapage <10" },
            ].map(({ color, label }) => (
              <div key={label} className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded-[3px] shrink-0" style={{ background: color }} />
                <span className="text-[10.5px] text-[var(--ink-4)]">{label}</span>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
