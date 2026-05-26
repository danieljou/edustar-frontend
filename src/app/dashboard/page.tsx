import { DashboardStats } from "@/components/dashboard/DashboardStats";
import { AnalyticsChart } from "@/components/dashboard/AnalyticsChart";
import { ActivityFeed } from "@/components/dashboard/ActivityFeed";
import { QuickActions } from "@/components/dashboard/QuickActions";
import { RecentStudents } from "@/components/dashboard/RecentStudents";
import { FinancialSummary } from "@/components/dashboard/FinancialSummary";
import { ClassPerformance } from "@/components/dashboard/ClassPerformance";

export const metadata = { title: "Tableau de bord" };

export default function DashboardPage() {
  return (
    <div className="space-y-4 md:space-y-5">
      {/* Filtres + KPIs */}
      <DashboardStats />

      {/* Graphique principal + actions rapides */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-5">
        <div className="lg:col-span-2 min-w-0">
          <AnalyticsChart />
        </div>
        <div className="min-w-0">
          <QuickActions />
        </div>
      </div>

      {/* Synthèse financière + performance classes */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-5">
        <FinancialSummary />
        <ClassPerformance />
      </div>

      {/* Étudiants récents + activité */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 md:gap-5">
        <div className="xl:col-span-2 min-w-0">
          <RecentStudents />
        </div>
        <div className="min-w-0">
          <ActivityFeed />
        </div>
      </div>
    </div>
  );
}
