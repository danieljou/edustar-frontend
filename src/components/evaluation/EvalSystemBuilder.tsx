"use client";
import { useState, useMemo } from "react";
import {
  Plus, Trash2, GripVertical, AlertTriangle,
  CheckCircle, ChevronDown, ChevronUp,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { EduBadge } from "@/components/shared/EduBadge";
import { validateTypesEvaluation, pourcentageColor } from "@/lib/calcul-engine";
import type { TypeEvaluation, Periode } from "@/types/evaluation";

// ─── Percentage bar ───────────────────────────────────────────────────────────

function PercentageBar({ types }: { types: TypeEvaluation[] }) {
  const actifs = types.filter(t => t.statut === "ACTIF");
  const total = actifs.reduce((acc, t) => acc + t.pourcentage, 0);
  const valid = Math.abs(total - 100) < 0.01;
  const color = pourcentageColor(total);

  const COLORS = [
    "var(--blue)", "var(--cyan)", "var(--purple)",
    "var(--success)", "var(--warning)", "var(--danger)",
  ];

  return (
    <div className="space-y-2">
      {/* Stacked bar */}
      <div className="h-6 rounded-[6px] overflow-hidden flex bg-[var(--line)]">
        {actifs.map((t, i) => (
          <div
            key={t.id}
            title={`${t.nom} — ${t.pourcentage}%`}
            style={{
              width: `${Math.min(t.pourcentage, 100)}%`,
              backgroundColor: COLORS[i % COLORS.length],
            }}
            className="transition-all duration-300 flex items-center justify-center overflow-hidden"
          >
            {t.pourcentage >= 10 && (
              <span className="text-[9px] font-bold text-white truncate px-1">
                {t.abrev} {t.pourcentage}%
              </span>
            )}
          </div>
        ))}
      </div>

      {/* Total indicator */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          {valid
            ? <CheckCircle className="w-3.5 h-3.5 text-[var(--success)]" />
            : <AlertTriangle className="w-3.5 h-3.5 text-[var(--warning)]" />
          }
          <span className="text-[11px] font-medium" style={{ color }}>
            {total.toFixed(1)}% alloués
          </span>
          <span className="text-[11px] text-[var(--ink-4)]">
            ({valid ? "✓ Valide" : `${(100 - total).toFixed(1)}% restants`})
          </span>
        </div>
        <span className="text-[10px] text-[var(--ink-4)]">Total requis : 100%</span>
      </div>
    </div>
  );
}

// ─── Row d'un type d'évaluation ───────────────────────────────────────────────

interface TypeEvalRowProps {
  te: TypeEvaluation;
  index: number;
  onChange: (patch: Partial<TypeEvaluation>) => void;
  onRemove: () => void;
  canRemove: boolean;
}

function TypeEvalRow({ te, onChange, onRemove, canRemove }: TypeEvalRowProps) {
  const COLORS = [
    "var(--blue)", "var(--cyan)", "var(--purple)",
    "var(--success)", "var(--warning)",
  ];

  return (
    <div className={`
      group flex items-center gap-3 p-3 rounded-[10px] border transition-all
      ${te.statut === "ACTIF"
        ? "border-[var(--line)] bg-white hover:border-[var(--blue)] hover:shadow-[0_1px_4px_rgba(26,60,143,0.08)]"
        : "border-[var(--line)] bg-[var(--ivory)] opacity-60"}
    `}>
      {/* Drag handle */}
      <GripVertical className="w-4 h-4 text-[var(--ink-4)] cursor-grab shrink-0" />

      {/* Color dot */}
      <div
        className="w-3 h-3 rounded-full shrink-0"
        style={{ backgroundColor: COLORS[(te.ordre - 1) % COLORS.length] }}
      />

      {/* Nom */}
      <Input
        value={te.nom}
        onChange={e => onChange({ nom: e.target.value })}
        placeholder="Nom de l'évaluation"
        className="h-7 text-[12px] flex-1 min-w-0"
      />

      {/* Abrév */}
      <Input
        value={te.abrev}
        onChange={e => onChange({ abrev: e.target.value.toUpperCase() })}
        placeholder="Abrév."
        className="h-7 text-[12px] w-16 text-center font-mono"
        maxLength={6}
      />

      {/* Pourcentage avec slider */}
      <div className="flex items-center gap-2 shrink-0">
        <input
          type="range"
          min={0}
          max={100}
          step={5}
          value={te.pourcentage}
          onChange={e => onChange({ pourcentage: parseFloat(e.target.value) })}
          className="w-20 accent-[var(--blue)] cursor-pointer"
        />
        <div className="relative">
          <Input
            type="number"
            min={0}
            max={100}
            step={1}
            value={te.pourcentage}
            onChange={e => onChange({ pourcentage: parseFloat(e.target.value) || 0 })}
            className="h-7 text-[12px] w-16 text-center pr-5"
          />
          <span className="absolute right-2 top-1/2 -translate-y-1/2 text-[10px] text-[var(--ink-4)] pointer-events-none">
            %
          </span>
        </div>
      </div>

      {/* Note sur */}
      <div className="flex items-center gap-1 shrink-0">
        <span className="text-[11px] text-[var(--ink-4)]">/</span>
        <Input
          type="number"
          min={1}
          max={100}
          value={te.noteSur}
          onChange={e => onChange({ noteSur: parseFloat(e.target.value) || 20 })}
          className="h-7 text-[12px] w-14 text-center"
        />
      </div>

      {/* Obligatoire toggle */}
      <button
        onClick={() => onChange({ obligatoire: !te.obligatoire })}
        className="shrink-0"
      >
        <EduBadge variant={te.obligatoire ? "blue" : "neutral"}>
          {te.obligatoire ? "Obligatoire" : "Optionnel"}
        </EduBadge>
      </button>

      {/* Actif toggle */}
      <button
        onClick={() => onChange({ statut: te.statut === "ACTIF" ? "INACTIF" : "ACTIF" })}
        className="shrink-0"
      >
        <EduBadge variant={te.statut === "ACTIF" ? "green" : "neutral"}>
          {te.statut === "ACTIF" ? "Actif" : "Inactif"}
        </EduBadge>
      </button>

      {/* Remove */}
      {canRemove && (
        <button
          onClick={onRemove}
          className="shrink-0 w-7 h-7 flex items-center justify-center rounded-[6px] text-[var(--ink-4)] hover:bg-[var(--danger-light)] hover:text-[var(--danger)] transition-colors opacity-0 group-hover:opacity-100"
        >
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      )}
    </div>
  );
}

// ─── Panel pour une période ───────────────────────────────────────────────────

interface PeriodePanelProps {
  periode: Periode;
  types: TypeEvaluation[];
  onAddType: () => void;
  onUpdateType: (id: string, patch: Partial<TypeEvaluation>) => void;
  onRemoveType: (id: string) => void;
}

function PeriodePanel({
  periode,
  types,
  onAddType,
  onUpdateType,
  onRemoveType,
}: PeriodePanelProps) {
  const [open, setOpen] = useState(!periode.estAgregat);

  const validation = useMemo(
    () => validateTypesEvaluation(types.filter(t => !t.matiereId)),
    [types],
  );

  const periodeTypes = types
    .filter(t => t.periodeId === periode.id)
    .sort((a, b) => a.ordre - b.ordre);

  if (periode.estAgregat) {
    return (
      <div className="border border-dashed border-[var(--line-dark)] rounded-[12px] p-4 bg-[var(--ivory)]">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-[var(--cyan)]" />
          <p className="text-[12px] font-semibold text-[var(--ink)]">{periode.nom}</p>
          <EduBadge variant="cyan">Agrégat</EduBadge>
          <p className="text-[11px] text-[var(--ink-4)] ml-2">
            Moyenne automatique des sous-périodes
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={`border rounded-[12px] overflow-hidden transition-all ${
      open ? "border-[var(--blue)] shadow-[0_0_0_2px_rgba(26,60,143,0.06)]" : "border-[var(--line)]"
    }`}>
      {/* Header */}
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center gap-3 px-4 py-3 bg-white hover:bg-[var(--ivory)] transition-colors text-left"
      >
        <div className="flex items-center gap-2 flex-1">
          <div className={`w-2 h-2 rounded-full ${
            periode.statut === "EN_COURS" ? "bg-[var(--success)]" :
            periode.statut === "CLOTUREE" ? "bg-[var(--ink-4)]" :
            "bg-[var(--warning)]"
          }`} />
          <p className="text-[13px] font-semibold text-[var(--ink)]">{periode.nom}</p>
          <EduBadge variant={
            periode.statut === "EN_COURS" ? "green" :
            periode.statut === "CLOTUREE" ? "neutral" : "amber"
          }>
            {periode.statut === "EN_COURS" ? "En cours" : periode.statut === "CLOTUREE" ? "Clôturée" : "À venir"}
          </EduBadge>
        </div>

        <div className="flex items-center gap-2">
          {periodeTypes.length > 0 && (
            <span className="text-[11px] text-[var(--ink-4)]">
              {periodeTypes.length} éval.
            </span>
          )}
          <div style={{ color: pourcentageColor(
            periodeTypes.filter(t => t.statut === "ACTIF").reduce((a, t) => a + t.pourcentage, 0)
          )}}>
            <span className="text-[11px] font-medium">
              {periodeTypes.filter(t => t.statut === "ACTIF").reduce((a, t) => a + t.pourcentage, 0)}%
            </span>
          </div>
          {open ? <ChevronUp className="w-4 h-4 text-[var(--ink-4)]" /> : <ChevronDown className="w-4 h-4 text-[var(--ink-4)]" />}
        </div>
      </button>

      {open && (
        <div className="px-4 pb-4 pt-2 border-t border-[var(--line)] bg-white space-y-3">
          {/* Percentage bar */}
          {periodeTypes.length > 0 && (
            <PercentageBar types={periodeTypes} />
          )}

          {/* Validation errors */}
          {!validation.valid && periodeTypes.length > 0 && (
            <div className="flex items-start gap-2 p-2.5 rounded-[8px] bg-[var(--warning-light)] border border-[rgba(180,83,9,0.2)]">
              <AlertTriangle className="w-3.5 h-3.5 text-[var(--warning)] shrink-0 mt-[1px]" />
              <div>
                {validation.erreurs.map((e, i) => (
                  <p key={i} className="text-[11px] text-[var(--warning)]">{e}</p>
                ))}
              </div>
            </div>
          )}

          {/* Types d'évaluation */}
          <div className="space-y-2">
            {periodeTypes.map((te, i) => (
              <TypeEvalRow
                key={te.id}
                te={te}
                index={i}
                onChange={patch => onUpdateType(te.id, patch)}
                onRemove={() => onRemoveType(te.id)}
                canRemove={periodeTypes.length > 1}
              />
            ))}
          </div>

          {periodeTypes.length === 0 && (
            <p className="text-center text-[12px] text-[var(--ink-4)] py-4">
              Aucun type d&apos;évaluation configuré pour cette période.
            </p>
          )}

          <Button
            variant="outline"
            size="sm"
            onClick={onAddType}
            className="w-full border-dashed text-[12px] h-8"
          >
            <Plus className="w-3.5 h-3.5 mr-1.5" />
            Ajouter un type d&apos;évaluation
          </Button>
        </div>
      )}
    </div>
  );
}

// ─── Export principal ─────────────────────────────────────────────────────────

interface EvalSystemBuilderProps {
  systemeId: string;
  periodes: Periode[];
  typesEval: TypeEvaluation[];
  onAddType: (periodeId: string) => void;
  onUpdateType: (id: string, patch: Partial<TypeEvaluation>) => void;
  onRemoveType: (id: string) => void;
}

export function EvalSystemBuilder({
  periodes,
  typesEval,
  onAddType,
  onUpdateType,
  onRemoveType,
}: EvalSystemBuilderProps) {
  const sorted = [...periodes].sort((a, b) => a.ordre - b.ordre);

  return (
    <div className="space-y-3">
      {/* Legend */}
      <div className="flex items-center gap-4 text-[11px] text-[var(--ink-4)] px-1">
        <span className="flex items-center gap-1"><GripVertical className="w-3 h-3" /> Réordonner</span>
        <span>Nom · Abréviation · Pourcentage · Note sur · Statut</span>
      </div>

      {/* Périodes avec leurs évaluations */}
      {sorted.map(p => (
        <PeriodePanel
          key={p.id}
          periode={p}
          types={typesEval.filter(t => t.periodeId === p.id)}
          onAddType={() => onAddType(p.id)}
          onUpdateType={onUpdateType}
          onRemoveType={onRemoveType}
        />
      ))}
    </div>
  );
}
