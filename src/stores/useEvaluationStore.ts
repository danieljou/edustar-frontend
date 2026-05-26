/**
 * Store Zustand — Système d'évaluation dynamique.
 * Centralise la configuration, les examens, les notes et les résultats.
 */
import { create } from "zustand";
import { devtools } from "zustand/middleware";
import type {
  SystemeEvaluation,
  Periode,
  TypeEvaluation,
  Examen,
  NoteEntree,
  ResultatPeriode,
  BulletinDynamique,
  EvaluationState,
} from "@/types/evaluation";
import { EVAL_MOCK } from "@/constants/evaluation-mock";

// ─── Actions ──────────────────────────────────────────────────────────────────

type EvaluationActions = {
  // Système
  addSysteme: (s: SystemeEvaluation) => void;
  updateSysteme: (id: string, patch: Partial<SystemeEvaluation>) => void;
  removeSysteme: (id: string) => void;
  setActiveSysteme: (id: string) => void;

  // Périodes
  addPeriode: (p: Periode) => void;
  updatePeriode: (id: string, patch: Partial<Periode>) => void;
  removePeriode: (id: string) => void;
  setActivePeriode: (id: string | null) => void;
  reorderPeriodes: (systemeId: string, ids: string[]) => void;

  // Types d'évaluation
  addTypeEval: (t: TypeEvaluation) => void;
  updateTypeEval: (id: string, patch: Partial<TypeEvaluation>) => void;
  removeTypeEval: (id: string) => void;
  reorderTypesEval: (periodeId: string, ids: string[]) => void;

  // Examens
  addExamen: (e: Examen) => void;
  updateExamen: (id: string, patch: Partial<Examen>) => void;
  removeExamen: (id: string) => void;

  // Notes
  setNote: (
    examenId: string,
    etudiantId: string,
    valeur: number | null,
    absent?: boolean,
  ) => void;
  soumettreLot: (examenId: string) => void;
  validerLot: (examenId: string, validateurId: string) => void;
  verrouillerLot: (examenId: string) => void;

  // Résultats
  setResultats: (resultats: ResultatPeriode[]) => void;
  setBulletins: (bulletins: BulletinDynamique[]) => void;

  // Reset
  loadMockData: () => void;
};

// ─── Store ────────────────────────────────────────────────────────────────────

