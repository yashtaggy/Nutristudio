import GamificationWidgets from "@/components/dashboard/gamification-widgets";
import RecommendationEngine from "@/components/dashboard/recommendation-engine";

export default function DashboardPage() {
  return (
    <>
      <div className="flex items-center">
        <h1 className="font-headline text-lg font-semibold md:text-2xl">
          Dashboard
        </h1>
      </div>
      <GamificationWidgets />
      <div className="flex flex-1 items-start justify-center rounded-lg border border-dashed shadow-sm p-4 md:p-6">
        <RecommendationEngine />
      </div>
    </>
  );
}
