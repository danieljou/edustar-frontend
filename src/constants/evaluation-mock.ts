/**
 * Données mock démontrant 3 systèmes d'évaluation différents.
 * Importées par le store Zustand au démarrage.
 */
import type {
  SystemeEvaluation,
  Periode,
  TypeEvaluation,
  Examen,
  NoteEntree,
  EvaluationState,
} from "@/types/evaluation";

// ─── Système 1 : Séquences + Trimestres (Cameroun LMD) ─────────────────────

const SYS_SEQ: SystemeEvaluation = {
  id: "SYS-SEQ",
  nom: "Séquences & Trimestres",
  type: "SEQUENCES_TRIMESTRES",
  description: "6 séquences formant 3 trimestres. Système classique franco-camerounais.",
  anneeId: "ANN-2526",
  niveauId: "NIV-L1",
  actif: true,
};

const SYS_SEM: SystemeEvaluation = {
  id: "SYS-SEM",
  nom: "Semestriel",
  type: "SEMESTRIEL",
  description: "CC (30%) + Examen (70%) par semestre. Système LMD universitaire.",
  anneeId: "ANN-2526",
  niveauId: "NIV-M1",
  actif: true,
};

const SYS_PERSO: SystemeEvaluation = {
  id: "SYS-PERSO",
  nom: "Système personnalisé",
  type: "PERSONNALISE",
  description: "TP + Interrogation + Projet + Examen final. Adapté aux filières techniques.",
  anneeId: "ANN-2526",
  niveauId: "NIV-L2-TECH",
  actif: true,
};

// ─── Périodes ─────────────────────────────────────────────────────────────────

const PERIODES: Periode[] = [
  // Système séquences
  { id: "P-SEQ1", systemeId: "SYS-SEQ", nom: "Séquence 1", type: "SEQUENCE",  ordre: 1, dateDebut: "2025-09-01", dateFin: "2025-10-31", estAgregat: false, periodesFilles: [], statut: "CLOTUREE" },
  { id: "P-SEQ2", systemeId: "SYS-SEQ", nom: "Séquence 2", type: "SEQUENCE",  ordre: 2, dateDebut: "2025-11-01", dateFin: "2025-12-20", estAgregat: false, periodesFilles: [], statut: "CLOTUREE" },
  { id: "P-TRIM1", systemeId: "SYS-SEQ", nom: "Trimestre 1", type: "TRIMESTRE", ordre: 3, dateDebut: "2025-09-01", dateFin: "2025-12-20", estAgregat: true, periodesFilles: ["P-SEQ1","P-SEQ2"], statut: "CLOTUREE" },
  { id: "P-SEQ3", systemeId: "SYS-SEQ", nom: "Séquence 3", type: "SEQUENCE",  ordre: 4, dateDebut: "2026-01-05", dateFin: "2026-02-28", estAgregat: false, periodesFilles: [], statut: "EN_COURS" },
  { id: "P-SEQ4", systemeId: "SYS-SEQ", nom: "Séquence 4", type: "SEQUENCE",  ordre: 5, dateDebut: "2026-03-01", dateFin: "2026-04-15", estAgregat: false, periodesFilles: [], statut: "A_VENIR" },
  { id: "P-TRIM2", systemeId: "SYS-SEQ", nom: "Trimestre 2", type: "TRIMESTRE", ordre: 6, dateDebut: "2026-01-05", dateFin: "2026-04-15", estAgregat: true, periodesFilles: ["P-SEQ3","P-SEQ4"], statut: "A_VENIR" },
  { id: "P-SEQ5", systemeId: "SYS-SEQ", nom: "Séquence 5", type: "SEQUENCE",  ordre: 7, dateDebut: "2026-04-20", dateFin: "2026-05-31", estAgregat: false, periodesFilles: [], statut: "A_VENIR" },
  { id: "P-SEQ6", systemeId: "SYS-SEQ", nom: "Séquence 6", type: "SEQUENCE",  ordre: 8, dateDebut: "2026-06-01", dateFin: "2026-07-10", estAgregat: false, periodesFilles: [], statut: "A_VENIR" },
  { id: "P-TRIM3", systemeId: "SYS-SEQ", nom: "Trimestre 3", type: "TRIMESTRE", ordre: 9, dateDebut: "2026-04-20", dateFin: "2026-07-10", estAgregat: true, periodesFilles: ["P-SEQ5","P-SEQ6"], statut: "A_VENIR" },

  // Système semestriel
  { id: "P-S1",   systemeId: "SYS-SEM", nom: "Semestre 1", type: "SEMESTRE",  ordre: 1, dateDebut: "2025-09-01", dateFin: "2026-01-31", estAgregat: false, periodesFilles: [], statut: "CLOTUREE" },
  { id: "P-S2",   systemeId: "SYS-SEM", nom: "Semestre 2", type: "SEMESTRE",  ordre: 2, dateDebut: "2026-02-01", dateFin: "2026-07-10", estAgregat: false, periodesFilles: [], statut: "EN_COURS" },

  // Système personnalisé
  { id: "P-SES",  systemeId: "SYS-PERSO", nom: "Session normale",  type: "CUSTOM", ordre: 1, dateDebut: "2025-09-01", dateFin: "2026-06-30", estAgregat: false, periodesFilles: [], statut: "EN_COURS" },
  { id: "P-RATT", systemeId: "SYS-PERSO", nom: "Rattrapage",       type: "CUSTOM", ordre: 2, dateDebut: "2026-07-01", dateFin: "2026-07-31", estAgregat: false, periodesFilles: [], statut: "A_VENIR" },
];

