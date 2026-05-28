"use client";
import { useTranslation } from "react-i18next";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { ACTIVITY_FEED } from "@/constants/mock-data";
import { cn } from "@/lib/utils";

export function ActivityFeed() {
  const { t } = useTranslation("dashboard");

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("sections.activityFeed")}</CardTitle>
        <span className="text-[10.5px] text-[var(--ink-4)]">{t("activityFeed.today")}</span>
      </CardHeader>
      <CardContent className="p-0">
        <div className="divide-y divide-[var(--line)]">
          {ACTIVITY_FEED.map((item) => (
            <div key={item.id} className="flex items-start gap-3 px-[18px] py-3.5 hover:bg-[var(--blue-lighter)] transition-colors cursor-pointer">
              <div className={cn("w-2 h-2 rounded-full mt-1.5 shrink-0", item.color)} />
              <div className="flex-1 min-w-0">
                <p className="text-[12.5px] font-medium text-[var(--ink)] leading-snug">{item.text}</p>
                <p className="text-[11px] text-[var(--ink-4)] mt-0.5">{item.time}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
