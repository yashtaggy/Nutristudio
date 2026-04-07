'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Slider } from '@/components/ui/slider';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useAuth } from '@/components/providers/auth-provider';
import { getMealRecommendationAction } from '@/lib/actions';
import type { ContextualMealRecommendationOutput } from '@/ai/flows';
import { Skeleton } from '../ui/skeleton';
import RecommendationCard from './recommendation-card';
import { BotMessageSquare, Sparkles } from 'lucide-react';
import { TIME_OF_DAY_OPTIONS, HUNGER_LEVELS } from '@/lib/constants';
import LoadingSpinner from '../shared/loading-spinner';
import { useToast } from '@/hooks/use-toast';

type FormValues = {
  timeOfDay: 'morning' | 'afternoon' | 'evening' | 'late night';
  budget: number;
  hungerLevel: 'low' | 'medium' | 'high';
  availableIngredients: string;
};

export default function RecommendationEngine() {
  const { profile } = useAuth();
  const { toast } = useToast();
  const [recommendation, setRecommendation] = useState<ContextualMealRecommendationOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<FormValues>({
    defaultValues: {
      timeOfDay: 'afternoon',
      budget: 150,
      hungerLevel: 'medium',
      availableIngredients: '',
    },
  });

  const onSubmit = async (values: FormValues) => {
    if (!profile?.healthGoal) {
      toast({
        variant: "destructive",
        title: "Profile incomplete",
        description: "Please set your health goal in your profile first.",
      });
      return;
    }

    setIsLoading(true);
    setRecommendation(null);
    const input = {
      ...values,
      healthGoal: profile.healthGoal,
      availableIngredients: values.availableIngredients.split(',').map(s => s.trim()).filter(Boolean),
    };

    const result = await getMealRecommendationAction(input);
    if (result.success && result.data) {
      setRecommendation(result.data);
    } else {
      toast({
        variant: 'destructive',
        title: 'Recommendation Failed',
        description: result.error || 'Could not generate a meal recommendation.',
      });
    }
    setIsLoading(false);
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-4 md:p-6 wavy-bg rounded-3xl min-h-[500px]">
      <Card className="w-full card-gamified border-primary/20 backdrop-blur-sm bg-white/80">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 animate-float bg-primary/10 p-4 rounded-full w-fit group-hover:bg-primary/20 transition-colors">
            <BotMessageSquare className="h-10 w-10 text-primary" />
          </div>
          <CardTitle className="text-3xl font-bold font-headline text-gradient tracking-tight">
            Smart Meal Finder
          </CardTitle>
          <CardDescription className="text-lg font-medium text-muted-foreground/80 italic mt-2">
            "I'm so hungry I could eat a digital apple!" 🍎
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <FormField
                  control={form.control}
                  name="timeOfDay"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Time of Day</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger><SelectValue /></SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {TIME_OF_DAY_OPTIONS.map(opt => <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>)}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="hungerLevel"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Hunger Level</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger><SelectValue /></SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {HUNGER_LEVELS.map(opt => <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>)}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="budget"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Budget (₹ {field.value})</FormLabel>
                      <FormControl>
                        <Slider
                          min={50}
                          max={500}
                          step={10}
                          defaultValue={[field.value]}
                          onValueChange={(value) => field.onChange(value[0])}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
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
              <Button type="submit" disabled={isLoading} className="w-full md:w-auto button-gamified text-lg h-12 px-8 font-bold">
                {isLoading ? <LoadingSpinner className="mr-2" /> : <Sparkles className="mr-2 h-5 w-5" />}
                Nudge Me! 🚀
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      {isLoading && (
        <div className="mt-8 space-y-4">
          <Skeleton className="h-24 w-full" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Skeleton className="h-20 w-full" />
            <Skeleton className="h-20 w-full" />
            <Skeleton className="h-20 w-full" />
          </div>
        </div>
      )}

      {recommendation && (
        <div className="mt-8">
          <h2 className="text-2xl font-headline mb-4">Your Top Recommendation</h2>
          <RecommendationCard isPrimary meal={recommendation} />

          <h3 className="text-xl font-headline mt-8 mb-4">Alternatives</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {recommendation.alternatives.map((alt, index) => (
              <RecommendationCard key={index} meal={alt} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
