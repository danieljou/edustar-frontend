"use client";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, Legend } from "recharts";
import { CHART_DATA } from "@/constants/mock-data";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { useState } from "react";
import { cn } from "@/lib/utils";

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white border border-[var(--line-dark)] rounded-[10px] shadow-md p-3 text-[12px]">
        <p className="font-bold text-[var(--ink)] mb-1.5">{label}</p>
        {payload.map((entry: any) => (
          <p key={entry.dataKey} style={{ color: entry.color }} className="font-medium">
            {entry.name}: {entry.value}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

export function AnalyticsChart() {
  const [view, setView] = useState<"inscrits" | "paiements">("inscrits");

  return (
    <Card>
      <CardHeader>
        <CardTitle>Activité — Session 2025–2026</CardTitle>
        <div className="flex items-center gap-1">
          {(["inscrits", "paiements"] as const).map(v => (
            <button
              key={v}
              onClick={() => setView(v)}
              className={cn(
                "px-2.5 py-1 rounded-[5px] text-[11px] font-semibold transition-colors",
                view === v
                  ? "bg-[var(--blue-light)] text-[var(--blue)]"
                  : "text-[var(--ink-4)] hover:bg-[var(--ivory)]"
              )}
            >
              {v === "inscrits" ? "Effectifs" : "Paiements"}
            </button>
          ))}
        </div>
      </CardHeader>
      <CardContent className="pt-4">
        <ResponsiveContainer width="100%" height={200}>
          {view === "inscrits" ? (
            <BarChart data={CHART_DATA} barSize={22}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--line)" vertical={false} />
              <XAxis dataKey="mois" tick={{ fontSize: 11, fill: "var(--ink-4)" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: "var(--ink-4)" }} axisLine={false} tickLine={false} domain={[350, 410]} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="inscrits" name="Étudiants" fill="#1a3c8f" radius={[4, 4, 0, 0]} />
              <Bar dataKey="admissions" name="Admissions" fill="#0099cc" radius={[4, 4, 0, 0]} />
            </BarChart>
          ) : (
            <LineChart data={CHART_DATA}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--line)" vertical={false} />
              <XAxis dataKey="mois" tick={{ fontSize: 11, fill: "var(--ink-4)" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: "var(--ink-4)" }} axisLine={false} tickLine={false} tickFormatter={v => `${(v / 1e6).toFixed(0)}M`} />
              <Tooltip content={<CustomTooltip />} />
              <Line type="monotone" dataKey="paiements" name="FCFA" stroke="#1a3c8f" strokeWidth={2.5} dot={{ fill: "#1a3c8f", r: 4 }} activeDot={{ r: 6 }} />
            </LineChart>
          )}
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
