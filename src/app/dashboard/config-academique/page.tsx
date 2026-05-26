"use client";
import { useState, useReducer } from "react";
import {
  Plus, Edit2, Trash2, ChevronDown, Check, Search,
  Calendar, BookOpen, ListChecks, RefreshCw, AlertTriangle,
} from "lucide-react";
import { useToast } from "@/components/ui/toast";
import { PageHeader } from "@/components/shared/PageHeader";
import { EduBadge } from "@/components/shared/EduBadge";
import { EmptyState } from "@/components/shared/EmptyState";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Dialog, DialogContent, DialogHeader, DialogFooter,
  DialogTitle, DialogBody,
} from "@/components/ui/dialog";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";

// ── Types ─────────────────────────────────────────────────────────────────────
type Niveau = "PRIMAIRE" | "SECONDAIRE" | "SUPERIEUR";
type CalendarMode = "TRIMESTRIEL" | "SEMESTRIEL" | "QUADRIMESTRIEL";
type YearStatus = "ACTIF" | "ARCHIVE" | "BROUILLON";

interface Matiere { id: string; nom: string; code: string; }
interface UEMatiere { matiereId: string; coeff: number; }
interface UE { id: string; nom: string; code: string; niveau: Niveau; matieres: UEMatiere[]; }

interface EvalType { id: string; code: string; label: string; color: string; icon: string; }

interface EvalConfig { evalTypeId: string; pct: number; }
interface Sequence { id: string; nom: string; evalConfig: EvalConfig[]; }
interface Periode { id: string; nom: string; startDate: string; endDate: string; sequences: Sequence[]; }
interface AcademicYear {
  id: string; label: string; type: Niveau; startDate: string; endDate: string;
  calendarMode: CalendarMode; status: YearStatus;
  periodes: Array<{ id: string; nom: string; startDate: string; endDate: string }>;
}

interface WizardState {
  step: number;
  yearInfo: { label: string; type: Niveau; startDate: string; endDate: string };
  calendarMode: CalendarMode;
  periodes: Periode[];
}

type UEModal = { mode: "create" } | { mode: "edit"; ue: UE };
type EvalModal = { mode: "create" } | { mode: "edit"; et: EvalType };

interface State {
  ues: UE[];
  evalTypes: EvalType[];
  academicYears: AcademicYear[];
  ueModal: UEModal | null;
  evalModal: EvalModal | null;
  wizard: WizardState | null;
}

type Action =
  | { type: "OPEN_UE_MODAL"; modal: UEModal }
  | { type: "CLOSE_UE_MODAL" }
  | { type: "SAVE_UE"; ue: UE }
  | { type: "DELETE_UE"; id: string }
  | { type: "OPEN_EVAL_MODAL"; modal: EvalModal }
  | { type: "CLOSE_EVAL_MODAL" }
  | { type: "SAVE_EVAL_TYPE"; evalType: EvalType }
  | { type: "DELETE_EVAL_TYPE"; id: string }
  | { type: "OPEN_WIZARD" }
  | { type: "CLOSE_WIZARD" }
  | { type: "WIZARD_NEXT" }
  | { type: "WIZARD_PREV" }
  | { type: "WIZARD_SET_YEAR_INFO"; yearInfo: Partial<WizardState["yearInfo"]> }
  | { type: "WIZARD_SET_MODE"; mode: CalendarMode }
  | { type: "WIZARD_SET_PERIODE_DATES"; periodeId: string; startDate: string; endDate: string }
  | { type: "WIZARD_SET_SEQ_PCT"; periodeId: string; seqId: string; evalTypeId: string; pct: number }
  | { type: "WIZARD_SET_SEQ_CONFIG"; periodeId: string; seqId: string; evalConfig: EvalConfig[] }
  | { type: "SAVE_YEAR" };

// ── Mock Data ──────────────────────────────────────────────────────────────────
let _uid = 1;
const uid = () => `${Date.now()}_${_uid++}`;

const MOCK_MATIERES: Matiere[] = [
  { id: "mat1", nom: "Mathématiques", code: "MATH" },
  { id: "mat2", nom: "Français", code: "FR" },
  { id: "mat3", nom: "Sciences", code: "SCI" },
  { id: "mat4", nom: "Histoire-Géographie", code: "HG" },
  { id: "mat5", nom: "Anglais", code: "ENG" },
  { id: "mat6", nom: "Physique-Chimie", code: "PHY" },
  { id: "mat7", nom: "SVT", code: "SVT" },
  { id: "mat8", nom: "Informatique", code: "INFO" },
  { id: "mat9", nom: "Philosophie", code: "PHILO" },
  { id: "mat10", nom: "Éducation Physique", code: "EPS" },
];

const INITIAL_EVAL_TYPES: EvalType[] = [
  { id: "et1", code: "SN",   label: "Séquence Notée",    color: "#6366f1", icon: "📝" },
  { id: "et2", code: "CC",   label: "Contrôle Continu",  color: "#0ea5e9", icon: "✏️" },
  { id: "et3", code: "DS",   label: "Devoir Surveillé",  color: "#8b5cf6", icon: "📋" },
  { id: "et4", code: "COMP", label: "Composition",       color: "#f59e0b", icon: "🏆" },
  { id: "et5", code: "RAT",  label: "Rattrapage",        color: "#ef4444", icon: "🔄" },
  { id: "et6", code: "TP",   label: "Travaux Pratiques", color: "#10b981", icon: "🔬" },
  { id: "et7", code: "ORAL", label: "Épreuve Orale",     color: "#ec4899", icon: "🎤" },
  { id: "et8", code: "PROJ", label: "Projet",            color: "#f97316", icon: "🚀" },
];

const INITIAL_UES: UE[] = [
  { id: "ue1", nom: "UE Sciences Fondamentales", code: "USF", niveau: "SECONDAIRE",
    matieres: [{ matiereId: "mat1", coeff: 4 }, { matiereId: "mat3", coeff: 3 }, { matiereId: "mat6", coeff: 3 }] },
  { id: "ue2", nom: "UE Langues et Lettres", code: "ULL", niveau: "SECONDAIRE",
    matieres: [{ matiereId: "mat2", coeff: 4 }, { matiereId: "mat5", coeff: 3 }] },
  { id: "ue3", nom: "UE Sciences Humaines", code: "USH", niveau: "PRIMAIRE",
    matieres: [{ matiereId: "mat4", coeff: 2 }, { matiereId: "mat9", coeff: 1 }] },
  { id: "ue4", nom: "UE Technologies & Numérique", code: "UTN", niveau: "SUPERIEUR",
    matieres: [{ matiereId: "mat8", coeff: 4 }, { matiereId: "mat6", coeff: 2 }] },
];

