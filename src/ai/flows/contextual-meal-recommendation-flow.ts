'use server';
/**
 * @fileOverview This file implements a Genkit flow for generating personalized meal recommendations.
 *
 * - contextualMealRecommendation - A function that handles the contextual meal recommendation process.
 * - ContextualMealRecommendationInput - The input type for the contextualMealRecommendation function.
 * - ContextualMealRecommendationOutput - The return type for the contextualMealRecommendation function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const ContextualMealRecommendationInputSchema = z.object({
  timeOfDay: z.enum(['morning', 'afternoon', 'evening', 'late night']).describe('Current time of day.'),
  budget: z.number().describe('The user\'s budget for the meal in rupees.'),
  healthGoal: z.enum(['weight loss', 'muscle gain', 'normal']).describe('The user\'s health goal.'),
  hungerLevel: z.enum(['low', 'medium', 'high']).describe('The user\'s current hunger level.'),
  availableIngredients: z.array(z.string()).optional().describe('An optional list of ingredients the user has available.'),
});
export type ContextualMealRecommendationInput = z.infer<typeof ContextualMealRecommendationInputSchema>;

const MealAlternativeSchema = z.object({
  mealName: z.string().describe('The name of the alternative meal.'),
  estimatedCost: z.number().describe('The estimated cost of the alternative meal in rupees.'),
  nutritionalReasoning: z.string().describe('The nutritional reasoning for recommending this alternative meal.'),
});

const ContextualMealRecommendationOutputSchema = z.object({
  mealName: z.string().describe('The name of the recommended meal.'),
  estimatedCost: z.number().describe('The estimated cost of the recommended meal in rupees.'),
  nutritionalReasoning: z.string().describe('The nutritional reasoning for recommending this meal.'),
  alternatives: z.array(MealAlternativeSchema).min(2).max(3).describe('2-3 alternative meal suggestions.'),
});
export type ContextualMealRecommendationOutput = z.infer<typeof ContextualMealRecommendationOutputSchema>;

export async function contextualMealRecommendation(input: ContextualMealRecommendationInput): Promise<ContextualMealRecommendationOutput> {
  return contextualMealRecommendationFlow(input);
}

const contextualMealRecommendationPrompt = ai.definePrompt({
  name: 'contextualMealRecommendationPrompt',
  input: { schema: ContextualMealRecommendationInputSchema },
  output: { schema: ContextualMealRecommendationOutputSchema },
  prompt: `You are a helpful and knowledgeable nutritionist and chef. Based on the user's provided details, recommend a suitable meal along with 2-3 alternatives.

Consider the following information:
- Time of Day: {{{timeOfDay}}}
- Budget: {{{budget}}} rupees
- Health Goal: {{{healthGoal}}}
- Hunger Level: {{{hungerLevel}}}
{{#if availableIngredients}}
- Available Ingredients: {{#each availableIngredients}}- {{{this}}}\n{{/each}}{{/if}}

Follow these logic rules when making recommendations:
- If 'morning', prioritize protein-rich and light carbs.
- If 'late night', prioritize low-calorie and easy-to-digest meals.
- If 'low budget' (e.g., below 100 rupees), prioritize budget-friendly ingredients like dal, eggs, and peanuts.
- If 'muscle gain' health goal, prioritize high protein meals.
- If 'weight loss' health goal, prioritize low-calorie and high-fiber meals.
- If 'availableIngredients' are provided, prioritize recipes that use those ingredients.

Ensure that each recommendation includes:
- The meal name.
- An estimated cost within the specified budget.
- Clear nutritional reasoning explaining why it fits the user's criteria and health goal.
- Provide 2-3 distinct and suitable alternatives, each with its name, estimated cost, and nutritional reasoning.

Ensure each alternative includes its name, estimated cost, and reasoning.
`,
});

const contextualMealRecommendationFlow = ai.defineFlow(
  {
    name: 'contextualMealRecommendationFlow',
    inputSchema: ContextualMealRecommendationInputSchema,
    outputSchema: ContextualMealRecommendationOutputSchema,
  },
  async (input) => {
    const { output } = await contextualMealRecommendationPrompt(input);
    if (!output) {
      throw new Error('Failed to generate meal recommendation.');
    }
    return output;
  }
);