export const useEvaluationStore = create<EvaluationState & EvaluationActions>()(
  devtools(
    (set, get) => ({
      // State initial depuis les mocks
      ...EVAL_MOCK,
      activeAnneeId: "ANN-2526",
      activeSystemeId: EVAL_MOCK.systemes[0]?.id ?? null,
      activePeriodeId: EVAL_MOCK.periodes[0]?.id ?? null,
      resultats: [],
      bulletins: [],

      // ── Système ──────────────────────────────────────────────────────────
      addSysteme: s =>
        set(st => ({ systemes: [...st.systemes, s] })),

      updateSysteme: (id, patch) =>
        set(st => ({
          systemes: st.systemes.map(s => (s.id === id ? { ...s, ...patch } : s)),
        })),

      removeSysteme: id =>
        set(st => ({ systemes: st.systemes.filter(s => s.id !== id) })),

      setActiveSysteme: id =>
        set({ activeSystemeId: id }),

      // ── Périodes ─────────────────────────────────────────────────────────
      addPeriode: p =>
        set(st => ({ periodes: [...st.periodes, p] })),

      updatePeriode: (id, patch) =>
        set(st => ({
          periodes: st.periodes.map(p => (p.id === id ? { ...p, ...patch } : p)),
        })),

      removePeriode: id =>
        set(st => ({ periodes: st.periodes.filter(p => p.id !== id) })),

      setActivePeriode: id =>
        set({ activePeriodeId: id }),

      reorderPeriodes: (systemeId, ids) =>
        set(st => {
          const filtered = st.periodes.filter(p => p.systemeId === systemeId);
          const others = st.periodes.filter(p => p.systemeId !== systemeId);
          const reordered = ids
            .map((id, i) => {
              const p = filtered.find(x => x.id === id);
              return p ? { ...p, ordre: i + 1 } : null;
            })
            .filter(Boolean) as Periode[];
          return { periodes: [...others, ...reordered] };
        }),

      // ── Types évaluation ─────────────────────────────────────────────────
      addTypeEval: t =>
        set(st => ({ typesEval: [...st.typesEval, t] })),

      updateTypeEval: (id, patch) =>
        set(st => ({
          typesEval: st.typesEval.map(t => (t.id === id ? { ...t, ...patch } : t)),
        })),

      removeTypeEval: id =>
        set(st => ({ typesEval: st.typesEval.filter(t => t.id !== id) })),

      reorderTypesEval: (periodeId, ids) =>
        set(st => {
          const filtered = st.typesEval.filter(t => t.periodeId === periodeId);
          const others = st.typesEval.filter(t => t.periodeId !== periodeId);
          const reordered = ids
            .map((id, i) => {
              const t = filtered.find(x => x.id === id);
              return t ? { ...t, ordre: i + 1 } : null;
            })
            .filter(Boolean) as TypeEvaluation[];
          return { typesEval: [...others, ...reordered] };
        }),

      // ── Examens ──────────────────────────────────────────────────────────
      addExamen: e =>
        set(st => ({ examens: [...st.examens, e] })),

      updateExamen: (id, patch) =>
        set(st => ({
          examens: st.examens.map(e => (e.id === id ? { ...e, ...patch } : e)),
        })),

      removeExamen: id =>
        set(st => ({ examens: st.examens.filter(e => e.id !== id) })),

      // ── Notes ────────────────────────────────────────────────────────────
      setNote: (examenId, etudiantId, valeur, absent = false) =>
        set(st => {
          const existing = st.notes.find(
            n => n.examenId === examenId && n.etudiantId === etudiantId,
          );
          if (existing) {
            return {
              notes: st.notes.map(n =>
                n.examenId === examenId && n.etudiantId === etudiantId
                  ? {
                      ...n,
                      valeur,
                      absent,
                      statut: "BROUILLON" as const,
                      historique: n.valeur !== null
                        ? [
                            ...n.historique,
                            {
                              valeur: n.valeur,
                              modifieLe: new Date().toISOString(),
                              modifieParId: "current-user",
                            },
                          ]
                        : n.historique,
                    }
                  : n,
              ),
            };
          }
          const newNote: NoteEntree = {
            id: `NOTE-${Date.now()}`,
            examenId,
            etudiantId,
            valeur,
            absent,
            statut: "BROUILLON",
            historique: [],
          };
          return { notes: [...st.notes, newNote] };
        }),

      soumettreLot: examenId =>
        set(st => ({
          notes: st.notes.map(n =>
            n.examenId === examenId && n.statut === "BROUILLON"
              ? { ...n, statut: "SOUMIS", soumisLe: new Date().toISOString() }
              : n,
          ),
        })),

      validerLot: (examenId, validateurId) =>
        set(st => ({
          notes: st.notes.map(n =>
            n.examenId === examenId && n.statut === "SOUMIS"
              ? { ...n, statut: "VALIDE", valideParId: validateurId }
              : n,
          ),
        })),

      verrouillerLot: examenId =>
        set(st => ({
          notes: st.notes.map(n =>
            n.examenId === examenId && n.statut === "VALIDE"
              ? { ...n, statut: "VERROUILLE" }
              : n,
          ),
        })),

      // ── Résultats ────────────────────────────────────────────────────────
      setResultats: resultats => set({ resultats }),
      setBulletins: bulletins => set({ bulletins }),

      // ── Reset / Mock ──────────────────────────────────────────────────────
      loadMockData: () => {
        void get(); // silence unused warning
        set({
          ...EVAL_MOCK,
          activeAnneeId: "ANN-2526",
          activeSystemeId: EVAL_MOCK.systemes[0]?.id ?? null,
          activePeriodeId: EVAL_MOCK.periodes[0]?.id ?? null,
          resultats: [],
          bulletins: [],
        });
      },
    }),
    { name: "EvaluationStore" },
  ),
);

// ─── Selectors ────────────────────────────────────────────────────────────────

export const selectSystemeActif = (state: EvaluationState) =>
  state.systemes.find(s => s.id === state.activeSystemeId);

export const selectPeriodesActives = (state: EvaluationState) =>
  state.periodes
    .filter(p => p.systemeId === state.activeSystemeId)
    .sort((a, b) => a.ordre - b.ordre);

export const selectTypesEvalPeriode = (
  state: EvaluationState,
  periodeId: string,
) =>
  state.typesEval
    .filter(t => t.periodeId === periodeId && t.statut === "ACTIF")
    .sort((a, b) => a.ordre - b.ordre);

export const selectExamensClasse = (
  state: EvaluationState,
  classeId: string,
  periodeId?: string,
) =>
  state.examens.filter(
    e => e.classeId === classeId && (!periodeId || e.periodeId === periodeId),
  );

export const selectNotesExamen = (state: EvaluationState, examenId: string) =>
  state.notes.filter(n => n.examenId === examenId);
