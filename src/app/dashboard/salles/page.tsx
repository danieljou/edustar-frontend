"use client";
import { useState } from "react";
import { Search, DoorOpen, Users, Wrench, CheckCircle2, Monitor } from "lucide-react";
import { PageHeader } from "@/components/shared/PageHeader";
import { EduBadge } from "@/components/shared/EduBadge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { SALLES } from "@/constants/mock-data";

const STATUT_COLOR: Record<string, string> = {
  Disponible: "var(--success)",
  Occupée: "var(--blue)",
  Maintenance: "var(--warning)",
};

const STATUT_BG: Record<string, string> = {
  Disponible: "var(--success-light)",
  Occupée: "var(--blue-light)",
  Maintenance: "var(--warning-light)",
};

const STATUT_VARIANT: Record<string, "green" | "blue" | "amber"> = {
  Disponible: "green",
  Occupée: "blue",
  Maintenance: "amber",
};

const TYPE_ICON: Record<string, React.ReactNode> = {
  Amphi: <Users className="w-4 h-4" />,
  Salle: <DoorOpen className="w-4 h-4" />,
  Labo: <Monitor className="w-4 h-4" />,
  Bibliothèque: <DoorOpen className="w-4 h-4" />,
  Réunion: <Users className="w-4 h-4" />,
};

export default function SallesPage() {
  const [query, setQuery] = useState("");
  const [type, setType] = useState("all");
  const [statut, setStatut] = useState("all");

  const types = ["all", ...Array.from(new Set(SALLES.map(s => s.type)))];

  const filtered = SALLES.filter(s => {
    const matchType = type === "all" || s.type === type;
    const matchStatut = statut === "all" || s.statut === statut;
    const matchQuery = !query.trim() || s.lib.toLowerCase().includes(query.toLowerCase()) || s.code.toLowerCase().includes(query.toLowerCase());
    return matchType && matchStatut && matchQuery;
  });

  const disponibles = SALLES.filter(s => s.statut === "Disponible").length;
  const occupees = SALLES.filter(s => s.statut === "Occupée").length;
  const totalCapacite = SALLES.reduce((s, r) => s + r.capacite, 0);

  return (
    <div>
      <PageHeader
        title="Salles & Espaces"
        subtitle={`${SALLES.length} espaces · ${disponibles} disponibles`}
        actions={<Button size="sm"><DoorOpen className="w-3.5 h-3.5" /> Ajouter un espace</Button>}
      />

      {/* KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5 mb-5">
        {[
          { label: "Total espaces", value: SALLES.length, color: "var(--blue)", icon: <DoorOpen className="w-4 h-4" /> },
          { label: "Disponibles", value: disponibles, color: "var(--success)", icon: <CheckCircle2 className="w-4 h-4" /> },
          { label: "Occupées", value: occupees, color: "var(--cyan)", icon: <Users className="w-4 h-4" /> },
          { label: "Capacité totale", value: totalCapacite, color: "var(--purple)", icon: <Users className="w-4 h-4" /> },
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

      {/* Filters */}
      <div className="flex items-center gap-2.5 mb-4 flex-wrap">
        <div className="relative flex-1 max-w-xs">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[var(--ink-4)] pointer-events-none" />
          <Input placeholder="Rechercher une salle…" value={query} onChange={e => setQuery(e.target.value)} className="pl-8" />
        </div>
        <div className="w-36">
          <Select value={type} onValueChange={setType}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              {types.map(t => <SelectItem key={t} value={t}>{t === "all" ? "Tous types" : t}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
        <div className="w-36">
          <Select value={statut} onValueChange={setStatut}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tous statuts</SelectItem>
              <SelectItem value="Disponible">Disponible</SelectItem>
              <SelectItem value="Occupée">Occupée</SelectItem>
              <SelectItem value="Maintenance">Maintenance</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3.5">
        {filtered.map(salle => (
          <Card key={salle.code} className={`overflow-hidden transition-all hover:shadow-sm ${salle.statut === "Maintenance" ? "opacity-70" : ""}`}>
            <div className="h-1" style={{ background: STATUT_COLOR[salle.statut] }} />
            <CardContent className="p-4">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-10 h-10 rounded-[10px] flex items-center justify-center shrink-0" style={{ background: `${STATUT_COLOR[salle.statut]}18`, color: STATUT_COLOR[salle.statut] }}>
                    {TYPE_ICON[salle.type] ?? <DoorOpen className="w-4 h-4" />}
                  </div>
                  <div>
                    <div className="font-bold text-[13px] text-[var(--ink)]">{salle.lib}</div>
                    <div className="text-[10px] font-mono text-[var(--ink-4)]">{salle.code}</div>
                  </div>
                </div>
                <div className="flex items-center gap-1 text-[10.5px] font-semibold px-2 py-1 rounded-[6px]" style={{ background: STATUT_BG[salle.statut], color: STATUT_COLOR[salle.statut] }}>
                  {salle.statut === "Disponible" && <CheckCircle2 className="w-3 h-3" />}
                  {salle.statut === "Occupée" && <Users className="w-3 h-3" />}
                  {salle.statut === "Maintenance" && <Wrench className="w-3 h-3" />}
                  {salle.statut}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 mb-3">
                <div>
                  <div className="text-[9.5px] text-[var(--ink-4)] uppercase font-bold tracking-wide">Bâtiment</div>
                  <div className="text-[11.5px] text-[var(--ink-3)] mt-0.5">{salle.batiment}</div>
                </div>
                <div>
                  <div className="text-[9.5px] text-[var(--ink-4)] uppercase font-bold tracking-wide">Capacité</div>
                  <div className="flex items-center gap-1 mt-0.5">
                    <Users className="w-3 h-3 text-[var(--ink-4)]" />
                    <span className="text-[12px] font-bold text-[var(--ink)]">{salle.capacite} places</span>
                  </div>
                </div>
              </div>

              <div className="pt-2 border-t border-[var(--line)]">
                <div className="text-[9.5px] text-[var(--ink-4)] uppercase font-bold tracking-wide mb-1.5">Équipements</div>
                <div className="flex flex-wrap gap-1">
                  {salle.equipements.map(eq => (
                    <span key={eq} className="text-[10px] px-2 py-0.5 rounded-full bg-[var(--ivory)] border border-[var(--line)] text-[var(--ink-3)]">{eq}</span>
                  ))}
                </div>
              </div>

              <div className="flex gap-1.5 mt-3">
                <Button variant="outline" size="xs" className="flex-1">Détails</Button>
                {salle.statut === "Disponible" && (
                  <Button size="xs" className="flex-1">Réserver</Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
