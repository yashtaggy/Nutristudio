'use server';
/**
 * @fileOverview Provides a Genkit flow for explaining meal recommendations.
 *
 * - explainMeal - A function that provides a detailed explanation for a recommended meal.
 * - ExplainMealInput - The input type for the explainMeal function.
 * - ExplainMealOutput - The return type for the explainMeal function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const ExplainMealInputSchema = z.object({
  mealName: z.string().describe('The name of the recommended meal.'),
  estimatedCost: z.number().describe('The estimated cost of the meal.'),
  userHealthGoal: z.string().describe('The user\'s health goal (e.g., weight loss, muscle gain, maintenance).'),
  userBudgetPreference: z.number().describe('The user\'s preferred budget for a meal.'),
  mealNutritionalInfo: z.string().describe('Detailed nutritional information for the meal (e.g., calories, protein, carbs, fat, fiber).'),
  mealIngredients: z.string().describe('A list of main ingredients in the meal.'),
  timeOfDay: z.string().describe('The time of day the meal is recommended for (e.g., morning, afternoon, evening, late night).'),
  userDietaryPreference: z.string().describe('The user\'s dietary preference (e.g., vegetarian, non-vegetarian).'),
});
export type ExplainMealInput = z.infer<typeof ExplainMealInputSchema>;

const ExplainMealOutputSchema = z.object({
  explanation: z.string().describe('A comprehensive explanation of why this meal was recommended, including nutritional benefits, alignment with health goals, and budget considerations.'),
  nutritionalBreakdown: z.string().describe('A summarized breakdown of the meal\'s key nutritional aspects relevant to the user\'s goal.'),
  alignmentDetails: z.string().describe('Specific details on how the meal aligns with the user\'s health goal, budget, time of day, and dietary preference.'),
});
export type ExplainMealOutput = z.infer<typeof ExplainMealOutputSchema>;

export async function explainMeal(input: ExplainMealInput): Promise<ExplainMealOutput> {
  return mealExplanationFlow(input);
}

const mealExplanationPrompt = ai.definePrompt({
  name: 'mealExplanationPrompt',
  input: { schema: ExplainMealInputSchema },
  output: { schema: ExplainMealOutputSchema },
  prompt: `You are an AI assistant specialized in explaining meal recommendations. Provide a clear, concise, and persuasive explanation for the following meal, focusing on its nutritional benefits, how it aligns with the user's personal health goals and budget, and why it's suitable for the given context.

User Profile:
- Health Goal: {{{userHealthGoal}}}
- Budget Preference: {{{userBudgetPreference}}} INR
- Dietary Preference: {{{userDietaryPreference}}}
- Time of Day: {{{timeOfDay}}}

Meal Details:
- Meal Name: {{{mealName}}}
- Estimated Cost: {{{estimatedCost}}} INR
- Nutritional Information: {{{mealNutritionalInfo}}}
- Main Ingredients: {{{mealIngredients}}}

Task:
Generate a detailed explanation structured into the following sections:
1.  **explanation**: Explain why this meal was recommended. Cover its nutritional benefits, how it supports the user's health goal, fits within their budget, and is appropriate for the time of day and dietary preference.
2.  **nutritionalBreakdown**: Provide a concise summary of the meal's key nutritional aspects (e.g., protein, fiber, or vitamins) and how they specifically benefit the user's health goal.
3.  alignmentDetails: Concisely list the top 3 reasons why this meal is a perfect fit for the user's specific context (goal, budget, and time of day).
`,
});

const mealExplanationFlow = ai.defineFlow(
  {
    name: 'mealExplanationFlow',
    inputSchema: ExplainMealInputSchema,
    outputSchema: ExplainMealOutputSchema,
  },
  async (input) => {
    const { output } = await mealExplanationPrompt(input);
    if (!output) {
      throw new Error('Failed to generate meal explanation.');
    }
    return output;
  }
);