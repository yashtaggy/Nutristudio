'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useAuth } from '@/components/providers/auth-provider';
import { getFullDayMealPlanAction } from '@/lib/actions';
import type { FullDayMealPlanOutput } from '@/ai/flows';
import { Apple, Sparkles } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import LoadingSpinner from '../shared/loading-spinner';
import { Skeleton } from '../ui/skeleton';
import MealPlanDisplay from './meal-plan-display';
import { Textarea } from '../ui/textarea';

type FormValues = {
  budget: number;
  availableIngredients: string;
};

export default function MealPlanGenerator() {
  const { profile } = useAuth();
  const { toast } = useToast();
  const [mealPlan, setMealPlan] = useState<FullDayMealPlanOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<FormValues>({
    defaultValues: {
      budget: 500,
      availableIngredients: '',
    },
  });

  const onSubmit = async (values: FormValues) => {
    if (!profile?.healthGoal || !profile.dietaryPreference) {
      toast({
        variant: 'destructive',
        title: 'Profile incomplete',
        description: 'Please set your health goal and dietary preference in your profile.',
      });
      return;
    }

    setIsLoading(true);
    setMealPlan(null);

    const input = {
      budget: Number(values.budget),
      healthGoal: profile.healthGoal,
      dietaryPreference: profile.dietaryPreference,
      age: profile.age,
      availableIngredients: values.availableIngredients.split(',').map(s => s.trim()).filter(Boolean),
    };

    const result = await getFullDayMealPlanAction(input);
    if (result.success && result.data) {
      setMealPlan(result.data);
    } else {
      toast({
        variant: 'destructive',
        title: 'Plan Generation Failed',
        description: result.error || 'Could not generate a meal plan.',
      });
    }
    setIsLoading(false);
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 font-headline">
            <Apple className="h-6 w-6 text-primary" />
            Budget Meal Plan
          </CardTitle>
          <CardDescription>Generate a full day of healthy meals within your budget.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="budget"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Daily Budget (₹)</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="500" {...field} onChange={e => field.onChange(Number(e.target.value))}/>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
               <FormField
                control={form.control}
                name="availableIngredients"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Available Ingredients (Optional)</FormLabel>
                    <FormControl>
                      <Textarea placeholder="e.g., chicken, rice, tomatoes" {...field} />
                    </FormControl>
                    <FormDescription>Separate ingredients with a comma.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" disabled={isLoading} className="w-full md:w-auto">
                {isLoading ? <LoadingSpinner className="mr-2" /> : <Sparkles className="mr-2 h-4 w-4" />}
                Generate Plan
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      {isLoading && (
        <div className="mt-8 space-y-6">
           <Skeleton className="h-10 w-1/2" />
           <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <Skeleton className="h-64 w-full" />
                <Skeleton className="h-64 w-full" />
                <Skeleton className="h-64 w-full" />
           </div>
        </div>
      )}

      {mealPlan && <MealPlanDisplay plan={mealPlan} />}
    </div>
  );
}