// ─── Types d'évaluation ───────────────────────────────────────────────────────

const TYPES_EVAL: TypeEvaluation[] = [
  // ── Séquences (ex. Séquence 1) — chaque séquence = 1 évaluation ──
  { id: "TE-SEQ1-DS",  systemeId: "SYS-SEQ", periodeId: "P-SEQ1", nom: "Devoir surveillé",   abrev: "DS",   pourcentage: 100, coefficient: 1, noteSur: 20, ordre: 1, obligatoire: true,  statut: "ACTIF" },
  { id: "TE-SEQ2-DS",  systemeId: "SYS-SEQ", periodeId: "P-SEQ2", nom: "Devoir surveillé",   abrev: "DS",   pourcentage: 100, coefficient: 1, noteSur: 20, ordre: 1, obligatoire: true,  statut: "ACTIF" },
  { id: "TE-SEQ3-DS",  systemeId: "SYS-SEQ", periodeId: "P-SEQ3", nom: "Devoir surveillé",   abrev: "DS",   pourcentage: 100, coefficient: 1, noteSur: 20, ordre: 1, obligatoire: true,  statut: "ACTIF" },
  { id: "TE-SEQ4-DS",  systemeId: "SYS-SEQ", periodeId: "P-SEQ4", nom: "Devoir surveillé",   abrev: "DS",   pourcentage: 100, coefficient: 1, noteSur: 20, ordre: 1, obligatoire: true,  statut: "ACTIF" },

  // ── Semestre 1 : CC 30% + Examen 70% ──
  { id: "TE-S1-CC",  systemeId: "SYS-SEM", periodeId: "P-S1", nom: "Contrôle continu", abrev: "CC",   pourcentage: 30, coefficient: 1, noteSur: 20, ordre: 1, obligatoire: true,  statut: "ACTIF" },
  { id: "TE-S1-EX",  systemeId: "SYS-SEM", periodeId: "P-S1", nom: "Examen semestriel", abrev: "EX",  pourcentage: 70, coefficient: 1, noteSur: 20, ordre: 2, obligatoire: true,  statut: "ACTIF" },
  { id: "TE-S2-CC",  systemeId: "SYS-SEM", periodeId: "P-S2", nom: "Contrôle continu", abrev: "CC",   pourcentage: 30, coefficient: 1, noteSur: 20, ordre: 1, obligatoire: true,  statut: "ACTIF" },
  { id: "TE-S2-EX",  systemeId: "SYS-SEM", periodeId: "P-S2", nom: "Examen semestriel", abrev: "EX",  pourcentage: 70, coefficient: 1, noteSur: 20, ordre: 2, obligatoire: true,  statut: "ACTIF" },

  // ── Session personnalisée : TP20% + Interro20% + Projet10% + Examen50% ──
  { id: "TE-SES-TP",   systemeId: "SYS-PERSO", periodeId: "P-SES", nom: "Travaux pratiques",   abrev: "TP",    pourcentage: 20, coefficient: 1, noteSur: 20, ordre: 1, obligatoire: false, statut: "ACTIF" },
  { id: "TE-SES-INT",  systemeId: "SYS-PERSO", periodeId: "P-SES", nom: "Interrogation orale",  abrev: "Interro", pourcentage: 20, coefficient: 1, noteSur: 20, ordre: 2, obligatoire: false, statut: "ACTIF" },
  { id: "TE-SES-PRJ",  systemeId: "SYS-PERSO", periodeId: "P-SES", nom: "Projet",               abrev: "Proj",  pourcentage: 10, coefficient: 1, noteSur: 20, ordre: 3, obligatoire: false, statut: "ACTIF" },
  { id: "TE-SES-EX",   systemeId: "SYS-PERSO", periodeId: "P-SES", nom: "Examen final",         abrev: "EX",    pourcentage: 50, coefficient: 1, noteSur: 20, ordre: 4, obligatoire: true,  statut: "ACTIF" },
  { id: "TE-RATT-EX",  systemeId: "SYS-PERSO", periodeId: "P-RATT", nom: "Examen de rattrapage", abrev: "RATT", pourcentage: 100, coefficient: 1, noteSur: 20, ordre: 1, obligatoire: true, statut: "ACTIF" },
];

