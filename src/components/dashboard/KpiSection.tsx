import { StatCard } from "@/components/shared/StatCard";
import { GraduationCap, CreditCard, UserCheck, TrendingUp, Award, Users } from "lucide-react";
import { STUDENTS, PAYMENTS, PERSONNEL } from "@/constants/mock-data";
import { formatCurrency } from "@/lib/utils";

export function KpiSection() {
  const totalStudents = STUDENTS.length;

  // Taux de recouvrement : encaissé / (encaissé + soldes impayés) — spec SMS-PAI
  const totalCollected = PAYMENTS.filter(p => p.statut === "Validé").reduce((s, p) => s + p.montant, 0);
  const totalDebt = STUDENTS.reduce((s, st) => s + st.solde, 0);
  const tauxRecouvrement = totalCollected + totalDebt > 0
    ? Math.round((totalCollected / (totalCollected + totalDebt)) * 100)
    : 0;

  // Taux de réussite : étudiants avec moy >= 10 / total — spec SMS-EXA
  const studentsWithMoy = STUDENTS.filter(s => s.moy > 0);
  const tauxReussite = studentsWithMoy.length > 0
    ? Math.round((studentsWithMoy.filter(s => s.moy >= 10).length / studentsWithMoy.length) * 100)
    : 0;

  // Taux de présence global estimé depuis les absences — spec SMS-PRE
  const avgAbsences = STUDENTS.length > 0
    ? STUDENTS.reduce((s, st) => s + st.absences, 0) / STUDENTS.length
    : 0;
  const TOTAL_SEANCES = 48; // sessions dans le semestre
  const tauxPresence = Math.max(0, Math.round(((TOTAL_SEANCES - avgAbsences) / TOTAL_SEANCES) * 100));

  // Soldes impayés
  const debtStudents = STUDENTS.filter(s => s.solde > 0).length;

  // Personnel actif
  const totalStaff = PERSONNEL.filter(p => p.statut === "Actif").length;
  const tauxAbsStaff = Math.round((PERSONNEL.filter(p => p.statut === "Congé").length / PERSONNEL.length) * 100);

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-3.5 mb-5">
      <StatCard
        label="Étudiants inscrits"
        value={totalStudents}
        trend={{ value: `${STUDENTS.filter(s => s.statut === "Actif").length} actifs`, up: true }}
        accent="blue"
        icon={<GraduationCap className="w-4 h-4" />}
      />
      <StatCard
        label="Taux de recouvrement"
        value={`${tauxRecouvrement}%`}
        trend={{ value: tauxRecouvrement >= 80 ? "Objectif atteint" : `Seuil alerte < 80%`, up: tauxRecouvrement >= 80 }}
        accent={tauxRecouvrement >= 80 ? "green" : "red"}
        icon={<CreditCard className="w-4 h-4" />}
      />
      <StatCard
        label="Taux de réussite"
        value={`${tauxReussite}%`}
        trend={{ value: tauxReussite >= 70 ? "Session correcte" : "Seuil alerte < 70%", up: tauxReussite >= 70 }}
        accent={tauxReussite >= 70 ? "green" : "amber"}
        icon={<Award className="w-4 h-4" />}
      />
      <StatCard
        label="Taux de présence"
        value={`${tauxPresence}%`}
        trend={{ value: tauxPresence >= 85 ? "Satisfaisant" : "Seuil alerte < 85%", up: tauxPresence >= 85 }}
        accent={tauxPresence >= 85 ? "cyan" : "amber"}
        icon={<UserCheck className="w-4 h-4" />}
      />
      <StatCard
        label="Soldes impayés"
        value={debtStudents}
        trend={{ value: `${formatCurrency(totalDebt)} total`, neutral: true }}
        accent="red"
        icon={<TrendingUp className="w-4 h-4" />}
      />
      <StatCard
        label="Absentéisme staff"
        value={`${tauxAbsStaff}%`}
        trend={{ value: `${totalStaff} actifs / ${PERSONNEL.length}`, neutral: true }}
        accent={tauxAbsStaff > 5 ? "amber" : "purple"}
        icon={<Users className="w-4 h-4" />}
      />
    </div>
  );
}
