import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { PAYMENTS, MORATORIUMS } from "@/constants/mock-data";
import { formatCurrency } from "@/lib/utils";
import { AlertCircle, Clock, Flame } from "lucide-react";
import { cn } from "@/lib/utils";

const MODE_STYLES: Record<string, { bar: string; badge: string }> = {
  "Mobile Money": { bar: "bg-amber-500", badge: "bg-amber-50 text-amber-700" },
  Virement: { bar: "bg-[var(--blue)]", badge: "bg-[var(--blue-light)] text-[var(--blue)]" },
  Espèces: { bar: "bg-emerald-500", badge: "bg-emerald-50 text-emerald-700" },
  Chèque: { bar: "bg-purple-500", badge: "bg-purple-50 text-purple-700" },
};

const MORAT_STATUS = [
  {
    statut: "En cours",
    icon: <Clock className="w-3.5 h-3.5" />,
    color: "text-[var(--cyan)]",
    bg: "bg-cyan-50",
  },
  {
    statut: "En retard",
    icon: <AlertCircle className="w-3.5 h-3.5" />,
    color: "text-[var(--warning)]",
    bg: "bg-amber-50",
  },
  {
    statut: "Critique",
    icon: <Flame className="w-3.5 h-3.5" />,
    color: "text-[var(--danger)]",
    bg: "bg-red-50",
  },
];

export function FinancialSummary() {
  const validatedPayments = PAYMENTS.filter((p) => p.statut === "Validé");
  const pendingPayments = PAYMENTS.filter((p) => p.statut === "En attente");

  const totalCollected = validatedPayments.reduce((s, p) => s + p.montant, 0);
  const totalPending = pendingPayments.reduce((s, p) => s + p.montant, 0);

  const byMode = validatedPayments.reduce(
    (acc, p) => {
      acc[p.mode] = (acc[p.mode] || 0) + p.montant;
      return acc;
    },
    {} as Record<string, number>
  );

  const modes = Object.entries(byMode)
    .sort(([, a], [, b]) => b - a)
    .map(([mode, amount]) => ({
      mode,
      amount,
      pct: Math.round((amount / totalCollected) * 100),
    }));

  const totalMoratDebt = MORATORIUMS.reduce(
    (s, m) => s + (m.montantTotal - m.montantPaye),
    0
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle>Synthèse financière</CardTitle>
        <span className="text-[10.5px] text-[var(--ink-4)]">Session 2025–2026</span>
      </CardHeader>

      <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {/* Left: modes de paiement */}
        <div className="space-y-3">
          <div className="flex items-end justify-between">
            <p className="text-[9.5px] font-bold uppercase tracking-[0.08em] text-[var(--ink-4)]">
              Modes de paiement
            </p>
            <div className="text-right">
              <p className="text-[11px] font-bold text-[var(--ink)]">
                {formatCurrency(totalCollected)}
              </p>
              {totalPending > 0 && (
                <p className="text-[9.5px] text-[var(--warning)]">
                  +{formatCurrency(totalPending)} en attente
                </p>
              )}
            </div>
          </div>

          <div className="space-y-2.5">
            {modes.map(({ mode, amount, pct }) => {
              const style = MODE_STYLES[mode] ?? {
                bar: "bg-gray-400",
                badge: "bg-gray-50 text-gray-600",
              };
              return (
                <div key={mode} className="space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-[12px] font-medium text-[var(--ink)]">{mode}</span>
                    <div className="flex items-center gap-1.5">
                      <span className="text-[10.5px] text-[var(--ink-4)]">
                        {formatCurrency(amount)}
                      </span>
                      <span
                        className={cn(
                          "text-[10px] font-bold px-1.5 py-0.5 rounded-[4px]",
                          style.badge
                        )}
                      >
                        {pct}%
                      </span>
                    </div>
                  </div>
                  <div className="h-1.5 bg-[var(--line)] rounded-full overflow-hidden">
                    <div
                      className={cn("h-full rounded-full", style.bar)}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: moratoriums */}
        <div className="space-y-3">
          <p className="text-[9.5px] font-bold uppercase tracking-[0.08em] text-[var(--ink-4)]">
            Moratoriums de paiement
          </p>

          <div className="space-y-1.5">
            {MORAT_STATUS.map(({ statut, icon, color, bg }) => {
              const count = MORATORIUMS.filter((m) => m.statut === statut).length;
              const amount = MORATORIUMS.filter((m) => m.statut === statut).reduce(
                (s, m) => s + (m.montantTotal - m.montantPaye),
                0
              );
              return (
                <div
                  key={statut}
                  className={cn(
                    "flex items-center justify-between rounded-[9px] px-3 py-2.5",
                    bg
                  )}
                >
                  <div className={cn("flex items-center gap-2 text-[12px] font-semibold", color)}>
                    {icon}
                    <span>{statut}</span>
                  </div>
                  <div className="text-right">
                    <p className="text-[13px] font-bold text-[var(--ink)]">{count}</p>
                    {amount > 0 && (
                      <p className={cn("text-[9.5px] font-medium", color)}>
                        {formatCurrency(amount)}
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="rounded-[10px] border border-[var(--line)] px-3.5 py-3 bg-[var(--ivory)] mt-1">
            <p className="text-[9.5px] font-bold uppercase tracking-[0.08em] text-[var(--ink-4)] mb-1">
              Total restant à recouvrer
            </p>
            <p className="font-serif text-[22px] leading-none text-[var(--ink)] tracking-[-0.02em]">
              {formatCurrency(totalMoratDebt)}
            </p>
            <p className="text-[10px] text-[var(--ink-4)] mt-1">
              sur {MORATORIUMS.length} moratoriums actifs
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
