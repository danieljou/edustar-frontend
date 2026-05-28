"use client";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Layers, Calendar, Settings2, Check, ChevronRight,
  Plus, AlertCircle, BookOpen, ArrowRight,
} from "lucide-react";
import { PageHeader } from "@/components/shared/PageHeader";
import { EduBadge } from "@/components/shared/EduBadge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { EvalSystemBuilder } from "@/components/evaluation/EvalSystemBuilder";
import { useEvaluationStore } from "@/stores/useEvaluationStore";
import { validateTypesEvaluation } from "@/lib/calcul-engine";
import { SYSTEM_TEMPLATES } from "@/constants/evaluation-mock";
import type { SystemeEvaluation, Periode, TypeEvaluation, EvalSystemType } from "@/types/evaluation";

const ICON_MAP: Record<string, React.ElementType> = { Layers, Calendar, Settings2 };

// ─── Step 1: Choisir le modèle ─────────────────────────────────────────────────

function StepChoisirModele({
  current,
  onChoose,
}: {
  current: EvalSystemType;
  onChoose: (t: EvalSystemType) => void;
}) {
  const { t } = useTranslation("evaluations");
  return (
    <div className="space-y-3">
      <p className="text-[12px] text-[var(--ink-4)] mb-4">
        {t("evalSystem.chooseModelHint")}
      </p>
      {SYSTEM_TEMPLATES.map(tpl => {
        const Icon = ICON_MAP[tpl.icon];
        const isActive = current === tpl.type;
        return (
          <button
            key={tpl.type}
            onClick={() => onChoose(tpl.type)}
            className={`
              w-full text-left p-4 rounded-[12px] border-2 transition-all
              ${isActive
                ? "border-[var(--blue)] bg-[var(--blue-lighter)] shadow-[0_0_0_3px_rgba(26,60,143,0.1)]"
                : "border-[var(--line)] bg-white hover:border-[var(--blue)] hover:bg-[var(--blue-lighter)]"
              }
            `}
          >
            <div className="flex items-start gap-4">
              <div
                className="w-10 h-10 rounded-[10px] flex items-center justify-center shrink-0"
                style={{ backgroundColor: `${tpl.couleur}20` }}
              >
                <Icon className="w-5 h-5" style={{ color: tpl.couleur }} />
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <p className="text-[14px] font-semibold text-[var(--ink)]">{tpl.label}</p>
                  {isActive && (
                    <div className="w-5 h-5 rounded-full bg-[var(--blue)] flex items-center justify-center">
                      <Check className="w-3 h-3 text-white" />
                    </div>
                  )}
                </div>
                <p className="text-[12px] text-[var(--ink-4)] mb-2">{tpl.description}</p>

                <div className="flex items-center gap-1 flex-wrap">
                  {tpl.exemple.map((ex, i) => (
                    <span key={i} className="flex items-center gap-1">
                      <span className="text-[10px] px-2 py-[2px] rounded-[4px] bg-white border border-[var(--line)] text-[var(--ink-3)] font-medium">
                        {ex}
                      </span>
                      {i < tpl.exemple.length - 1 && (
                        <ArrowRight className="w-3 h-3 text-[var(--ink-4)]" />
                      )}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </button>
        );
      })}
    </div>
  );
}

// ─── Step 2: Configurer les périodes ──────────────────────────────────────────

function StepConfigurerPeriodes({
  systemeId,
  periodes,
  onAdd,
  onUpdate,
  onRemove,
}: {
  systemeId: string;
  periodes: Periode[];
  onAdd: () => void;
  onUpdate: (id: string, patch: Partial<Periode>) => void;
  onRemove: (id: string) => void;
}) {
  const { t } = useTranslation("evaluations");
  const sorted = [...periodes].sort((a, b) => a.ordre - b.ordre);

  return (
    <div className="space-y-3">
      <p className="text-[12px] text-[var(--ink-4)] mb-4">
        {t("evalSystem.periodsHint")}
      </p>

      {sorted.map(p => (
        <div
          key={p.id}
          className="flex items-center gap-3 p-3 rounded-[10px] border border-[var(--line)] bg-white hover:border-[var(--blue)] transition-colors group"
        >
          <div className="flex items-center gap-2 shrink-0">
            <span className="text-[11px] w-6 text-center font-mono text-[var(--ink-4)]">{p.ordre}</span>
          </div>

          <Input
            value={p.nom}
            onChange={e => onUpdate(p.id, { nom: e.target.value })}
            className="h-8 text-[12px] flex-1"
            placeholder={t("evalSystem.periodNamePlaceholder")}
          />

          <Select
            value={p.type}
            onValueChange={v => onUpdate(p.id, { type: v as Periode["type"] })}
          >
            <SelectTrigger className="h-8 text-[11px] w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="SEQUENCE">{t("evalSystem.periodTypes.sequence")}</SelectItem>
              <SelectItem value="TRIMESTRE">{t("evalSystem.periodTypes.trimestre")}</SelectItem>
              <SelectItem value="SEMESTRE">{t("evalSystem.periodTypes.semestre")}</SelectItem>
              <SelectItem value="CUSTOM">{t("evalSystem.periodTypes.custom")}</SelectItem>
            </SelectContent>
          </Select>

          <Input
            type="date"
            value={p.dateDebut}
            onChange={e => onUpdate(p.id, { dateDebut: e.target.value })}
            className="h-8 text-[11px] w-36"
          />
          <span className="text-[11px] text-[var(--ink-4)] shrink-0">→</span>
          <Input
            type="date"
            value={p.dateFin}
            onChange={e => onUpdate(p.id, { dateFin: e.target.value })}
            className="h-8 text-[11px] w-36"
          />

          <button
            onClick={() => onUpdate(p.id, { estAgregat: !p.estAgregat })}
            className="shrink-0"
          >
            <EduBadge variant={p.estAgregat ? "cyan" : "neutral"}>
              {p.estAgregat ? t("evalSystem.aggregate") : t("evalSystem.simple")}
            </EduBadge>
          </button>

          {sorted.length > 1 && (
            <button
              onClick={() => onRemove(p.id)}
              className="shrink-0 text-[var(--ink-4)] hover:text-[var(--danger)] transition-colors opacity-0 group-hover:opacity-100"
            >
              ✕
            </button>
          )}
        </div>
      ))}

      <Button
        variant="outline"
        size="sm"
        onClick={onAdd}
        className="w-full border-dashed h-9 text-[12px]"
      >
        <Plus className="w-3.5 h-3.5 mr-1.5" /> {t("evalSystem.addPeriod")}
      </Button>

      <div className="flex items-start gap-2 p-3 rounded-[8px] bg-[var(--cyan-light)] border border-[rgba(0,153,204,0.2)]">
        <AlertCircle className="w-3.5 h-3.5 text-[var(--cyan)] shrink-0 mt-[1px]" />
        <p className="text-[11px] text-[var(--cyan)]">
          {t("evalSystem.aggregateHint")}
        </p>
      </div>
      <span className="hidden">{systemeId}</span>
    </div>
  );
}

// ─── Step 3: Configurer les évaluations ───────────────────────────────────────

function StepConfigurerEvaluations({
  systemeId,
  periodes,
  typesEval,
  onAddType,
  onUpdateType,
  onRemoveType,
}: {
  systemeId: string;
  periodes: Periode[];
  typesEval: TypeEvaluation[];
  onAddType: (periodeId: string) => void;
  onUpdateType: (id: string, patch: Partial<TypeEvaluation>) => void;
  onRemoveType: (id: string) => void;
}) {
  return (
    <EvalSystemBuilder
      systemeId={systemeId}
      periodes={periodes}
      typesEval={typesEval}
      onAddType={onAddType}
      onUpdateType={onUpdateType}
      onRemoveType={onRemoveType}
    />
  );
}

// ─── Step 4: Prévisualisation ──────────────────────────────────────────────────

function StepPreview({
  systeme,
  periodes,
  typesEval,
}: {
  systeme: SystemeEvaluation;
  periodes: Periode[];
  typesEval: TypeEvaluation[];
}) {
  const { t } = useTranslation("evaluations");
  const sorted = [...periodes].sort((a, b) => a.ordre - b.ordre);

  return (
    <div className="space-y-4">
      <div className="p-4 rounded-[12px] border border-[var(--line)] bg-[var(--ivory)]">
        <div className="flex items-center gap-3 mb-3">
          <BookOpen className="w-5 h-5 text-[var(--blue)]" />
          <div>
            <p className="text-[14px] font-semibold text-[var(--ink)]">{systeme.nom}</p>
            <p className="text-[11px] text-[var(--ink-4)]">{systeme.description}</p>
          </div>
          <EduBadge variant={systeme.actif ? "green" : "neutral"} className="ml-auto">
            {systeme.actif ? t("evalSystem.active") : t("evalSystem.inactive")}
          </EduBadge>
        </div>
      </div>

      <div className="space-y-2">
        {sorted.map(p => {
          const types = typesEval
            .filter(t => t.periodeId === p.id && t.statut === "ACTIF")
            .sort((a, b) => a.ordre - b.ordre);
          const validation = validateTypesEvaluation(types);

          return (
            <div
              key={p.id}
              className={`p-3 rounded-[10px] border ${
                p.estAgregat
                  ? "border-dashed border-[var(--cyan)] bg-[var(--cyan-light)]"
                  : "border-[var(--line)] bg-white"
              }`}
            >
              <div className="flex items-center gap-3 mb-2">
                <div className={`w-2 h-2 rounded-full ${
                  p.statut === "EN_COURS" ? "bg-[var(--success)] animate-pulse" :
                  p.statut === "CLOTUREE" ? "bg-[var(--ink-4)]" : "bg-[var(--warning)]"
                }`} />
                <p className="text-[12.5px] font-semibold text-[var(--ink)]">{p.nom}</p>
                {p.estAgregat && <EduBadge variant="cyan">{t("evalSystem.aggregate")}</EduBadge>}
                <span className="ml-auto text-[10px] text-[var(--ink-4)]">
                  {p.dateDebut} → {p.dateFin}
                </span>
              </div>

              {types.length > 0 && !p.estAgregat && (
                <div className="ml-5 space-y-1.5">
                  <div className="h-3 rounded-full overflow-hidden flex bg-[var(--line)]">
                    {types.map((t, i) => {
                      const COLORS = ["var(--blue)","var(--cyan)","var(--purple)","var(--success)","var(--warning)"];
                      return (
                        <div
                          key={t.id}
                          style={{ width: `${t.pourcentage}%`, backgroundColor: COLORS[i % COLORS.length] }}
                          className="transition-all"
                          title={`${t.nom} — ${t.pourcentage}%`}
                        />
                      );
                    })}
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {types.map(t => (
                      <div key={t.id} className="flex items-center gap-1.5">
                        <span className="text-[10px] px-2 py-[2px] rounded-[4px] bg-[var(--blue-light)] text-[var(--blue)] font-bold">
                          {t.abrev}
                        </span>
                        <span className="text-[10px] text-[var(--ink-4)]">
                          {t.pourcentage}% · /{t.noteSur}
                        </span>
                      </div>
                    ))}
                    {!validation.valid && (
                      <EduBadge variant="amber">
                        <AlertCircle className="w-2.5 h-2.5 mr-0.5" />
                        {validation.totalPourcentage.toFixed(0)}%
                      </EduBadge>
                    )}
                    {validation.valid && (
                      <EduBadge variant="green">
                        <Check className="w-2.5 h-2.5 mr-0.5" />
                        100%
                      </EduBadge>
                    )}
                  </div>
                </div>
              )}

              {p.estAgregat && (
                <p className="ml-5 text-[11px] text-[var(--cyan)]">
                  {t("evalSystem.calculatedFrom")} : {p.periodesFilles.join(", ")}
                </p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── Page principale ───────────────────────────────────────────────────────────

export default function EvaluationSystemPage() {
  const { t } = useTranslation("evaluations");
  const {
    systemes, periodes, typesEval,
    activeSystemeId,
    setActiveSysteme,
    addPeriode, updatePeriode, removePeriode,
    addTypeEval, updateTypeEval, removeTypeEval,
  } = useEvaluationStore();

  const STEPS = [
    { id: "modele", label: t("evalSystem.steps.model") },
    { id: "periodes", label: t("evalSystem.steps.periods") },
    { id: "evaluations", label: t("evalSystem.steps.evaluations") },
    { id: "apercu", label: t("evalSystem.steps.preview") },
  ];

  const [step, setStep] = useState("modele");
  const [draftType, setDraftType] = useState<EvalSystemType>("SEQUENCES_TRIMESTRES");
  const [newNom, setNewNom] = useState("");

  const systemeActif = systemes.find(s => s.id === activeSystemeId);
  const activePeriodes = periodes
    .filter(p => p.systemeId === activeSystemeId)
    .sort((a, b) => a.ordre - b.ordre);
  const activeTypes = typesEval.filter(t => t.systemeId === activeSystemeId);

  function uid() { return `ID-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`; }

  function handleAddPeriode() {
    if (!activeSystemeId) return;
    const ordre = activePeriodes.length + 1;
    addPeriode({
      id: uid(),
      systemeId: activeSystemeId,
      nom: `${t("evalSystem.periodDefaultName")} ${ordre}`,
      type: "CUSTOM",
      ordre,
      dateDebut: "2025-09-01",
      dateFin: "2026-07-10",
      estAgregat: false,
      periodesFilles: [],
      statut: "A_VENIR",
    });
  }

  function handleAddTypeEval(periodeId: string) {
    if (!activeSystemeId) return;
    const existingForPeriode = activeTypes.filter(t => t.periodeId === periodeId);
    const ordre = existingForPeriode.length + 1;
    addTypeEval({
      id: uid(),
      systemeId: activeSystemeId,
      periodeId,
      nom: `${t("evalSystem.evalDefaultName")} ${ordre}`,
      abrev: `EV${ordre}`,
      pourcentage: 0,
      coefficient: 1,
      noteSur: 20,
      ordre,
      obligatoire: true,
      statut: "ACTIF",
    });
  }

  const stepIndex = STEPS.findIndex(s => s.id === step);

  return (
    <div>
      <PageHeader
        title={t("evalSystem.pageTitle")}
        subtitle={t("evalSystem.pageSubtitle")}
        actions={
          <div className="flex items-center gap-2">
            {stepIndex < STEPS.length - 1 && (
              <Button size="sm" onClick={() => setStep(STEPS[stepIndex + 1].id)}>
                {t("actions.next", { ns: "common" })} <ChevronRight className="w-3.5 h-3.5 ml-1" />
              </Button>
            )}
            {stepIndex === STEPS.length - 1 && (
              <Button size="sm" variant="primary">
                <Check className="w-3.5 h-3.5 mr-1.5" /> {t("evalSystem.saveConfig")}
              </Button>
            )}
          </div>
        }
      />

      {/* ── Step indicator ── */}
      <div className="flex items-center gap-0 mb-6 bg-white border border-[var(--line)] rounded-[12px] overflow-hidden">
        {STEPS.map((s, i) => {
          const isActive = s.id === step;
          const isDone = i < stepIndex;
          return (
            <button
              key={s.id}
              onClick={() => setStep(s.id)}
              className={`
                flex-1 flex items-center justify-center gap-2 py-3 text-[12px] font-medium transition-colors
                ${isActive ? "bg-[var(--blue)] text-white" : isDone ? "bg-[var(--blue-lighter)] text-[var(--blue)]" : "text-[var(--ink-4)] hover:bg-[var(--ivory)]"}
                ${i > 0 ? "border-l border-[var(--line)]" : ""}
              `}
            >
              <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                isActive ? "bg-white text-[var(--blue)]" : isDone ? "bg-[var(--blue)] text-white" : "bg-[var(--line)] text-[var(--ink-4)]"
              }`}>
                {isDone ? <Check className="w-3 h-3" /> : i + 1}
              </div>
              {s.label}
            </button>
          );
        })}
      </div>

      <div className="grid grid-cols-[1fr_280px] gap-5 items-start">
        {/* ── Main content ── */}
        <Card className="border-[var(--line)] shadow-none">
          <CardContent className="p-5">
            {step === "modele" && (
              <StepChoisirModele
                current={draftType}
                onChoose={t => setDraftType(t)}
              />
            )}

            {step === "periodes" && activeSystemeId && (
              <StepConfigurerPeriodes
                systemeId={activeSystemeId}
                periodes={activePeriodes}
                onAdd={handleAddPeriode}
                onUpdate={updatePeriode}
                onRemove={removePeriode}
              />
            )}

            {step === "evaluations" && activeSystemeId && (
              <StepConfigurerEvaluations
                systemeId={activeSystemeId}
                periodes={activePeriodes}
                typesEval={activeTypes}
                onAddType={handleAddTypeEval}
                onUpdateType={updateTypeEval}
                onRemoveType={removeTypeEval}
              />
            )}

            {step === "apercu" && systemeActif && (
              <StepPreview
                systeme={systemeActif}
                periodes={activePeriodes}
                typesEval={activeTypes}
              />
            )}
          </CardContent>
        </Card>

        {/* ── Sidebar: systèmes existants ── */}
        <div className="space-y-3 sticky top-4">
          <Card className="border-[var(--line)] shadow-none">
            <CardContent className="p-4">
              <p className="text-[10px] font-semibold text-[var(--ink-4)] uppercase tracking-[0.06em] mb-3">
                {t("evalSystem.configuredSystems")}
              </p>
              <div className="space-y-2">
                {systemes.map(s => (
                  <button
                    key={s.id}
                    onClick={() => setActiveSysteme(s.id)}
                    className={`
                      w-full text-left p-3 rounded-[8px] border transition-all
                      ${s.id === activeSystemeId
                        ? "border-[var(--blue)] bg-[var(--blue-lighter)]"
                        : "border-[var(--line)] bg-white hover:border-[var(--blue)]"
                      }
                    `}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <p className="text-[12px] font-semibold text-[var(--ink)] flex-1 truncate">{s.nom}</p>
                      {s.actif && <div className="w-1.5 h-1.5 rounded-full bg-[var(--success)]" />}
                    </div>
                    <p className="text-[10px] text-[var(--ink-4)] truncate">{s.description}</p>
                  </button>
                ))}
              </div>

              <div className="mt-3 pt-3 border-t border-[var(--line)]">
                <p className="text-[10px] text-[var(--ink-4)] mb-2">{t("evalSystem.newSystem")}</p>
                <div className="space-y-2">
                  <Input
                    placeholder={t("evalSystem.systemNamePlaceholder")}
                    value={newNom}
                    onChange={e => setNewNom(e.target.value)}
                    className="h-8 text-[12px]"
                  />
                  <Button
                    size="sm"
                    variant="outline"
                    className="w-full text-[11px] h-8"
                    disabled={!newNom.trim()}
                    onClick={() => {
                      setNewNom("");
                    }}
                  >
                    <Plus className="w-3 h-3 mr-1" /> {t("actions.create", { ns: "common" })}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Raccourcis */}
          <Card className="border-[var(--line)] shadow-none">
            <CardContent className="p-4">
              <p className="text-[10px] font-semibold text-[var(--ink-4)] uppercase tracking-[0.06em] mb-3">
                {t("evalSystem.shortcuts")}
              </p>
              <div className="space-y-1">
                {[
                  { label: t("gradeEntry.pageTitle"), href: "/dashboard/notes/saisie" },
                  { label: t("evalSystem.examScheduling"), href: "/dashboard/academique/examens" },
                  { label: t("bulletins.pageTitle"), href: "/dashboard/bulletins" },
                ].map(l => (
                  <a
                    key={l.href}
                    href={l.href}
                    className="flex items-center justify-between text-[11px] text-[var(--blue)] hover:underline py-1"
                  >
                    {l.label}
                    <ChevronRight className="w-3 h-3" />
                  </a>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
