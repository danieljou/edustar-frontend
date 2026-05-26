// ─── Système d'évaluation dynamique ─────────────────────────────────────────
// Aucune structure codée en dur. Tout est configurable par l'établissement.

export type EvalSystemType =
  | "SEQUENCES_TRIMESTRES"
  | "SEMESTRIEL"
  | "PERSONNALISE";

export type PeriodeType =
  | "SEQUENCE"
  | "TRIMESTRE"
  | "SEMESTRE"
  | "CUSTOM";

/** Le système choisi pour une année / un niveau / une classe. */
export type SystemeEvaluation = {
  id: string;
  nom: string;
  type: EvalSystemType;
  description: string;
  anneeId: string;
  /** null = système global pour toute l'année */
  niveauId?: string;
  /** null = hérite du niveau */
  classeId?: string;
  actif: boolean;
};

/**
 * Période = unité de temps dans le système (Séquence, Trimestre, Semestre…).
 * Une période "agrégat" (Trimestre, Semestre) est calculée à partir de
 * ses périodes filles.
 */
export type Periode = {
  id: string;
  systemeId: string;
  nom: string;
  type: PeriodeType;
  ordre: number;
  dateDebut: string;
  dateFin: string;
  /** true = cette période résulte du calcul d'autres périodes */
  estAgregat: boolean;
  /** IDs des périodes élémentaires composant cet agrégat */
  periodesFilles: string[];
  statut: "A_VENIR" | "EN_COURS" | "CLOTUREE";
};

/**
 * Type d'évaluation : CC, Examen, TP, Interrogation, Projet…
 * Porte le pourcentage et le coefficient pour le calcul.
 */
export type TypeEvaluation = {
  id: string;
  systemeId: string;
  periodeId: string;
  /** null = s'applique à toutes les matières */
  matiereId?: string;
  /** null = hérite du niveau */
  classeId?: string;
  nom: string;
  abrev: string;
  pourcentage: number;   // 0–100, total de la période doit = 100
  coefficient: number;
  noteSur: number;       // base (ex. 20)
  ordre: number;
  obligatoire: boolean;
  statut: "ACTIF" | "INACTIF";
};

/** Examen planifié (issu d'un TypeEvaluation). */
export type Examen = {
  id: string;
  typeEvalId: string;
  periodeId: string;
  matiereId: string;
  classeId: string;
  titre: string;
  date: string;
  heureDebut: string;
  heureFin: string;
  salleId?: string;
  surveillantIds: string[];
  statut: "PLANIFIE" | "EN_COURS" | "TERMINE" | "ANNULE";
  noteSur: number;
  instructions?: string;
};

/** Note d'un étudiant pour un examen donné. */
export type NoteEntree = {
  id: string;
  examenId: string;
  etudiantId: string;
  valeur: number | null;   // null = absent ou non saisi
  absent: boolean;
  observation?: string;
  statut: "BROUILLON" | "SOUMIS" | "VALIDE" | "VERROUILLE";
  soumisLe?: string;
  valideParId?: string;
  historique: {
    valeur: number;
    modifieLe: string;
    modifieParId: string;
  }[];
};

// ─── Résultats calculés ───────────────────────────────────────────────────────

/** Contribution d'un type d'évaluation à la moyenne matière. */
export type ContributionEval = {
  typeEvalId: string;
  typeEvalNom: string;
  valeurBrute: number | null;   // valeur saisie
  valeurSur20: number;          // normalisée /20
  pourcentage: number;          // poids dans le calcul
  contribution: number;         // valeurSur20 * pourcentage / 100
};

/** Résultat d'un étudiant pour une matière sur une période. */
export type ResultatMatiere = {
  matiereId: string;
  matierenom: string;
  coefficient: number;
  contributions: ContributionEval[];
  moyenneSur20: number;
  pointsCoeff: number;         // moyenneSur20 * coefficient
  statut: "VALIDE" | "RATTRAPAGE" | "AJOURNE";
  credits: number;
};

/** Résultat global d'un étudiant sur une période. */
export type ResultatPeriode = {
  etudiantId: string;
  periodeId: string;
  resultatsMatiere: ResultatMatiere[];
  totalCoeff: number;
  totalPoints: number;
  moyenneGenerale: number;
  rang: number;                // calculé après tri de tous les étudiants
  effectif: number;
  creditsValides: number;
  totalCredits: number;
  mention: MentionInfo;
  appreciation: string;
  decision: string;
};

/** Bulletin dynamique : s'adapte à la structure du système choisi. */
export type BulletinDynamique = {
  id: string;
  etudiantId: string;
  anneeId: string;
  periodeId: string;
  periodeType: PeriodeType;
  resultat: ResultatPeriode;
  statut: "BROUILLON" | "PUBLIE";
  genereA?: string;
  signePar?: string;
};

// ─── Helpers types ─────────────────────────────────────────────────────────────

export type MentionInfo = {
  label: string;
  couleur: string;
  seuil: number;
};

export type ConfigValidation = {
  valid: boolean;
  totalPourcentage: number;
  erreurs: string[];
  avertissements: string[];
};

/** Conflit détecté dans la programmation des examens. */
export type ConflitExamen = {
  type: "SALLE" | "ENSEIGNANT" | "CLASSE" | "ETUDIANT";
  examen1Id: string;
  examen2Id: string;
  detail: string;
};

// ─── Store state shape ─────────────────────────────────────────────────────────

export type EvaluationState = {
  systemes: SystemeEvaluation[];
  periodes: Periode[];
  typesEval: TypeEvaluation[];
  examens: Examen[];
  notes: NoteEntree[];
  resultats: ResultatPeriode[];
  bulletins: BulletinDynamique[];
  // Sélections actives
  activeAnneeId: string;
  activeSystemeId: string | null;
  activePeriodeId: string | null;
};
