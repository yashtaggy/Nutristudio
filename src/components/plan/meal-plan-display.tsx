import type { FullDayMealPlanOutput, MealDetail } from "@/ai/flows";
import { Badge } from "../ui/badge";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../ui/card";
import { CheckCircle, Info, TrendingUp, Wallet } from "lucide-react";

const MealCard = ({ title, meal }: { title: string, meal: MealDetail }) => (
    <Card>
        <CardHeader>
            <CardTitle className="font-headline">{title}</CardTitle>
            <CardDescription>{meal.mealName}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-muted-foreground">Est. Cost</span>
                <Badge variant="secondary">₹{meal.estimatedCost}</Badge>
            </div>
             <div className="flex items-start gap-2 text-sm text-muted-foreground">
                <Info className="h-4 w-4 mt-1 shrink-0 text-primary" />
                <p>{meal.nutritionalReasoning}</p>
            </div>
        </CardContent>
        <CardFooter>
            <p className="text-xs text-muted-foreground">Alternatives: {meal.alternatives.join(', ')}</p>
        </CardFooter>
    </Card>
)

export default function MealPlanDisplay({ plan }: { plan: FullDayMealPlanOutput }) {
  return (
    <div className="mt-8 space-y-8">
        <div className="grid gap-4 md:grid-cols-2">
             <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Estimated Cost</CardTitle>
                    <Wallet className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">₹{plan.totalEstimatedCost}</div>
                    <Badge variant={plan.isWithinBudget ? "default" : "destructive"}>{plan.isWithinBudget ? "Within Budget" : "Over Budget"}</Badge>
                </CardContent>
            </Card>
             <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Nutritional Summary</CardTitle>
                    <TrendingUp className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <p className="text-sm text-muted-foreground">{plan.nutritionalBalanceSummary}</p>
                </CardContent>
            </Card>
        </div>


      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <MealCard title="Breakfast" meal={plan.breakfast} />
        <MealCard title="Lunch" meal={plan.lunch} />
        <MealCard title="Dinner" meal={plan.dinner} />
      </div>
    </div>
  );
}
