'use server';
/**
 * @fileOverview A Genkit flow for generating a full-day meal plan based on user preferences and budget.
 *
 * - generateFullDayMealPlan - A function that generates a complete, nutritionally balanced full-day meal plan.
 * - FullDayMealPlanInput - The input type for the generateFullDayMealPlan function.
 * - FullDayMealPlanOutput - The return type for the generateFullDayMealPlan function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const MealDetailSchema = z.object({
  mealName: z.string().describe('The name of the recommended meal.'),
  estimatedCost: z.number().describe('The estimated cost of preparing this meal in the specified currency.'),
  nutritionalReasoning: z
    .string()
    .describe('Explanation why this meal fits the user\'s health goal, dietary preference, and budget.'),
  alternatives: z
    .array(z.string())
    .describe('2-3 alternative meal names for this slot, considering similar criteria.'),
});

const FullDayMealPlanInputSchema = z.object({
  budget: z.number().describe('The maximum budget for the full day\'s meals in the local currency.'),
  healthGoal: z
    .enum(['weight loss', 'muscle gain', 'maintenance'])
    .describe('The user\'s primary health goal (e.g., weight loss, muscle gain, maintenance).'),
  dietaryPreference: z
    .enum(['veg', 'non-veg', 'vegan', 'pescatarian', 'no preference'])
    .describe('The user\'s dietary preference (e.g., vegetarian, non-vegetarian, vegan).'),
  age: z.number().optional().describe('The user\'s age, used for more tailored nutritional advice (optional).'),
  availableIngredients: z
    .array(z.string())
    .optional()
    .describe('A list of ingredients the user currently has, to prioritize their use.'),
});
export type FullDayMealPlanInput = z.infer<typeof FullDayMealPlanInputSchema>;

const FullDayMealPlanOutputSchema = z.object({
  breakfast: MealDetailSchema.describe('Details for the recommended breakfast meal.'),
  lunch: MealDetailSchema.describe('Details for the recommended lunch meal.'),
  dinner: MealDetailSchema.describe('Details for the recommended dinner meal.'),
  totalEstimatedCost: z.number().describe('The total estimated cost for the entire full-day meal plan.'),
  isWithinBudget: z.boolean().describe('True if the total estimated cost is within the specified budget, false otherwise.'),
  nutritionalBalanceSummary: z
    .string()
    .describe(
      'A summary explaining how the full-day meal plan is nutritionally balanced and meets the user\'s health goals.'
    ),
});
export type FullDayMealPlanOutput = z.infer<typeof FullDayMealPlanOutputSchema>;

export async function generateFullDayMealPlan(input: FullDayMealPlanInput): Promise<FullDayMealPlanOutput> {
  return fullDayMealPlanFlow(input);
}

const prompt = ai.definePrompt({
  name: 'fullDayMealPlanPrompt',
  input: {schema: FullDayMealPlanInputSchema},
  output: {schema: FullDayMealPlanOutputSchema},
  prompt: `You are an expert nutritionist and meal planner. Your goal is to create a complete, nutritionally balanced full-day meal plan (breakfast, lunch, and dinner) that strictly adheres to the user's specified budget and health goals, encouraging healthier eating habits.

Generate a meal plan based on the following user inputs:

Budget: {{{budget}}} (in local currency)
Health Goal: {{{healthGoal}}}
Dietary Preference: {{{dietaryPreference}}}
{{#if age}}
Age: {{{age}}}
{{/if}}
{{#if availableIngredients.length}}
Available Ingredients: {{{availableIngredients.join ", "}}}
{{/if}}

Follow these rules and considerations for generating the meal plan:

-   **Budget Adherence**: The total estimated cost for all meals (breakfast, lunch, dinner) MUST NOT exceed the provided budget. If it is impossible to meet the budget with reasonable healthy options, prioritize the health goal and make the best possible suggestions, but clearly indicate that the plan exceeds the budget.
-   **Health Goal Specifics**:
    -   For 'weight loss': Prioritize low-calorie, high-fiber, and portion-controlled meals.
    -   For 'muscle gain': Prioritize high-protein meals with adequate complex carbohydrates.
    -   For 'maintenance': Focus on balanced macros and overall nutritional density.
-   **Dietary Preference**: Strictly adhere to the user's dietary preference (e.g., if 'veg', all meals must be vegetarian).
-   **Meal Specifics**:
    -   **Breakfast**: Should be protein-rich and include light carbohydrates. Suggest something suitable for the start of the day.
    -   **Lunch**: Provide a balanced and satisfying meal.
    -   **Dinner**: Should be low-calorie and easy to digest, especially if it's considered a 'late night' meal.
-   **Ingredient Prioritization**: If 'availableIngredients' are provided, prioritize incorporating them into the meals where suitable.
-   **Cost-Effective Options**: If the budget is low, prioritize affordable ingredients like dal, eggs, peanuts, seasonal vegetables, etc.

For each meal, provide its name, estimated cost, a clear nutritional reasoning, and 2-3 alternatives that also fit the criteria. Finally, provide the total estimated cost for the day, whether the plan is within budget, and a comprehensive summary of its nutritional balance.
`,
});

const fullDayMealPlanFlow = ai.defineFlow(
  {
    name: 'fullDayMealPlanFlow',
    inputSchema: FullDayMealPlanInputSchema,
    outputSchema: FullDayMealPlanOutputSchema,
  },
  async (input) => {
    const {output} = await prompt(input);
    return output!;
  }
);