// ── Calendar Templates ─────────────────────────────────────────────────────────
const CALENDAR_TEMPLATES: Record<CalendarMode, {
  label: string; icon: string; desc: string;
  periodes: string[]; seqPerPeriode: number; seqPrefix: string;
}> = {
  TRIMESTRIEL: {
    label: "Trimestriel", icon: "📅",
    desc: "3 trimestres · 2 séquences par trimestre — Primaire / Secondaire",
    periodes: ["Trimestre 1", "Trimestre 2", "Trimestre 3"],
    seqPerPeriode: 2, seqPrefix: "Séquence",
  },
  SEMESTRIEL: {
    label: "Semestriel", icon: "📆",
    desc: "2 semestres · 2 sessions — Supérieur, BTS, Licences",
    periodes: ["Semestre 1", "Semestre 2"],
    seqPerPeriode: 2, seqPrefix: "Session",
  },
  QUADRIMESTRIEL: {
    label: "Quadrimestriel", icon: "🗓️",
    desc: "4 périodes · 1 épreuve par période — Calendriers spéciaux",
    periodes: ["Période 1", "Période 2", "Période 3", "Période 4"],
    seqPerPeriode: 1, seqPrefix: "Épreuve",
  },
};

// ── Helpers ────────────────────────────────────────────────────────────────────
const buildFromTemplate = (mode: CalendarMode, evalTypes: EvalType[]): Periode[] => {
  const tpl = CALENDAR_TEMPLATES[mode];
  const defaultConfig: EvalConfig[] = evalTypes.slice(0, 2).map((et, i) => ({
    evalTypeId: et.id, pct: i === 0 ? 60 : 40,
  }));
  return tpl.periodes.map((nom, pi) => ({
    id: uid(), nom, startDate: "", endDate: "",
    sequences: Array.from({ length: tpl.seqPerPeriode }, (_, si) => ({
      id: uid(),
      nom: `${tpl.seqPrefix} ${pi * tpl.seqPerPeriode + si + 1}`,
      evalConfig: defaultConfig.map(ec => ({ ...ec })),
    })),
  }));
};

const buildMockYears = (): AcademicYear[] => [
  {
    id: "ay1", label: "2023-2024", type: "SECONDAIRE",
    startDate: "2023-09-04", endDate: "2024-07-05",
    calendarMode: "TRIMESTRIEL", status: "ARCHIVE",
    periodes: [
      { id: "p1", nom: "Trimestre 1", startDate: "2023-09-04", endDate: "2023-12-08" },
      { id: "p2", nom: "Trimestre 2", startDate: "2024-01-08", endDate: "2024-03-22" },
      { id: "p3", nom: "Trimestre 3", startDate: "2024-04-08", endDate: "2024-07-05" },
    ],
  },
  {
    id: "ay2", label: "2024-2025", type: "SECONDAIRE",
    startDate: "2024-09-02", endDate: "2025-07-04",
    calendarMode: "TRIMESTRIEL", status: "ACTIF",
    periodes: [
      { id: "p4", nom: "Trimestre 1", startDate: "2024-09-02", endDate: "2024-12-06" },
      { id: "p5", nom: "Trimestre 2", startDate: "2025-01-06", endDate: "2025-03-21" },
      { id: "p6", nom: "Trimestre 3", startDate: "2025-04-07", endDate: "2025-07-04" },
    ],
  },
];

const totalPct = (cfg: EvalConfig[]) => cfg.reduce((s, e) => s + (e.pct || 0), 0);
const pctStatus = (t: number) => t === 100 ? "ok" : t > 100 ? "over" : "under";
const getMatNom = (id: string) => MOCK_MATIERES.find(m => m.id === id)?.nom ?? id;

const NIVEAU_LABELS: Record<Niveau, string> = { PRIMAIRE: "Primaire", SECONDAIRE: "Secondaire", SUPERIEUR: "Supérieur" };
const NIVEAU_VARIANT: Record<Niveau, "amber" | "blue" | "purple"> = { PRIMAIRE: "amber", SECONDAIRE: "blue", SUPERIEUR: "purple" };
const STATUS_LABELS: Record<YearStatus, string> = { ACTIF: "Actif", ARCHIVE: "Archivé", BROUILLON: "Brouillon" };
const STATUS_VARIANT: Record<YearStatus, "green" | "neutral" | "amber"> = { ACTIF: "green", ARCHIVE: "neutral", BROUILLON: "amber" };

// ── Reducer ────────────────────────────────────────────────────────────────────
const initialState: State = {
  ues: INITIAL_UES,
  evalTypes: INITIAL_EVAL_TYPES,
  academicYears: buildMockYears(),
  ueModal: null,
  evalModal: null,
  wizard: null,
};

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "OPEN_UE_MODAL": return { ...state, ueModal: action.modal };
    case "CLOSE_UE_MODAL": return { ...state, ueModal: null };
    case "SAVE_UE": {
      const idx = state.ues.findIndex(u => u.id === action.ue.id);
      return { ...state, ues: idx >= 0 ? state.ues.map((u, i) => i === idx ? action.ue : u) : [...state.ues, action.ue], ueModal: null };
    }
    case "DELETE_UE": return { ...state, ues: state.ues.filter(u => u.id !== action.id) };

    case "OPEN_EVAL_MODAL": return { ...state, evalModal: action.modal };
    case "CLOSE_EVAL_MODAL": return { ...state, evalModal: null };
    case "SAVE_EVAL_TYPE": {
      const idx = state.evalTypes.findIndex(e => e.id === action.evalType.id);
      return { ...state, evalTypes: idx >= 0 ? state.evalTypes.map((e, i) => i === idx ? action.evalType : e) : [...state.evalTypes, action.evalType], evalModal: null };
    }
    case "DELETE_EVAL_TYPE": return { ...state, evalTypes: state.evalTypes.filter(e => e.id !== action.id) };

    case "OPEN_WIZARD": return {
      ...state, wizard: {
        step: 1,
        yearInfo: { label: "", type: "SECONDAIRE", startDate: "", endDate: "" },
        calendarMode: "TRIMESTRIEL",
        periodes: buildFromTemplate("TRIMESTRIEL", state.evalTypes),
      },
    };
    case "CLOSE_WIZARD": return { ...state, wizard: null };
    case "WIZARD_NEXT": return { ...state, wizard: state.wizard ? { ...state.wizard, step: state.wizard.step + 1 } : null };
    case "WIZARD_PREV": return { ...state, wizard: state.wizard ? { ...state.wizard, step: state.wizard.step - 1 } : null };
    case "WIZARD_SET_YEAR_INFO": return {
      ...state, wizard: state.wizard
        ? { ...state.wizard, yearInfo: { ...state.wizard.yearInfo, ...action.yearInfo } }
        : null,
    };
    case "WIZARD_SET_MODE": return {
      ...state, wizard: state.wizard
        ? { ...state.wizard, calendarMode: action.mode, periodes: buildFromTemplate(action.mode, state.evalTypes) }
        : null,
    };
    case "WIZARD_SET_PERIODE_DATES": return {
      ...state, wizard: state.wizard ? {
        ...state.wizard,
        periodes: state.wizard.periodes.map(p =>
          p.id === action.periodeId ? { ...p, startDate: action.startDate, endDate: action.endDate } : p
        ),
      } : null,
    };
    case "WIZARD_SET_SEQ_PCT": return {
      ...state, wizard: state.wizard ? {
        ...state.wizard,
        periodes: state.wizard.periodes.map(p =>
          p.id === action.periodeId ? {
            ...p, sequences: p.sequences.map(s =>
              s.id === action.seqId ? {
                ...s, evalConfig: s.evalConfig.map(ec =>
                  ec.evalTypeId === action.evalTypeId ? { ...ec, pct: action.pct } : ec
                ),
              } : s
            ),
          } : p
        ),
      } : null,
    };
    case "WIZARD_SET_SEQ_CONFIG": return {
      ...state, wizard: state.wizard ? {
        ...state.wizard,
        periodes: state.wizard.periodes.map(p =>
          p.id === action.periodeId ? {
            ...p, sequences: p.sequences.map(s =>
              s.id === action.seqId ? { ...s, evalConfig: action.evalConfig } : s
            ),
          } : p
        ),
      } : null,
    };
    case "SAVE_YEAR": {
      if (!state.wizard) return state;
      const w = state.wizard;
      return {
        ...state,
        academicYears: [...state.academicYears, {
          id: uid(), label: w.yearInfo.label, type: w.yearInfo.type,
          startDate: w.yearInfo.startDate, endDate: w.yearInfo.endDate,
          calendarMode: w.calendarMode, status: "BROUILLON",
          periodes: w.periodes.map(p => ({ id: p.id, nom: p.nom, startDate: p.startDate, endDate: p.endDate })),
        }],
        wizard: null,
      };
    }
    default: return state;
  }
}

