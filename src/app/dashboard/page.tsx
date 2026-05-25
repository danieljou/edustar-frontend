import { KpiSection } from "@/components/dashboard/KpiSection";
import { AnalyticsChart } from "@/components/dashboard/AnalyticsChart";
import { ActivityFeed } from "@/components/dashboard/ActivityFeed";
import { QuickActions } from "@/components/dashboard/QuickActions";
import { RecentStudents } from "@/components/dashboard/RecentStudents";

export const metadata = { title: "Tableau de bord" };

export default function DashboardPage() {
  return (
    <div className="space-y-4 md:space-y-5">
      <KpiSection />

      {/* Charts + quick actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-5">
        <div className="lg:col-span-2 min-w-0">
          <AnalyticsChart />
        </div>
        <div className="min-w-0">
          <QuickActions />
        </div>
      </div>

      {/* Recent students + activity */}
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