// ─── Examens planifiés ────────────────────────────────────────────────────────

const EXAMENS: Examen[] = [
  {
    id: "EX-001", typeEvalId: "TE-SEQ3-DS", periodeId: "P-SEQ3",
    matiereId: "INF101", classeId: "L1-INFO-A",
    titre: "DS Algorithmique — Séquence 3",
    date: "2026-01-20", heureDebut: "08:00", heureFin: "10:00",
    salleId: "SALLE-AMPHI-A", surveillantIds: ["ENS-001"],
    statut: "PLANIFIE", noteSur: 20,
    instructions: "Documents non autorisés. Calculatrice interdite.",
  },
  {
    id: "EX-002", typeEvalId: "TE-SEQ3-DS", periodeId: "P-SEQ3",
    matiereId: "INF102", classeId: "L1-INFO-A",
    titre: "DS Prog. OO — Séquence 3",
    date: "2026-01-22", heureDebut: "14:00", heureFin: "16:00",
    salleId: "SALLE-LABO", surveillantIds: ["ENS-002"],
    statut: "PLANIFIE", noteSur: 20,
  },
  {
    id: "EX-003", typeEvalId: "TE-S1-EX", periodeId: "P-S1",
    matiereId: "INF301", classeId: "M1-INFO-A",
    titre: "Examen S1 — Intelligence Artificielle",
    date: "2026-01-15", heureDebut: "09:00", heureFin: "12:00",
    salleId: "SALLE-AMPHI-B", surveillantIds: ["ENS-003", "ENS-004"],
    statut: "TERMINE", noteSur: 20,
  },
];

// ─── Notes de démo ────────────────────────────────────────────────────────────

function makeNote(
  id: string,
  examenId: string,
  etudiantId: string,
  valeur: number | null,
  statut: NoteEntree["statut"] = "BROUILLON",
): NoteEntree {
  return {
    id, examenId, etudiantId, valeur,
    absent: valeur === null,
    statut,
    historique: [],
  };
}

const NOTES_MOCK: NoteEntree[] = [
  // EX-001 (DS Algo, L1-INFO-A, SEQ3)
  makeNote("N-001", "EX-001", "ETU-001", 14,   "BROUILLON"),
  makeNote("N-002", "EX-001", "ETU-002", 17,   "BROUILLON"),
  makeNote("N-003", "EX-001", "ETU-009", 13.5, "BROUILLON"),
  makeNote("N-004", "EX-001", "ETU-003", null, "BROUILLON"), // absent

  // EX-003 (Examen S1, M1-INFO-A) — Validé
  makeNote("N-010", "EX-003", "ETU-006", 17.5, "VALIDE"),
  makeNote("N-011", "EX-003", "ETU-012", 15.5, "VALIDE"),
];

// ─── Export ───────────────────────────────────────────────────────────────────

export const EVAL_MOCK: Pick<
  EvaluationState,
  "systemes" | "periodes" | "typesEval" | "examens" | "notes"
> = {
  systemes: [SYS_SEQ, SYS_SEM, SYS_PERSO],
  periodes: PERIODES,
  typesEval: TYPES_EVAL,
  examens: EXAMENS,
  notes: NOTES_MOCK,
};

// ─── Labels utilitaires ────────────────────────────────────────────────────────

export const SYSTEM_TEMPLATES = [
  {
    type: "SEQUENCES_TRIMESTRES" as const,
    label: "Séquences & Trimestres",
    icon: "Layers",
    description: "6 séquences regroupées en 3 trimestres. Courant en Afrique francophone.",
    exemple: ["Séquence 1", "Séquence 2", "Trimestre 1 (moy S1+S2)", "Séquence 3", "…"],
    couleur: "var(--blue)",
  },
  {
    type: "SEMESTRIEL" as const,
    label: "Semestriel (LMD)",
    icon: "Calendar",
    description: "CC + Examen par semestre. Standard LMD universitaire.",
    exemple: ["CC (30%)", "Examen semestriel (70%)", "Semestre 1", "Semestre 2"],
    couleur: "var(--cyan)",
  },
  {
    type: "PERSONNALISE" as const,
    label: "Système personnalisé",
    icon: "Settings2",
    description: "Définissez entièrement votre propre structure d'évaluation.",
    exemple: ["TP (20%)", "Interrogation (20%)", "Projet (10%)", "Examen (50%)"],
    couleur: "var(--purple)",
  },
];
