/**
 * Moteur de calcul — pur, sans effets de bord.
 * S'adapte à n'importe quel système d'évaluation configuré.
 */
import type {
  TypeEvaluation,
  NoteEntree,
  ResultatMatiere,
  ResultatPeriode,
  ContributionEval,
  MentionInfo,
  ConfigValidation,
} from "@/types/evaluation";

// ─── Mentions ────────────────────────────────────────────────────────────────

const MENTIONS: MentionInfo[] = [
  { label: "Très bien",   couleur: "#0a7c4e", seuil: 16 },
  { label: "Bien",        couleur: "#0099cc", seuil: 14 },
  { label: "Assez bien",  couleur: "#1a3c8f", seuil: 12 },
  { label: "Passable",    couleur: "#b45309", seuil: 10 },
  { label: "Insuffisant", couleur: "#c0392b", seuil: 0  },
];

export function getMention(moy: number): MentionInfo {
  return MENTIONS.find(m => moy >= m.seuil) ?? MENTIONS[MENTIONS.length - 1];
}

export function getDecision(
  moy: number,
  creditsValides: number,
  totalCredits: number,
): string {
  if (moy >= 10 && creditsValides === totalCredits) return "Admis(e)";
  if (moy >= 10 && creditsValides < totalCredits) return "Admis(e) avec dettes";
  if (moy >= 8) return "Rattrapage";
  return "Ajourné(e)";
}

export function getStatutMatiere(moy: number): ResultatMatiere["statut"] {
  if (moy >= 10) return "VALIDE";
  if (moy >= 8) return "RATTRAPAGE";
  return "AJOURNE";
}

// ─── Validation de configuration ─────────────────────────────────────────────

export function validateTypesEvaluation(
  types: TypeEvaluation[],
): ConfigValidation {
  const actifs = types.filter(t => t.statut === "ACTIF");
  const total = actifs.reduce((acc, t) => acc + t.pourcentage, 0);
  const erreurs: string[] = [];
  const avertissements: string[] = [];

  if (Math.abs(total - 100) > 0.01) {
    erreurs.push(
      `Total des pourcentages = ${total.toFixed(1)}% (doit être 100%)`,
    );
  }
  if (actifs.length === 0) {
    erreurs.push("Aucun type d'évaluation actif défini.");
  }
  actifs.forEach(t => {
    if (t.pourcentage <= 0) {
      erreurs.push(`"${t.nom}" a un pourcentage nul ou négatif.`);
    }
    if (t.noteSur <= 0) {
      erreurs.push(`"${t.nom}" a une note maximale invalide.`);
    }
  });
  if (actifs.length === 1) {
    avertissements.push("Un seul type d'évaluation — pensez à en ajouter d'autres.");
  }

  return { valid: erreurs.length === 0, totalPourcentage: total, erreurs, avertissements };
}

// ─── Normalisation ────────────────────────────────────────────────────────────

/** Ramène une note à /20 quelle que soit sa base. */
export function normalizeTo20(valeur: number, sur: number): number {
  if (sur <= 0 || valeur < 0) return 0;
  return Math.min((valeur / sur) * 20, 20);
}

// ─── Calcul matière ───────────────────────────────────────────────────────────

export function calculateMoyenneMatiere(
  notes: NoteEntree[],
  typesEval: TypeEvaluation[],
  credits: number,
  coefficient: number,
  matiereId: string,
  matierenom: string,
): ResultatMatiere {
  const actifs = typesEval.filter(t => t.statut === "ACTIF");

  const contributions: ContributionEval[] = actifs.map(te => {
    const note = notes.find(n => !n.absent && n.valeur !== null);
    // Simulated: in real app, match note.examenId → examen.typeEvalId === te.id
    const noteForType = notes.find(n => n.examenId.includes(te.id));
    const valeurBrute = noteForType?.absent ? null : (noteForType?.valeur ?? null);
    const valeurSur20 = valeurBrute !== null
      ? normalizeTo20(valeurBrute, te.noteSur)
      : 0;
    const contribution = (valeurSur20 * te.pourcentage) / 100;
    // suppress unused
    void note;
    return {
      typeEvalId: te.id,
      typeEvalNom: te.nom,
      valeurBrute,
      valeurSur20,
      pourcentage: te.pourcentage,
      contribution,
    };
  });

  const moyenneSur20 = contributions.reduce((acc, c) => acc + c.contribution, 0);
  const pointsCoeff = moyenneSur20 * coefficient;
  const statut = getStatutMatiere(moyenneSur20);

  return {
    matiereId,
    matierenom,
    coefficient,
    contributions,
    moyenneSur20,
    pointsCoeff,
    statut,
    credits,
  };
}

