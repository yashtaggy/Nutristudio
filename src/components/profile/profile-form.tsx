'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAuth } from '@/components/providers/auth-provider';
import { profileSchema, type ProfileFormValues } from '@/lib/schemas';
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
import { DIETARY_PREFERENCES, HEALTH_GOALS } from '@/lib/constants';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { updateProfileAction } from '@/lib/actions';
import { useRouter } from 'next/navigation';
import LoadingSpinner from '../shared/loading-spinner';

export default function ProfileForm() {
  const { user, profile, refetchProfile } = useAuth();
  const { toast } = useToast();
  const router = useRouter();
  
  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: profile?.name || user?.displayName || '',
      age: profile?.age || '',
      dietaryPreference: profile?.dietaryPreference || 'no preference',
      healthGoal: profile?.healthGoal || 'maintenance',
    },
  });

  const { isSubmitting } = form.formState;

  async function onSubmit(values: ProfileFormValues) {
    if (!user) {
      toast({ variant: 'destructive', description: 'You must be logged in.' });
      return;
    }
    const result = await updateProfileAction({ uid: user.uid, email: user.email!, ...values });

    if (result.success) {
      toast({
        title: 'Profile Updated',
        description: 'Your information has been saved successfully.',
      });
      refetchProfile(); // refetch profile data
      router.push('/dashboard');
    } else {
      toast({
        variant: 'destructive',
        title: 'Update Failed',
        description: result.error || 'An unknown error occurred.',
      });
    }
  }
  
  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle>Tell us about yourself</CardTitle>
        <CardDescription>This helps us create personalized recommendations for you.</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Your name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="age"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Age (Optional)</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="Your age" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="dietaryPreference"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Dietary Preference</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select your dietary preference" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {DIETARY_PREFERENCES.map((pref) => (
                        <SelectItem key={pref.value} value={pref.value}>
                          {pref.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="healthGoal"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Health Goal</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select your main health goal" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {HEALTH_GOALS.map((goal) => (
                        <SelectItem key={goal.value} value={goal.value}>
                          {goal.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    This will tailor recommendations to help you achieve your goal.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting && <LoadingSpinner className="mr-2 h-4 w-4" />}
              Save & Continue
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
