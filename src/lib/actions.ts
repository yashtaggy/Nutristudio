'use server';

import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { profileSchema } from './schemas';
import { updateUserProfile } from './firebase/firestore';
import { contextualMealRecommendation, generateFullDayMealPlan, type ContextualMealRecommendationInput, type FullDayMealPlanInput } from '@/ai/flows';

const updateProfileSchema = profileSchema.extend({
  uid: z.string(),
  email: z.string().email(),
});

type ActionResponse = {
  success: boolean;
  error?: string;
};

export async function updateProfileAction(
  data: z.infer<typeof updateProfileSchema>
): Promise<ActionResponse> {
  const validation = updateProfileSchema.safeParse(data);
  if (!validation.success) {
    return { success: false, error: 'Invalid data provided.' };
  }

  const { uid, ...profileData } = validation.data;

  try {
    await updateUserProfile(uid, {
        uid,
        ...profileData,
        age: profileData.age ? Number(profileData.age) : undefined,
    });
    revalidatePath('/profile');
    revalidatePath('/dashboard');
    return { success: true };
  } catch (error) {
    console.error('Failed to update profile:', error);
    return { success: false, error: 'Failed to update profile in database.' };
  }
}

export async function getMealRecommendationAction(input: ContextualMealRecommendationInput) {
  try {
    const recommendation = await contextualMealRecommendation(input);
    return { success: true, data: recommendation };
  } catch (error) {
    console.error('Error getting meal recommendation:', error);
    return { success: false, error: 'Failed to generate recommendation. Please try again.' };
  }
}

export async function getFullDayMealPlanAction(input: FullDayMealPlanInput) {
  try {
    const plan = await generateFullDayMealPlan(input);
    return { success: true, data: plan };
  } catch (error) {
    console.error('Error getting meal plan:', error);
    return { success: false, error: 'Failed to generate meal plan. Please try again.' };
  }
}