// ── Stepper ────────────────────────────────────────────────────────────────────
function Stepper({ step, steps }: { step: number; steps: string[] }) {
  return (
    <div className="flex items-start mb-8">
      {steps.map((label, i) => {
        const n = i + 1;
        const status = n < step ? "done" : n === step ? "active" : "pending";
        return (
          <div key={i} className="flex items-start flex-1 last:flex-none">
            <div className="flex flex-col items-center">
              <div className={cn(
                "w-8 h-8 rounded-full flex items-center justify-center text-[11px] font-bold transition-all",
                status === "done" && "bg-[var(--success)] text-white",
                status === "active" && "bg-[var(--blue)] text-white ring-4 ring-[var(--blue-light)]",
                status === "pending" && "bg-[var(--line)] text-[var(--ink-4)]"
              )}>
                {status === "done" ? <Check className="w-3.5 h-3.5" /> : n}
              </div>
              <span className="text-[10px] text-[var(--ink-4)] mt-1.5 font-medium whitespace-nowrap">{label}</span>
            </div>
            {i < steps.length - 1 && (
              <div className={cn("flex-1 h-0.5 mt-4 mx-1.5 min-w-[32px] transition-colors", n < step ? "bg-[var(--success)]" : "bg-[var(--line)]")} />
            )}
          </div>
        );
      })}
    </div>
  );
}

// ── Percentage Panel ───────────────────────────────────────────────────────────
function PctPanel({
  sequence, evalTypes, periodeId, dispatch,
}: {
  sequence: Sequence; evalTypes: EvalType[]; periodeId: string;
  dispatch: (a: Action) => void;
}) {
  const total = totalPct(sequence.evalConfig);
  const status = pctStatus(total);

  const distribute = () => {
    const n = sequence.evalConfig.length;
    const base = Math.floor(100 / n);
    const rem = 100 - base * n;
    dispatch({
      type: "WIZARD_SET_SEQ_CONFIG",
      periodeId,
      seqId: sequence.id,
      evalConfig: sequence.evalConfig.map((ec, i) => ({ ...ec, pct: base + (i === 0 ? rem : 0) })),
    });
  };

  return (
    <div className="bg-[var(--ivory)] rounded-lg p-3.5 mb-2.5">
      <div className="flex items-center justify-between mb-3">
        <span className="text-[12px] font-semibold text-[var(--ink)]">{sequence.nom}</span>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="xs" onClick={distribute}>
            <RefreshCw className="w-3 h-3" /> Auto
          </Button>
          <span className={cn(
            "text-[11px] font-bold px-2.5 py-0.5 rounded-full",
            status === "ok" && "bg-[var(--success-light)] text-[var(--success)]",
            status === "over" && "bg-[var(--danger-light)] text-[var(--danger)]",
            status === "under" && "bg-[var(--warning-light)] text-[var(--warning)]",
          )}>
            {total}% {status === "ok" ? "✓" : status === "over" ? "▲" : "▼"}
          </span>
        </div>
      </div>

      <div className="flex flex-col gap-2">
        {sequence.evalConfig.map(ec => {
          const et = evalTypes.find(e => e.id === ec.evalTypeId);
          if (!et) return null;
          return (
            <div key={ec.evalTypeId} className="flex items-center gap-2.5">
              <div className="flex items-center gap-1.5 flex-1 min-w-0">
                <div className="w-2 h-2 rounded-full shrink-0" style={{ background: et.color }} />
                <span className="text-[11px] font-mono font-bold" style={{ color: et.color }}>{et.code}</span>
                <span className="text-[10px] text-[var(--ink-4)] truncate">— {et.label}</span>
              </div>
              <div className="flex-[2] min-w-[48px] h-1.5 bg-[var(--line)] rounded-full overflow-hidden">
                <div className="h-full rounded-full transition-all" style={{ width: `${Math.min(ec.pct, 100)}%`, background: et.color }} />
              </div>
              <input
                type="number" min={0} max={100}
                value={ec.pct}
                onChange={e => dispatch({
                  type: "WIZARD_SET_SEQ_PCT",
                  periodeId, seqId: sequence.id,
                  evalTypeId: ec.evalTypeId,
                  pct: parseInt(e.target.value) || 0,
                })}
                className={cn(
                  "w-14 text-center text-[12px] font-bold border rounded-[5px] py-1 px-0 outline-none transition-colors bg-white",
                  "focus:ring-2 focus:ring-[var(--blue)] focus:border-[var(--blue)]",
                  status !== "ok" && total > 0 ? "border-[var(--warning)]" : "border-[var(--line)]"
                )}
                style={{ MozAppearance: "textfield" } as React.CSSProperties}
              />
              <span className="text-[10px] text-[var(--ink-4)] w-3">%</span>
            </div>
          );
        })}
      </div>

      {status !== "ok" && total > 0 && (
        <div className={cn(
          "mt-2.5 flex items-center gap-1.5 text-[11px] px-2.5 py-1.5 rounded",
          status === "over" ? "bg-[var(--danger-light)] text-[var(--danger)]" : "bg-[var(--warning-light)] text-[var(--warning)]"
        )}>
          <AlertTriangle className="w-3 h-3 shrink-0" />
          {status === "over"
            ? `Dépassement de ${total - 100}% — réduisez les pourcentages`
            : `Manque ${100 - total}% — le total doit être exactement 100%`}
        </div>
      )}
    </div>
  );
}

