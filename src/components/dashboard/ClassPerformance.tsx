import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import { cn } from "@/lib/utils";

const CLASS_STATS = [
  { code: "M1-INFO-A", filiere: "Informatique", avg: 16.4, delta: +0.8, students: 22 },
  { code: "L3-DROIT-A", filiere: "Droit", avg: 15.1, delta: +0.3, students: 35 },
  { code: "L1-INFO-A", filiere: "Informatique", avg: 14.5, delta: -0.2, students: 48 },
  { code: "L2-INFO-B", filiere: "Informatique", avg: 13.1, delta: +0.5, students: 38 },
  { code: "L1-GESTION-A", filiere: "Gestion", avg: 12.8, delta: -0.4, students: 52 },
  { code: "L2-GESTION-B", filiere: "Gestion", avg: 11.5, delta: +0.1, students: 40 },
  { code: "L1-INFO-B", filiere: "Informatique", avg: 11.2, delta: -0.1, students: 45 },
];

const FILIERE_BAR: Record<string, string> = {
  Informatique: "bg-[var(--blue)]",
  Gestion: "bg-[var(--cyan)]",
  Droit: "bg-[var(--purple)]",
};

const FILIERE_BADGE: Record<string, string> = {
  Informatique: "bg-[var(--blue-light)] text-[var(--blue)]",
  Gestion: "bg-cyan-50 text-cyan-700",
  Droit: "bg-purple-50 text-purple-700",
};

export function ClassPerformance() {
  const maxAvg = 20;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Performance par classe</CardTitle>
        <span className="text-[10.5px] text-[var(--ink-4)]">Moy. générale / 20 — S1 2025–2026</span>
      </CardHeader>

      <CardContent className="space-y-2.5 pt-1">
        {CLASS_STATS.map((cls, i) => {
          const barPct = (cls.avg / maxAvg) * 100;
          const barClass = FILIERE_BAR[cls.filiere] ?? "bg-[var(--blue)]";
          const badgeClass = FILIERE_BADGE[cls.filiere] ?? "bg-[var(--blue-light)] text-[var(--blue)]";
          const isWeak = cls.avg < 12;

          return (
            <div key={cls.code} className="group">
              <div className="flex items-center gap-2 mb-1">
                {/* Rank */}
                <span className="text-[10px] font-bold text-[var(--ink-4)] w-4 shrink-0 text-center">
                  {i + 1}
                </span>

                {/* Class code + filière badge */}
                <div className="flex items-center gap-1.5 flex-1 min-w-0">
                  <span className="text-[12px] font-semibold text-[var(--ink)] truncate">
                    {cls.code}
                  </span>
                  <span
                    className={cn(
                      "hidden sm:inline-block text-[9.5px] font-bold px-1.5 py-0.5 rounded-[4px] shrink-0",
                      badgeClass
                    )}
                  >
                    {cls.filiere}
                  </span>
                  <span className="text-[10px] text-[var(--ink-4)] shrink-0 ml-auto sm:ml-0">
                    {cls.students} étu.
                  </span>
                </div>

                {/* Delta trend */}
                <div className="flex items-center gap-1 shrink-0">
                  {cls.delta > 0 ? (
                    <TrendingUp className="w-3 h-3 text-[var(--success)]" />
                  ) : cls.delta < 0 ? (
                    <TrendingDown className="w-3 h-3 text-[var(--danger)]" />
                  ) : (
                    <Minus className="w-3 h-3 text-[var(--ink-4)]" />
                  )}
                  <span
                    className={cn(
                      "text-[10px] font-semibold",
                      cls.delta > 0
                        ? "text-[var(--success)]"
                        : cls.delta < 0
                        ? "text-[var(--danger)]"
                        : "text-[var(--ink-4)]"
                    )}
                  >
                    {cls.delta > 0 ? "+" : ""}
                    {cls.delta.toFixed(1)}
                  </span>
                </div>

                {/* Average */}
                <span
                  className={cn(
                    "text-[13px] font-bold w-9 text-right shrink-0",
                    isWeak ? "text-[var(--warning)]" : "text-[var(--ink)]"
                  )}
                >
                  {cls.avg.toFixed(1)}
                </span>
              </div>

              {/* Progress bar */}
              <div className="ml-6 h-1.5 bg-[var(--line)] rounded-full overflow-hidden">
                <div
                  className={cn("h-full rounded-full transition-all duration-500", barClass)}
                  style={{ width: `${barPct}%`, opacity: isWeak ? 0.7 : 1 }}
                />
              </div>
            </div>
          );
        })}

        {/* Legend */}
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 pt-3 mt-1 border-t border-[var(--line)]">
          {Object.entries(FILIERE_BADGE).map(([filiere, cls]) => (
            <div key={filiere} className="flex items-center gap-1.5">
              <div className={cn("w-2 h-2 rounded-full", FILIERE_BAR[filiere])} />
              <span className="text-[10.5px] text-[var(--ink-4)]">{filiere}</span>
            </div>
          ))}
          <span className="text-[9.5px] text-[var(--ink-4)] ml-auto hidden sm:block">
            ↑↓ vs semestre précédent
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
