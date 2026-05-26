"use client";
import { useState, useMemo } from "react";
import { StatCard } from "@/components/shared/StatCard";
import {
  GraduationCap,
  CreditCard,
  UserCheck,
  TrendingUp,
  Award,
  Users,
  FileText,
  AlertTriangle,
  SlidersHorizontal,
  RotateCcw,
} from "lucide-react";
import { STUDENTS, PAYMENTS, PERSONNEL, ADMISSIONS, MORATORIUMS } from "@/constants/mock-data";
import { formatCurrency, cn } from "@/lib/utils";

const FILIERES = ["Toutes", "Informatique", "Gestion", "Droit"] as const;
const PERIODES = ["Mois", "Trimestre", "Semestre", "Année"] as const;
const STATUTS = ["Tous", "Actif", "Suspendu"] as const;

type Filiere = (typeof FILIERES)[number];
type Periode = (typeof PERIODES)[number];
type StatutFilter = (typeof STATUTS)[number];

const PERIODE_BADGE: Record<string, string> = {
  Mois: "Janv. – Fév. 2026",
  Trimestre: "Jan. – Mar. 2026",
  Semestre: "Sep. 2025 – Mar. 2026",
  Année: "Session 2025–2026",
};

export function DashboardStats() {
  const [filiere, setFiliere] = useState<Filiere>("Toutes");
  const [periode, setPeriode] = useState<Periode>("Semestre");
  const [statut, setStatut] = useState<StatutFilter>("Tous");

  const isFiltered = filiere !== "Toutes" || statut !== "Tous" || periode !== "Semestre";

  const students = useMemo(
    () =>
      STUDENTS.filter(
        (s) =>
          (filiere === "Toutes" || s.filiere === filiere) &&
          (statut === "Tous" || s.statut === statut)
      ),
    [filiere, statut]
  );

  const filteredPayments = useMemo(() => {
    const codes = new Set(students.map((s) => s.code));
    return PAYMENTS.filter((p) => codes.has(p.etuCode));
  }, [students]);

  const totalCollected = filteredPayments
    .filter((p) => p.statut === "Validé")
    .reduce((s, p) => s + p.montant, 0);
  const totalDebt = students.reduce((s, st) => s + st.solde, 0);
  const tauxRecouvrement =
    totalCollected + totalDebt > 0
      ? Math.round((totalCollected / (totalCollected + totalDebt)) * 100)
      : 0;

  const studentsWithMoy = students.filter((s) => s.moy > 0);
  const tauxReussite =
    studentsWithMoy.length > 0
      ? Math.round(
          (studentsWithMoy.filter((s) => s.moy >= 10).length / studentsWithMoy.length) * 100
        )
      : 0;

  const avgAbsences =
    students.length > 0
      ? students.reduce((s, st) => s + st.absences, 0) / students.length
      : 0;
  const tauxPresence = Math.max(0, Math.round(((48 - avgAbsences) / 48) * 100));

  const debtStudents = students.filter((s) => s.solde > 0).length;

  const totalStaff = PERSONNEL.filter((p) => p.statut === "Actif").length;
  const tauxAbsStaff = Math.round(
    (PERSONNEL.filter((p) => p.statut === "Congé").length / PERSONNEL.length) * 100
  );

  const admissionsEnAttente = ADMISSIONS.filter((a) => a.statut === "En attente").length;
  const admissionsValidees = ADMISSIONS.filter((a) => a.statut === "Validé").length;

  const moratoriumsCritiques = MORATORIUMS.filter(
    (m) => m.statut === "Critique" || m.statut === "En retard"
  ).length;

  const kpis = [
    {
      label: "Étudiants inscrits",
      value: students.length,
      trend: { value: `${students.filter((s) => s.statut === "Actif").length} actifs`, up: true },
      accent: "blue" as const,
      icon: <GraduationCap className="w-4 h-4" />,
    },
    {
      label: "Taux de recouvrement",
      value: `${tauxRecouvrement}%`,
      trend: {
        value: tauxRecouvrement >= 80 ? "Objectif atteint" : "Seuil alerte < 80%",
        up: tauxRecouvrement >= 80,
      },
      accent: (tauxRecouvrement >= 80 ? "green" : "red") as "green" | "red",
      icon: <CreditCard className="w-4 h-4" />,
    },
    {
      label: "Taux de réussite",
      value: `${tauxReussite}%`,
      trend: {
        value: tauxReussite >= 70 ? "Session correcte" : "Seuil alerte < 70%",
        up: tauxReussite >= 70,
      },
      accent: (tauxReussite >= 70 ? "green" : "amber") as "green" | "amber",
      icon: <Award className="w-4 h-4" />,
    },
    {
      label: "Taux de présence",
      value: `${tauxPresence}%`,
      trend: {
        value: tauxPresence >= 85 ? "Satisfaisant" : "Seuil alerte < 85%",
        up: tauxPresence >= 85,
      },
      accent: (tauxPresence >= 85 ? "cyan" : "amber") as "cyan" | "amber",
      icon: <UserCheck className="w-4 h-4" />,
    },
    {
      label: "Soldes impayés",
      value: debtStudents,
      trend: { value: `${formatCurrency(totalDebt)} total`, neutral: true },
      accent: "red" as const,
      icon: <TrendingUp className="w-4 h-4" />,
    },
    {
      label: "Absentéisme staff",
      value: `${tauxAbsStaff}%`,
      trend: { value: `${totalStaff} actifs / ${PERSONNEL.length}`, neutral: true },
      accent: (tauxAbsStaff > 5 ? "amber" : "purple") as "amber" | "purple",
      icon: <Users className="w-4 h-4" />,
    },
    {
      label: "Admissions en attente",
      value: admissionsEnAttente,
      trend: { value: `${admissionsValidees} validées cette session`, up: true },
      accent: "cyan" as const,
      icon: <FileText className="w-4 h-4" />,
    },
    {
      label: "Moratoriums à risque",
      value: moratoriumsCritiques,
      trend: {
        value: `${MORATORIUMS.length} morat. actifs`,
        up: moratoriumsCritiques === 0,
      },
      accent: (moratoriumsCritiques > 0 ? "amber" : "green") as "amber" | "green",
      icon: <AlertTriangle className="w-4 h-4" />,
    },
  ];

  return (
    <div className="space-y-3.5">
      {/* Filter bar */}
      <div className="bg-white border border-[var(--line)] rounded-[14px] px-4 py-3 flex flex-wrap items-center gap-x-4 gap-y-2.5">
        <div className="flex items-center gap-1.5 shrink-0">
          <SlidersHorizontal className="w-3.5 h-3.5 text-[var(--blue)]" />
          <span className="text-[11px] font-bold text-[var(--ink)]">Filtres</span>
          {isFiltered && (
            <span className="text-[9.5px] font-bold bg-[var(--blue)] text-white rounded-full px-1.5 py-0.5 leading-none">
              actifs
            </span>
          )}
        </div>

        <div className="hidden sm:block h-4 w-px bg-[var(--line)]" />

        {/* Filière */}
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-[9.5px] font-bold text-[var(--ink-4)] uppercase tracking-[0.08em]">
            Filière
          </span>
          <div className="flex items-center gap-0.5">
            {FILIERES.map((f) => (
              <button
                key={f}
                onClick={() => setFiliere(f)}
                className={cn(
                  "px-2.5 py-1 rounded-[6px] text-[11px] font-semibold transition-all duration-150",
                  filiere === f
                    ? "bg-[var(--blue)] text-white shadow-sm"
                    : "text-[var(--ink-4)] hover:bg-[var(--ivory)] hover:text-[var(--ink)]"
                )}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        <div className="hidden sm:block h-4 w-px bg-[var(--line)]" />

        {/* Période */}
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-[9.5px] font-bold text-[var(--ink-4)] uppercase tracking-[0.08em]">
            Période
          </span>
          <div className="flex items-center gap-0.5">
            {PERIODES.map((p) => (
              <button
                key={p}
                onClick={() => setPeriode(p)}
                className={cn(
                  "px-2.5 py-1 rounded-[6px] text-[11px] font-semibold transition-all duration-150",
                  periode === p
                    ? "bg-[var(--blue-light)] text-[var(--blue)]"
                    : "text-[var(--ink-4)] hover:bg-[var(--ivory)]"
                )}
              >
                {p}
              </button>
            ))}
          </div>
        </div>

        <div className="hidden sm:block h-4 w-px bg-[var(--line)]" />

        {/* Statut */}
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-[9.5px] font-bold text-[var(--ink-4)] uppercase tracking-[0.08em]">
            Statut
          </span>
          <div className="flex items-center gap-0.5">
            {STATUTS.map((s) => (
              <button
                key={s}
                onClick={() => setStatut(s)}
                className={cn(
                  "px-2.5 py-1 rounded-[6px] text-[11px] font-semibold transition-all duration-150",
                  statut === s
                    ? "bg-[var(--blue-light)] text-[var(--blue)]"
                    : "text-[var(--ink-4)] hover:bg-[var(--ivory)]"
                )}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        {/* Période badge + reset */}
        <div className="ml-auto flex items-center gap-2 shrink-0">
          <span className="text-[10px] text-[var(--ink-4)] hidden md:block">
            {PERIODE_BADGE[periode]}
          </span>
          {isFiltered && (
            <button
              onClick={() => {
                setFiliere("Toutes");
                setPeriode("Semestre");
                setStatut("Tous");
              }}
              className="flex items-center gap-1 text-[10.5px] font-semibold text-[var(--danger)] hover:opacity-70 transition-opacity"
            >
              <RotateCcw className="w-3 h-3" />
              Réinitialiser
            </button>
          )}
        </div>
      </div>

      {/* KPI grid — 2 cols mobile, 4 cols sm+  */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
        {kpis.map((kpi) => (
          <StatCard
            key={kpi.label}
            label={kpi.label}
            value={kpi.value}
            trend={kpi.trend}
            accent={kpi.accent}
            icon={kpi.icon}
          />
        ))}
      </div>
    </div>
  );
}
