import { KpiSection } from "@/components/dashboard/KpiSection";
import { AnalyticsChart } from "@/components/dashboard/AnalyticsChart";
import { ActivityFeed } from "@/components/dashboard/ActivityFeed";
import { QuickActions } from "@/components/dashboard/QuickActions";
import { RecentStudents } from "@/components/dashboard/RecentStudents";

export const metadata = { title: "Tableau de bord" };

export default function DashboardPage() {
  return (
    <div>
      <KpiSection />

      {/* Charts + quick actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 mb-5">
        <div className="lg:col-span-2">
          <AnalyticsChart />
        </div>
        <QuickActions />
      </div>

      {/* Recent students + activity */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
        <div className="xl:col-span-2">
          <RecentStudents />
        </div>
        <ActivityFeed />
      </div>
    </div>
  );
}
