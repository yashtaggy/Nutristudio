import { z } from 'zod';
import { DIETARY_PREFERENCES, HEALTH_GOALS } from './constants';

export const profileSchema = z.object({
  name: z.string().min(2, { message: 'Name must be at least 2 characters.' }),
  age: z.coerce.number().int().positive().min(1, "Please enter a valid age.").optional().or(z.literal('')),
  dietaryPreference: z.enum(DIETARY_PREFERENCES.map(p => p.value).filter((v): v is "veg" | "non-veg" | "vegan" | "pescatarian" | "no preference" => v !== undefined)),
  healthGoal: z.enum(HEALTH_GOALS.map(g => g.value).filter((v): v is "weight loss" | "muscle gain" | "maintenance" => v !== undefined)),
});

export type ProfileFormValues = z.infer<typeof profileSchema>;
