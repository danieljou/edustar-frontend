"use client";
import { useState } from "react";
import { Bus, Users, AlertTriangle, Wrench, CheckCircle2, Plus } from "lucide-react";
import { PageHeader } from "@/components/shared/PageHeader";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { DataTable } from "@/components/data-table";
import { transportColumns } from "@/components/data-table/columns/transport-columns";
import { BUS_LIST } from "@/constants/mock-data";

const STATUT_ICON: Record<string, React.ReactNode> = {
  "En service": <CheckCircle2 className="w-3.5 h-3.5" />,
  "En panne": <AlertTriangle className="w-3.5 h-3.5" />,
  "En maintenance": <Wrench className="w-3.5 h-3.5" />,
};

const STATUT_COLOR: Record<string, string> = {
  "En service": "var(--success)",
  "En panne": "var(--danger)",
  "En maintenance": "var(--warning)",
};

const STATUT_BG: Record<string, string> = {
  "En service": "var(--success-light)",
  "En panne": "var(--danger-light)",
  "En maintenance": "var(--warning-light)",
};

const STATUT_VARIANT: Record<string, "green" | "red" | "amber"> = {
  "En service": "green",
  "En panne": "red",
  "En maintenance": "amber",
};

export default function TransportPage() {
  const [view, setView] = useState<"cards" | "table">("cards");

  const enService = BUS_LIST.filter(b => b.statut === "En service").length;
  const enPanne = BUS_LIST.filter(b => b.statut === "En panne").length;
  const enMaintenance = BUS_LIST.filter(b => b.statut === "En maintenance").length;
  const totalPassagers = BUS_LIST.filter(b => b.statut === "En service").reduce((s, b) => s + b.passagers, 0);

  return (
    <div>
      <PageHeader
        title="Transport Scolaire"
        subtitle={`${BUS_LIST.length} bus · ${enService} en service`}
        actions={
          <div className="flex gap-2">
            <div className="flex rounded-[8px] overflow-hidden border border-[var(--line)]">
              <button onClick={() => setView("cards")} className={`px-3 py-1.5 text-[11px] font-medium transition-colors ${view === "cards" ? "bg-[var(--blue)] text-white" : "bg-white text-[var(--ink-4)] hover:bg-[var(--ivory)]"}`}>Cartes</button>
              <button onClick={() => setView("table")} className={`px-3 py-1.5 text-[11px] font-medium transition-colors ${view === "table" ? "bg-[var(--blue)] text-white" : "bg-white text-[var(--ink-4)] hover:bg-[var(--ivory)]"}`}>Tableau</button>
            </div>
            <Button size="sm">Ajouter un bus</Button>
          </div>
        }
      />

      {/* KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5 mb-5">
        {[
          { label: "En service", value: enService, color: "var(--success)", icon: <CheckCircle2 className="w-4 h-4" /> },
          { label: "En panne", value: enPanne, color: "var(--danger)", icon: <AlertTriangle className="w-4 h-4" /> },
          { label: "En maintenance", value: enMaintenance, color: "var(--warning)", icon: <Wrench className="w-4 h-4" /> },
          { label: "Passagers aujourd'hui", value: totalPassagers, color: "var(--blue)", icon: <Users className="w-4 h-4" /> },
        ].map(k => (
          <div key={k.label} className="bg-white border border-[var(--line)] rounded-[14px] p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-[10px] flex items-center justify-center shrink-0" style={{ background: `${k.color}18`, color: k.color }}>
              {k.icon}
            </div>
            <div>
              <div className="text-[10px] font-bold uppercase tracking-widest text-[var(--ink-4)]">{k.label}</div>
              <div className="font-serif text-[22px]" style={{ color: k.color }}>{k.value}</div>
            </div>
          </div>
        ))}
      </div>

      {view === "cards" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3.5">
          {BUS_LIST.map(bus => (
            <Card key={bus.id} className={`overflow-hidden transition-all hover:shadow-sm ${bus.statut !== "En service" ? "opacity-80" : ""}`}>
              <div className="h-1" style={{ background: STATUT_COLOR[bus.statut] }} />
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2.5">
                    <div className="w-10 h-10 rounded-[10px] flex items-center justify-center shrink-0" style={{ background: `${STATUT_COLOR[bus.statut]}18`, color: STATUT_COLOR[bus.statut] }}>
                      <Bus className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="font-bold text-[13px] text-[var(--ink)]">Bus {bus.numero}</div>
                      <div className="text-[10px] font-mono text-[var(--ink-4)]">{bus.immatriculation}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 text-[10.5px] font-semibold px-2 py-1 rounded-[6px]" style={{ background: STATUT_BG[bus.statut], color: STATUT_COLOR[bus.statut] }}>
                    {STATUT_ICON[bus.statut]}
                    {bus.statut}
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-start gap-2">
                    <MapPin className="w-3.5 h-3.5 text-[var(--ink-4)] mt-0.5 shrink-0" />
                    <span className="text-[11.5px] text-[var(--ink-3)]">{bus.itineraire}</span>
                  </div>

                  <div className="grid grid-cols-3 gap-2 pt-2 border-t border-[var(--line)]">
                    <div className="text-center">
                      <div className="text-[10px] text-[var(--ink-4)]">Chauffeur</div>
                      <div className="text-[11px] font-medium text-[var(--ink)] truncate">{bus.chauffeur.split(" ")[0]}</div>
                    </div>
                    <div className="text-center">
                      <div className="text-[10px] text-[var(--ink-4)]">Départ</div>
                      <div className="text-[12px] font-bold font-mono text-[var(--blue)]">{bus.depart}</div>
                    </div>
                    <div className="text-center">
                      <div className="text-[10px] text-[var(--ink-4)]">Capacité</div>
                      <div className="text-[11px] font-medium text-[var(--ink)]">
                        {bus.statut === "En service" ? <><span className="font-bold text-[var(--ink)]">{bus.passagers}</span>/{bus.capacite}</> : `—/${bus.capacite}`}
                      </div>
                    </div>
                  </div>

                  {bus.statut === "En service" && (
                    <div className="pt-1">
                      <div className="flex justify-between text-[10px] text-[var(--ink-4)] mb-1">
                        <span>Occupation</span>
                        <span>{Math.round((bus.passagers / bus.capacite) * 100)}%</span>
                      </div>
                      <div className="h-1.5 bg-[var(--line)] rounded-full overflow-hidden">
                        <div className="h-full rounded-full progress-gradient transition-all" style={{ width: `${(bus.passagers / bus.capacite) * 100}%` }} />
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <DataTable
            columns={transportColumns}
            data={BUS_LIST}
            searchKey="numero"
            searchPlaceholder="Rechercher un bus…"
            pagination
            pageSize={10}
          />
        </Card>
      )}
    </div>
  );
}
