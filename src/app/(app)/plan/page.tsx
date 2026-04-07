import MealPlanGenerator from "@/components/plan/meal-plan-generator";

export default function PlanPage() {
  return (
    <>
      <div className="flex items-center">
        <h1 className="font-headline text-lg font-semibold md:text-2xl">
          Daily Meal Planner
        </h1>
      </div>
      <div className="flex flex-1 items-start justify-center rounded-lg border border-dashed shadow-sm p-4 md:p-6">
        <MealPlanGenerator />
      </div>
    </>
  );
}