// ─── Calcul période ───────────────────────────────────────────────────────────

/**
 * Calcule le résultat d'un étudiant pour une période donnée.
 * `resultatsMatiere` doit déjà être calculé via `calculateMoyenneMatiere`.
 */
export function calculateResultatPeriode(
  etudiantId: string,
  periodeId: string,
  resultatsMatiere: ResultatMatiere[],
  effectif: number,
  rang: number,
): ResultatPeriode {
  const totalCoeff = resultatsMatiere.reduce((acc, r) => acc + r.coefficient, 0);
  const totalPoints = resultatsMatiere.reduce((acc, r) => acc + r.pointsCoeff, 0);
  const moyenneGenerale = totalCoeff > 0 ? totalPoints / totalCoeff : 0;

  const creditsValides = resultatsMatiere
    .filter(r => r.statut === "VALIDE")
    .reduce((acc, r) => acc + r.credits, 0);
  const totalCredits = resultatsMatiere.reduce((acc, r) => acc + r.credits, 0);

  const mention = getMention(moyenneGenerale);
  const decision = getDecision(moyenneGenerale, creditsValides, totalCredits);

  const appreciation = buildAppreciation(moyenneGenerale, rang, effectif);

  return {
    etudiantId,
    periodeId,
    resultatsMatiere,
    totalCoeff,
    totalPoints,
    moyenneGenerale,
    rang,
    effectif,
    creditsValides,
    totalCredits,
    mention,
    appreciation,
    decision,
  };
}

function buildAppreciation(moy: number, rang: number, effectif: number): string {
  const rangStr = `${rang}e/${effectif}`;
  if (moy >= 16) return `Résultats excellents. Major potentiel (${rangStr}). Continuez.`;
  if (moy >= 14) return `Très bon travail. Rang ${rangStr}. Encouragements mérités.`;
  if (moy >= 12) return `Travail assez bien. Rang ${rangStr}. Des efforts restent possibles.`;
  if (moy >= 10) return `Résultats passables. Rang ${rangStr}. Efforts supplémentaires requis.`;
  if (moy >= 8)  return `Résultats insuffisants. Rang ${rangStr}. Passage en rattrapage.`;
  return `Résultats très insuffisants. Rang ${rangStr}. Situation critique.`;
}

// ─── Classement ───────────────────────────────────────────────────────────────

/**
 * Attribue les rangs à un groupe d'étudiants.
 * Ex-æquo = même rang, le suivant saute (1, 2, 2, 4…).
 */
export function assignRangs<T extends { moyenneGenerale: number; rang: number }>(
  resultats: T[],
): T[] {
  const sorted = [...resultats].sort((a, b) => b.moyenneGenerale - a.moyenneGenerale);
  let currentRang = 1;
  return sorted.map((r, i) => {
    if (i > 0 && sorted[i - 1].moyenneGenerale !== r.moyenneGenerale) {
      currentRang = i + 1;
    }
    return { ...r, rang: currentRang, effectif: sorted.length };
  });
}

// ─── Calcul agrégat (Trimestre = Séq1 + Séq2) ────────────────────────────────

/**
 * Calcule la moyenne d'une période agrégat en faisant la moyenne
 * pondérée de ses périodes filles.
 */
export function calculateMoyenneAgregat(
  resultatsFillesParEtu: Map<string, ResultatPeriode[]>,
): Map<string, number> {
  const result = new Map<string, number>();
  resultatsFillesParEtu.forEach((resultats, etudiantId) => {
    if (resultats.length === 0) { result.set(etudiantId, 0); return; }
    const moy =
      resultats.reduce((acc, r) => acc + r.moyenneGenerale, 0) / resultats.length;
    result.set(etudiantId, moy);
  });
  return result;
}

// ─── Utilitaires export ────────────────────────────────────────────────────────

export function formatNote(
  valeur: number | null,
  sur: number = 20,
  decimals: number = 2,
): string {
  if (valeur === null) return "—";
  return `${valeur.toFixed(decimals)}/${sur}`;
}

export function pourcentageColor(total: number): string {
  if (Math.abs(total - 100) < 0.01) return "var(--success)";
  if (total > 100) return "var(--danger)";
  return "var(--warning)";
}
