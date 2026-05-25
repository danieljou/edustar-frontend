import { StatCard } from "@/components/shared/StatCard";
import { GraduationCap, CreditCard, ClipboardList, UserCheck, Users, TrendingUp } from "lucide-react";
import { STUDENTS, PAYMENTS, ADMISSIONS, PERSONNEL } from "@/constants/mock-data";
import { formatCurrency } from "@/lib/utils";

export function KpiSection() {
  const totalStudents = STUDENTS.length;
  const activeStudents = STUDENTS.filter(s => s.statut === "Actif").length;
  const pendingAdmissions = ADMISSIONS.filter(a => a.statut === "En attente").length;
  const totalPayments = PAYMENTS.filter(p => p.statut === "Validé").reduce((s, p) => s + p.montant, 0);
  const debtStudents = STUDENTS.filter(s => s.solde > 0).length;
  const totalStaff = PERSONNEL.filter(p => p.statut === "Actif").length;

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-3.5 mb-5">
      <StatCard
        label="Étudiants inscrits"
        value={totalStudents}
        trend={{ value: `${activeStudents} actifs`, up: true }}
        accent="blue"
        icon={<GraduationCap className="w-4 h-4" />}
      />
      <StatCard
        label="Admissions en attente"
        value={pendingAdmissions}
        trend={{ value: "Ce mois", neutral: true }}
        accent="amber"
        icon={<ClipboardList className="w-4 h-4" />}
      />
      <StatCard
        label="Revenus collectés"
        value={formatCurrency(totalPayments).split(" ")[0]}
        trend={{ value: "+12% vs mois dernier", up: true }}
        accent="green"
        icon={<CreditCard className="w-4 h-4" />}
      />
      <StatCard
        label="Taux de présence"
        value="84%"
        trend={{ value: "-2% cette semaine", up: false }}
        accent="cyan"
        icon={<UserCheck className="w-4 h-4" />}
      />
      <StatCard
        label="Soldes impayés"
        value={debtStudents}
        trend={{ value: "étudiants concernés", neutral: true }}
        accent="red"
        icon={<TrendingUp className="w-4 h-4" />}
      />
      <StatCard
        label="Personnel actif"
        value={totalStaff}
        trend={{ value: "dont 7 enseignants", neutral: true }}
        accent="purple"
        icon={<Users className="w-4 h-4" />}
      />
    </div>
  );
}