// ── UE Modal ───────────────────────────────────────────────────────────────────
function UEModal({ modal, dispatch, toast }: {
  modal: UEModal; dispatch: (a: Action) => void;
  toast: (m: string, v?: "success" | "error") => void;
}) {
  const isEdit = modal.mode === "edit";
  const [ue, setUE] = useState<UE>(
    isEdit ? { ...modal.ue, matieres: modal.ue.matieres.map(m => ({ ...m })) }
           : { id: uid(), nom: "", code: "", niveau: "SECONDAIRE", matieres: [] }
  );

  const toggleMat = (id: string) => {
    setUE(u => ({
      ...u,
      matieres: u.matieres.find(m => m.matiereId === id)
        ? u.matieres.filter(m => m.matiereId !== id)
        : [...u.matieres, { matiereId: id, coeff: 2 }],
    }));
  };

  const adjustCoeff = (id: string, delta: number) => {
    setUE(u => ({
      ...u,
      matieres: u.matieres.map(m =>
        m.matiereId === id ? { ...m, coeff: Math.max(1, Math.min(10, m.coeff + delta)) } : m
      ),
    }));
  };

  const save = () => {
    if (!ue.nom.trim() || !ue.code.trim()) { toast("Nom et code requis", "error"); return; }
    dispatch({ type: "SAVE_UE", ue });
    toast(isEdit ? "UE mise à jour" : "UE créée avec succès", "success");
  };

  return (
    <Dialog open onOpenChange={() => dispatch({ type: "CLOSE_UE_MODAL" })}>
      <DialogContent size="lg">
        <DialogHeader>
          <DialogTitle>{isEdit ? "Modifier l'UE" : "Nouvelle Unité d'Enseignement"}</DialogTitle>
        </DialogHeader>
        <DialogBody>
          <div className="grid grid-cols-2 gap-3 mb-4">
            <div className="flex flex-col gap-1.5">
              <Label>Nom de l'UE *</Label>
              <Input placeholder="ex: UE Sciences Fondamentales" value={ue.nom} onChange={e => setUE(u => ({ ...u, nom: e.target.value }))} />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label>Code *</Label>
              <Input placeholder="ex: USF" value={ue.code} onChange={e => setUE(u => ({ ...u, code: e.target.value.toUpperCase() }))} maxLength={8} />
            </div>
          </div>
          <div className="flex flex-col gap-1.5 mb-4">
            <Label>Niveau</Label>
            <Select value={ue.niveau} onValueChange={v => setUE(u => ({ ...u, niveau: v as Niveau }))}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="PRIMAIRE">Primaire</SelectItem>
                <SelectItem value="SECONDAIRE">Secondaire</SelectItem>
                <SelectItem value="SUPERIEUR">Supérieur</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center justify-between mb-2">
            <Label>Matières et coefficients</Label>
            <span className="text-[11px] text-[var(--ink-4)]">{ue.matieres.length} sélectionnée{ue.matieres.length > 1 ? "s" : ""}</span>
          </div>
          <div className="flex flex-col gap-1.5">
            {MOCK_MATIERES.map(m => {
              const entry = ue.matieres.find(e => e.matiereId === m.id);
              const selected = !!entry;
              return (
                <div
                  key={m.id}
                  onClick={() => toggleMat(m.id)}
                  className={cn(
                    "flex items-center gap-2.5 px-3 py-2 rounded-[7px] cursor-pointer border transition-all",
                    selected
                      ? "bg-[var(--blue-lighter)] border-[rgba(26,60,143,0.2)]"
                      : "bg-[var(--ivory)] border-transparent hover:border-[var(--line-dark)]"
                  )}
                >
                  <div className={cn(
                    "w-4 h-4 rounded flex items-center justify-center shrink-0 border-2 transition-all",
                    selected ? "bg-[var(--blue)] border-[var(--blue)]" : "border-[var(--line-dark)] bg-white"
                  )}>
                    {selected && <Check className="w-2.5 h-2.5 text-white" />}
                  </div>
                  <span className="text-[12.5px] flex-1">{m.nom}</span>
                  <span className="text-[10px] text-[var(--ink-4)] font-mono">({m.code})</span>
                  {selected && (
                    <div className="flex items-center gap-1.5" onClick={e => e.stopPropagation()}>
                      <button onClick={() => adjustCoeff(m.id, -1)} className="w-5 h-5 rounded border border-[var(--line-dark)] bg-white text-[var(--ink-3)] flex items-center justify-center text-sm leading-none hover:bg-[var(--blue)] hover:text-white hover:border-[var(--blue)] transition-all">−</button>
                      <span className="w-5 text-center text-[12px] font-bold text-[var(--ink)]">{entry!.coeff}</span>
                      <button onClick={() => adjustCoeff(m.id, 1)} className="w-5 h-5 rounded border border-[var(--line-dark)] bg-white text-[var(--ink-3)] flex items-center justify-center text-sm leading-none hover:bg-[var(--blue)] hover:text-white hover:border-[var(--blue)] transition-all">+</button>
                      <span className="text-[10px] text-[var(--ink-4)]">coeff</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {ue.matieres.length > 0 && (
            <div className="mt-3 px-3 py-2 bg-[var(--ivory)] rounded text-[11.5px] text-[var(--ink-4)]">
              Coefficient total :{" "}
              <strong className="text-[var(--ink)]">{ue.matieres.reduce((s, m) => s + m.coeff, 0)}</strong>
            </div>
          )}
        </DialogBody>
        <DialogFooter>
          <Button variant="outline" onClick={() => dispatch({ type: "CLOSE_UE_MODAL" })}>Annuler</Button>
          <Button onClick={save}><Check className="w-3.5 h-3.5" /> {isEdit ? "Enregistrer" : "Créer l'UE"}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// ── Eval Type Modal ────────────────────────────────────────────────────────────
function EvalTypeModal({ modal, dispatch, toast }: {
  modal: EvalModal; dispatch: (a: Action) => void;
  toast: (m: string, v?: "success" | "error") => void;
}) {
  const isEdit = modal.mode === "edit";
  const [et, setET] = useState<EvalType>(
    isEdit ? { ...modal.et } : { id: uid(), code: "", label: "", color: "#6366f1", icon: "📝" }
  );
  const COLORS = ["#6366f1","#0ea5e9","#8b5cf6","#f59e0b","#ef4444","#10b981","#ec4899","#f97316","#14b8a6","#a855f7"];

  const save = () => {
    if (!et.code.trim() || !et.label.trim()) { toast("Code et libellé requis", "error"); return; }
    dispatch({ type: "SAVE_EVAL_TYPE", evalType: et });
    toast(isEdit ? "Type mis à jour" : "Type créé", "success");
  };

  return (
    <Dialog open onOpenChange={() => dispatch({ type: "CLOSE_EVAL_MODAL" })}>
      <DialogContent size="sm">
        <DialogHeader>
          <DialogTitle>{isEdit ? "Modifier le type" : "Nouveau type d'évaluation"}</DialogTitle>
        </DialogHeader>
        <DialogBody>
          <div className="grid grid-cols-2 gap-3 mb-3">
            <div className="flex flex-col gap-1.5">
              <Label>Code *</Label>
              <Input placeholder="SN" value={et.code} onChange={e => setET(t => ({ ...t, code: e.target.value.toUpperCase() }))} maxLength={6} />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label>Icône (emoji)</Label>
              <Input placeholder="📝" value={et.icon} onChange={e => setET(t => ({ ...t, icon: e.target.value }))} />
            </div>
          </div>
          <div className="flex flex-col gap-1.5 mb-3">
            <Label>Libellé complet *</Label>
            <Input placeholder="ex: Séquence Notée" value={et.label} onChange={e => setET(t => ({ ...t, label: e.target.value }))} />
          </div>
          <div className="flex flex-col gap-1.5 mb-4">
            <Label>Couleur d'identité</Label>
            <div className="flex gap-2 flex-wrap mt-1">
              {COLORS.map(c => (
                <button
                  key={c} onClick={() => setET(t => ({ ...t, color: c }))}
                  className="w-7 h-7 rounded-full border-2 transition-all"
                  style={{ background: c, borderColor: et.color === c ? "#1e293b" : "transparent", boxShadow: et.color === c ? `0 0 0 3px ${c}40` : "none" }}
                />
              ))}
            </div>
          </div>
          <div className="flex items-center gap-4 px-4 py-3 bg-[var(--ivory)] rounded-lg border border-[var(--line)]">
            <span className="text-2xl">{et.icon || "?"}</span>
            <div>
              <div className="font-mono font-black text-base" style={{ color: et.color }}>{et.code || "CODE"}</div>
              <div className="text-[11.5px] text-[var(--ink-4)]">{et.label || "Libellé du type"}</div>
            </div>
            <div className="ml-auto w-3 h-3 rounded-full" style={{ background: et.color }} />
          </div>
        </DialogBody>
        <DialogFooter>
          <Button variant="outline" onClick={() => dispatch({ type: "CLOSE_EVAL_MODAL" })}>Annuler</Button>
          <Button onClick={save}><Check className="w-3.5 h-3.5" /> {isEdit ? "Enregistrer" : "Créer"}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// ── Wizard ─────────────────────────────────────────────────────────────────────
function WizardStep1({ wizard, dispatch }: { wizard: WizardState; dispatch: (a: Action) => void }) {
  const { yearInfo } = wizard;
  const up = (k: keyof typeof yearInfo, v: string) =>
    dispatch({ type: "WIZARD_SET_YEAR_INFO", yearInfo: { [k]: v } });
  const valid = yearInfo.label.trim() && yearInfo.startDate && yearInfo.endDate;

  return (
    <div>
      <p className="text-[12.5px] text-[var(--ink-4)] mb-5">Renseignez le libellé, le type d'établissement et les dates de l'année.</p>
      <div className="grid grid-cols-2 gap-3 mb-3">
        <div className="flex flex-col gap-1.5">
          <Label>Libellé de l'année *</Label>
          <Input placeholder="ex: 2025-2026" value={yearInfo.label} onChange={e => up("label", e.target.value)} />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label>Type d'établissement</Label>
          <Select value={yearInfo.type} onValueChange={v => up("type", v)}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="PRIMAIRE">Primaire</SelectItem>
              <SelectItem value="SECONDAIRE">Secondaire</SelectItem>
              <SelectItem value="SUPERIEUR">Supérieur</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3 mb-6">
        <div className="flex flex-col gap-1.5">
          <Label>Date de début *</Label>
          <Input type="date" value={yearInfo.startDate} onChange={e => up("startDate", e.target.value)} />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label>Date de fin *</Label>
          <Input type="date" value={yearInfo.endDate} onChange={e => up("endDate", e.target.value)} />
        </div>
      </div>
      <div className="flex justify-end">
        <Button disabled={!valid} onClick={() => valid && dispatch({ type: "WIZARD_NEXT" })}>
          Suivant →
        </Button>
      </div>
    </div>
  );
}

function WizardStep2({ wizard, dispatch }: { wizard: WizardState; dispatch: (a: Action) => void }) {
  const select = (mode: CalendarMode) => {
    dispatch({ type: "WIZARD_SET_MODE", mode });
    dispatch({ type: "WIZARD_NEXT" });
  };
  return (
    <div>
      <p className="text-[12.5px] text-[var(--ink-4)] mb-5">Choisissez la structure temporelle. La sélection génère automatiquement les périodes.</p>
      <div className="grid grid-cols-3 gap-3 mb-6">
        {(Object.entries(CALENDAR_TEMPLATES) as [CalendarMode, typeof CALENDAR_TEMPLATES[CalendarMode]][]).map(([key, tpl]) => (
          <button
            key={key}
            onClick={() => select(key)}
            className={cn(
              "text-left border-[1.5px] rounded-xl p-4 transition-all cursor-pointer",
              wizard.calendarMode === key
                ? "border-[var(--blue)] bg-[var(--blue-lighter)]"
                : "border-[var(--line)] hover:border-[var(--blue-light)] hover:bg-[var(--blue-lighter)]"
            )}
          >
            {wizard.calendarMode === key && (
              <div className="float-right w-5 h-5 rounded-full bg-[var(--blue)] flex items-center justify-center">
                <Check className="w-3 h-3 text-white" />
              </div>
            )}
            <div className="text-2xl mb-2">{tpl.icon}</div>
            <div className="font-bold text-[13px] text-[var(--ink)] mb-1">{tpl.label}</div>
            <div className="text-[11px] text-[var(--ink-4)] mb-3 leading-relaxed">{tpl.desc}</div>
            <div className="flex flex-wrap gap-1">
              {tpl.periodes.map(p => (
                <span key={p} className="text-[10px] px-1.5 py-0.5 bg-[var(--ivory)] rounded text-[var(--ink-4)] font-medium">{p}</span>
              ))}
            </div>
          </button>
        ))}
      </div>
      <div className="flex justify-between">
        <Button variant="outline" onClick={() => dispatch({ type: "WIZARD_PREV" })}>← Précédent</Button>
      </div>
    </div>
  );
}

function WizardStep3({ wizard, dispatch, evalTypes }: {
  wizard: WizardState; dispatch: (a: Action) => void; evalTypes: EvalType[];
}) {
  const [open, setOpen] = useState<Record<string, boolean>>({ [wizard.periodes[0]?.id]: true });
  const toggle = (id: string) => setOpen(s => ({ ...s, [id]: !s[id] }));

  const allValid = wizard.periodes.every(p => p.sequences.every(s => totalPct(s.evalConfig) === 100));
  const badCount = wizard.periodes.reduce((n, p) => n + p.sequences.filter(s => totalPct(s.evalConfig) !== 100).length, 0);

  return (
    <div>
      <p className="text-[12.5px] text-[var(--ink-4)] mb-4">
        Pour chaque séquence, définissez la pondération. Le total doit être exactement <strong className="text-[var(--ink)]">100%</strong>.
      </p>

      {!allValid && badCount > 0 && (
        <div className="flex items-center gap-2 text-[11.5px] bg-[var(--warning-light)] text-[var(--warning)] px-3 py-2 rounded-lg mb-4">
          <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
          <span><strong>{badCount} séquence{badCount > 1 ? "s" : ""}</strong> ont un total ≠ 100% — utilisez <strong>Auto</strong> pour équilibrer.</span>
        </div>
      )}

      {wizard.periodes.map(periode => {
        const seqOk = periode.sequences.map(s => totalPct(s.evalConfig) === 100);
        return (
          <div key={periode.id} className="border border-[var(--line)] rounded-xl overflow-hidden mb-2.5">
            <button
              className="w-full flex items-center justify-between px-4 py-3 bg-white hover:bg-[var(--ivory)] transition-colors text-left"
              onClick={() => toggle(periode.id)}
            >
              <span className="flex items-center gap-2.5 text-[13px] font-semibold text-[var(--ink)]">
                📅 {periode.nom}
                <span className="flex gap-1.5">
                  {seqOk.map((ok, i) => (
                    <span key={i} className={cn("w-2 h-2 rounded-full inline-block", ok ? "bg-[var(--success)]" : "bg-[var(--warning)]")} title={`${periode.sequences[i].nom}: ${totalPct(periode.sequences[i].evalConfig)}%`} />
                  ))}
                </span>
              </span>
              <ChevronDown className={cn("w-4 h-4 text-[var(--ink-4)] transition-transform", open[periode.id] && "rotate-180")} />
            </button>
            {open[periode.id] && (
              <div className="px-4 pb-4 pt-3 bg-[var(--ivory)] border-t border-[var(--line)]">
                <div className="grid grid-cols-2 gap-3 mb-4">
                  <div className="flex flex-col gap-1.5">
                    <Label>Début</Label>
                    <Input type="date" value={periode.startDate}
                      onChange={e => dispatch({ type: "WIZARD_SET_PERIODE_DATES", periodeId: periode.id, startDate: e.target.value, endDate: periode.endDate })} />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <Label>Fin</Label>
                    <Input type="date" value={periode.endDate}
                      onChange={e => dispatch({ type: "WIZARD_SET_PERIODE_DATES", periodeId: periode.id, startDate: periode.startDate, endDate: e.target.value })} />
                  </div>
                </div>
                {periode.sequences.map(seq => (
                  <PctPanel key={seq.id} sequence={seq} evalTypes={evalTypes} periodeId={periode.id} dispatch={dispatch} />
                ))}
              </div>
            )}
          </div>
        );
      })}

      <div className="flex justify-between mt-4">
        <Button variant="outline" onClick={() => dispatch({ type: "WIZARD_PREV" })}>← Précédent</Button>
        <Button disabled={!allValid} onClick={() => allValid && dispatch({ type: "WIZARD_NEXT" })}>
          Récapitulatif →
        </Button>
      </div>
    </div>
  );
}

function WizardStep4({ wizard, dispatch, evalTypes, toast }: {
  wizard: WizardState; dispatch: (a: Action) => void;
  evalTypes: EvalType[]; toast: (m: string, v?: "success" | "error") => void;
}) {
  const { yearInfo, calendarMode } = wizard;
  const tpl = CALENDAR_TEMPLATES[calendarMode];
  const save = () => {
    dispatch({ type: "SAVE_YEAR" });
    toast(`Année ${yearInfo.label} créée avec succès`, "success");
  };
  return (
    <div>
      <p className="text-[12.5px] text-[var(--ink-4)] mb-5">Vérifiez la configuration avant de valider l'année.</p>

      <div className="mb-5">
        <div className="text-[10px] font-bold text-[var(--ink-4)] uppercase tracking-widest mb-2">Informations générales</div>
        <div className="grid grid-cols-2 gap-2.5">
          {[
            ["Libellé", yearInfo.label],
            ["Niveau", NIVEAU_LABELS[yearInfo.type]],
            ["Début", yearInfo.startDate || "—"],
            ["Fin", yearInfo.endDate || "—"],
          ].map(([k, v]) => (
            <div key={k} className="bg-[var(--ivory)] rounded-lg px-3.5 py-2.5 border border-[var(--line)]">
              <div className="text-[10px] text-[var(--ink-4)] mb-0.5">{k}</div>
              <div className="text-[13px] font-semibold text-[var(--ink)]">{v}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="mb-6">
        <div className="text-[10px] font-bold text-[var(--ink-4)] uppercase tracking-widest mb-2">Calendrier — {tpl.label}</div>
        {wizard.periodes.map(p => (
          <div key={p.id} className="border border-[var(--line)] rounded-lg px-3.5 py-3 mb-2 bg-[var(--ivory)]">
            <div className="font-semibold text-[12.5px] text-[var(--ink)] mb-2">
              📅 {p.nom}{p.startDate ? ` · ${p.startDate} → ${p.endDate}` : ""}
            </div>
            {p.sequences.map(s => {
              const t = totalPct(s.evalConfig);
              return (
                <div key={s.id} className="flex items-center justify-between text-[11.5px] text-[var(--ink-4)] ml-4 mb-1">
                  <span>• {s.nom}</span>
                  <div className="flex items-center gap-1.5 flex-wrap">
                    {s.evalConfig.filter(ec => ec.pct > 0).map(ec => {
                      const et = evalTypes.find(e => e.id === ec.evalTypeId);
                      return et ? (
                        <span key={ec.evalTypeId} className="text-[10px] font-bold px-2 py-0.5 rounded-full" style={{ background: et.color + "22", color: et.color }}>
                          {et.code} {ec.pct}%
                        </span>
                      ) : null;
                    })}
                    <span className={cn("text-[10px] font-bold", t === 100 ? "text-[var(--success)]" : "text-[var(--danger)]")}>= {t}%</span>
                  </div>
                </div>
              );
            })}
          </div>
        ))}
      </div>

      <div className="flex justify-between">
        <Button variant="outline" onClick={() => dispatch({ type: "WIZARD_PREV" })}>← Précédent</Button>
        <Button variant="success" onClick={save}>
          <Check className="w-3.5 h-3.5" /> Valider et créer l'année
        </Button>
      </div>
    </div>
  );
}

function WizardModal({ wizard, dispatch, evalTypes, toast }: {
  wizard: WizardState; dispatch: (a: Action) => void;
  evalTypes: EvalType[]; toast: (m: string, v?: "success" | "error") => void;
}) {
  const STEPS = ["Informations", "Calendrier", "Périodes", "Récapitulatif"];
  const STEP_TITLES = ["Informations de l'année", "Mode de calendrier", "Configuration des périodes", "Récapitulatif"];
  return (
    <Dialog open onOpenChange={() => dispatch({ type: "CLOSE_WIZARD" })}>
      <DialogContent size="lg">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <span className="text-xl">📅</span>
            <div>
              <DialogTitle>Nouvelle Année Académique</DialogTitle>
              <p className="text-[11px] text-[var(--ink-4)] mt-0.5">{STEP_TITLES[wizard.step - 1]}</p>
            </div>
          </div>
        </DialogHeader>
        <DialogBody>
          <Stepper step={wizard.step} steps={STEPS} />
          {wizard.step === 1 && <WizardStep1 wizard={wizard} dispatch={dispatch} />}
          {wizard.step === 2 && <WizardStep2 wizard={wizard} dispatch={dispatch} />}
          {wizard.step === 3 && <WizardStep3 wizard={wizard} dispatch={dispatch} evalTypes={evalTypes} />}
          {wizard.step === 4 && <WizardStep4 wizard={wizard} dispatch={dispatch} evalTypes={evalTypes} toast={toast} />}
        </DialogBody>
      </DialogContent>
    </Dialog>
  );
}

// ── Tab: UEs ───────────────────────────────────────────────────────────────────
function UETab({ ues, dispatch, toast }: {
  ues: UE[]; dispatch: (a: Action) => void;
  toast: (m: string, v?: "success" | "error") => void;
}) {
  const [search, setSearch] = useState("");
  const [level, setLevel] = useState<Niveau | "ALL">("ALL");

  const filtered = ues.filter(u =>
    (level === "ALL" || u.niveau === level) &&
    (u.nom.toLowerCase().includes(search.toLowerCase()) || u.code.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div>
      <div className="flex items-center justify-between flex-wrap gap-3 mb-5">
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[var(--ink-4)]" />
            <Input placeholder="Rechercher une UE…" value={search} onChange={e => setSearch(e.target.value)} className="pl-8 w-56" />
          </div>
          <Select value={level} onValueChange={v => setLevel(v as Niveau | "ALL")}>
            <SelectTrigger className="w-40"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">Tous niveaux</SelectItem>
              <SelectItem value="PRIMAIRE">Primaire</SelectItem>
              <SelectItem value="SECONDAIRE">Secondaire</SelectItem>
              <SelectItem value="SUPERIEUR">Supérieur</SelectItem>
            </SelectContent>
          </Select>
          <span className="text-[11.5px] text-[var(--ink-4)]">{filtered.length} UE{filtered.length > 1 ? "s" : ""}</span>
        </div>
        <Button onClick={() => dispatch({ type: "OPEN_UE_MODAL", modal: { mode: "create" } })}>
          <Plus className="w-3.5 h-3.5" /> Nouvelle UE
        </Button>
      </div>

      {filtered.length === 0 ? (
        <EmptyState icon={<BookOpen className="w-8 h-8" />} title="Aucune UE trouvée" description={search ? "Modifiez votre recherche" : "Créez votre première Unité d'Enseignement"} />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map(ue => (
            <div key={ue.id} className="bg-white border border-[var(--line)] rounded-xl overflow-hidden hover:shadow-md hover:border-[var(--line-dark)] transition-all">
              <div className="px-4 pt-4 pb-3 bg-gradient-to-br from-[var(--ivory)] to-[var(--blue-lighter)] border-b border-[var(--line)] flex items-start justify-between">
                <div>
                  <span className="font-mono text-[10px] font-bold text-[var(--blue)] bg-[var(--blue-light)] px-2 py-0.5 rounded border border-[rgba(26,60,143,.15)]">
                    {ue.code}
                  </span>
                  <div className="font-semibold text-[13.5px] text-[var(--ink)] mt-2 mb-1 leading-snug">{ue.nom}</div>
                  <EduBadge variant={NIVEAU_VARIANT[ue.niveau]}>{NIVEAU_LABELS[ue.niveau]}</EduBadge>
                </div>
                <div className="flex gap-1 ml-2 shrink-0">
                  <Button variant="ghost" size="icon-sm" onClick={() => dispatch({ type: "OPEN_UE_MODAL", modal: { mode: "edit", ue } })}>
                    <Edit2 className="w-3.5 h-3.5" />
                  </Button>
                  <Button variant="ghost" size="icon-sm" className="text-[var(--danger)] hover:bg-[var(--danger-light)]"
                    onClick={() => { if (confirm(`Supprimer "${ue.nom}" ?`)) { dispatch({ type: "DELETE_UE", id: ue.id }); toast("UE supprimée", "success"); } }}>
                    <Trash2 className="w-3.5 h-3.5" />
                  </Button>
                </div>
              </div>
              <div className="px-4 pb-4 pt-3">
                <div className="text-[10px] font-bold text-[var(--ink-5)] uppercase tracking-widest mb-2">
                  {ue.matieres.length} matière{ue.matieres.length > 1 ? "s" : ""}
                </div>
                <div className="flex flex-col gap-1.5">
                  {ue.matieres.map(m => (
                    <div key={m.matiereId} className="flex items-center justify-between px-2.5 py-1.5 bg-[var(--ivory)] rounded-[6px] text-[12px]">
                      <span className="text-[var(--ink-3)]">{getMatNom(m.matiereId)}</span>
                      <span className="font-bold text-[var(--blue)] text-[11px] bg-[var(--blue-light)] px-1.5 py-0.5 rounded">Coeff {m.coeff}</span>
                    </div>
                  ))}
                </div>
                <div className="mt-2.5 text-[11px] text-[var(--ink-4)] border-t border-[var(--line)] pt-2">
                  Coeff total : <strong className="text-[var(--ink)]">{ue.matieres.reduce((s, m) => s + m.coeff, 0)}</strong>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ── Tab: Eval Types ────────────────────────────────────────────────────────────
function EvalTypesTab({ evalTypes, dispatch, toast }: {
  evalTypes: EvalType[]; dispatch: (a: Action) => void;
  toast: (m: string, v?: "success" | "error") => void;
}) {
  return (
    <div>
      <div className="flex items-center justify-between mb-5">
        <div>
          <p className="text-[13px] font-semibold text-[var(--ink)]">Catalogue des types d'évaluation</p>
          <p className="text-[11.5px] text-[var(--ink-4)] mt-0.5">Ces types définissent la pondération des notes dans le calendrier.</p>
        </div>
        <Button onClick={() => dispatch({ type: "OPEN_EVAL_MODAL", modal: { mode: "create" } })}>
          <Plus className="w-3.5 h-3.5" /> Nouveau type
        </Button>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-3.5">
        {evalTypes.map(et => (
          <div
            key={et.id}
            className="relative bg-white border border-[var(--line)] rounded-xl pt-[5px] pb-4 px-4 text-center hover:shadow-md hover:border-[var(--line-dark)] transition-all overflow-hidden group"
          >
            <div className="absolute top-0 left-0 right-0 h-[5px] rounded-t-xl" style={{ background: et.color }} />
            <div className="absolute top-2 right-2 hidden group-hover:flex gap-1">
              <Button variant="ghost" size="icon-sm" onClick={() => dispatch({ type: "OPEN_EVAL_MODAL", modal: { mode: "edit", et } })}>
                <Edit2 className="w-3 h-3" />
              </Button>
              <Button variant="ghost" size="icon-sm" className="text-[var(--danger)] hover:bg-[var(--danger-light)]"
                onClick={() => { if (confirm(`Supprimer "${et.label}" ?`)) { dispatch({ type: "DELETE_EVAL_TYPE", id: et.id }); toast("Type supprimé", "success"); } }}>
                <Trash2 className="w-3 h-3" />
              </Button>
            </div>
            <span className="text-3xl block mt-4 mb-2">{et.icon}</span>
            <div className="font-mono font-black text-[15px]" style={{ color: et.color }}>{et.code}</div>
            <div className="text-[11px] text-[var(--ink-4)] mt-0.5 leading-snug">{et.label}</div>
          </div>
        ))}
        <button
          onClick={() => dispatch({ type: "OPEN_EVAL_MODAL", modal: { mode: "create" } })}
          className="border-[1.5px] border-dashed border-[var(--line-dark)] rounded-xl py-6 flex flex-col items-center justify-center gap-1.5 text-[var(--ink-4)] hover:border-[var(--blue)] hover:text-[var(--blue)] hover:bg-[var(--blue-lighter)] transition-all cursor-pointer"
        >
          <Plus className="w-5 h-5" />
          <span className="text-[11.5px] font-medium">Ajouter</span>
        </button>
      </div>
    </div>
  );
}

// ── Tab: Years ─────────────────────────────────────────────────────────────────
function YearsTab({ academicYears, dispatch }: {
  academicYears: AcademicYear[]; dispatch: (a: Action) => void;
}) {
  return (
    <div>
      <div className="flex items-center justify-between mb-5">
        <div>
          <p className="text-[13px] font-semibold text-[var(--ink)]">Années académiques</p>
          <p className="text-[11.5px] text-[var(--ink-4)] mt-0.5">Historique et gestion des années scolaires configurées.</p>
        </div>
        <Button onClick={() => dispatch({ type: "OPEN_WIZARD" })}>
          <Calendar className="w-3.5 h-3.5" /> Nouvelle année
        </Button>
      </div>

      {academicYears.length === 0 ? (
        <EmptyState icon={<Calendar className="w-8 h-8" />} title="Aucune année configurée" description="Lancez l'assistant pour configurer votre première année académique."
          action={<Button onClick={() => dispatch({ type: "OPEN_WIZARD" })}><Calendar className="w-3.5 h-3.5" /> Configurer une année</Button>}
        />
      ) : (
        <div className="flex flex-col gap-3">
          {academicYears.map(ay => {
            const tpl = CALENDAR_TEMPLATES[ay.calendarMode];
            return (
              <div key={ay.id} className="bg-white border border-[var(--line)] rounded-xl overflow-hidden hover:shadow-md transition-all">
                <div className="px-5 py-4 flex items-start justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2.5 mb-1.5">
                      <span className="font-serif text-[18px] text-[var(--ink)]">{ay.label}</span>
                      <EduBadge variant={STATUS_VARIANT[ay.status]}>
                        <span className={cn("w-1.5 h-1.5 rounded-full", ay.status === "ACTIF" ? "bg-[var(--success)]" : ay.status === "ARCHIVE" ? "bg-[var(--ink-5)]" : "bg-[var(--warning)]")} />
                        {STATUS_LABELS[ay.status]}
                      </EduBadge>
                    </div>
                    <div className="flex items-center gap-2 text-[11.5px] text-[var(--ink-4)] flex-wrap">
                      <EduBadge variant={NIVEAU_VARIANT[ay.type]}>{NIVEAU_LABELS[ay.type]}</EduBadge>
                      <span>·</span>
                      <span>{tpl?.label ?? ay.calendarMode}</span>
                      <span>·</span>
                      <span className="font-mono text-[10.5px]">{ay.startDate} → {ay.endDate}</span>
                    </div>
                  </div>
                  <Button variant="outline" size="sm"><Edit2 className="w-3.5 h-3.5" /> Modifier</Button>
                </div>
                <div className="px-5 pb-4 flex gap-2 flex-wrap border-t border-[var(--line)] pt-3 bg-[var(--ivory)]">
                  {ay.periodes.map(p => (
                    <span key={p.id} className="text-[11px] font-medium px-2.5 py-1 bg-white border border-[var(--line)] rounded-full text-[var(--ink-3)]">
                      📅 {p.nom}
                    </span>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ── Page ───────────────────────────────────────────────────────────────────────
export default function ConfigAcademiquePage() {
  const [state, dispatch] = useReducer(reducer, initialState);
  const { ues, evalTypes, academicYears, ueModal, evalModal, wizard } = state;
  const toast = useToast();

  const showToast = (m: string, v: "success" | "error" = "success") => toast.toast(m, v);

  return (
    <div>
      <PageHeader
        title="Configuration Académique"
        subtitle="Gérez les UE, les types d'évaluation et les années scolaires"
        actions={
          <Button onClick={() => dispatch({ type: "OPEN_WIZARD" })}>
            <Calendar className="w-3.5 h-3.5" /> Nouvelle année
          </Button>
        }
      />

      <Tabs defaultValue="ues">
        <TabsList>
          <TabsTrigger value="ues"><BookOpen className="w-3.5 h-3.5" /> Unités d'Enseignement</TabsTrigger>
          <TabsTrigger value="evaltypes"><ListChecks className="w-3.5 h-3.5" /> Types d'évaluation</TabsTrigger>
          <TabsTrigger value="years"><Calendar className="w-3.5 h-3.5" /> Années académiques</TabsTrigger>
        </TabsList>

        <TabsContent value="ues">
          <UETab ues={ues} dispatch={dispatch} toast={showToast} />
        </TabsContent>
        <TabsContent value="evaltypes">
          <EvalTypesTab evalTypes={evalTypes} dispatch={dispatch} toast={showToast} />
        </TabsContent>
        <TabsContent value="years">
          <YearsTab academicYears={academicYears} dispatch={dispatch} />
        </TabsContent>
      </Tabs>

      {ueModal && <UEModal modal={ueModal} dispatch={dispatch} toast={showToast} />}
      {evalModal && <EvalTypeModal modal={evalModal} dispatch={dispatch} toast={showToast} />}
      {wizard && <WizardModal wizard={wizard} dispatch={dispatch} evalTypes={evalTypes} toast={showToast} />}
    </div>
  );
}
