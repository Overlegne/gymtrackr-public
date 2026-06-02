/**
 * @fileOverview A Genkit flow for generating a workout routine based on user preferences.
 *
 * - getAiGeneratedRoutineSuggestion - A function that generates a workout routine.
 * - AiGeneratedRoutineSuggestionInput - The input type for the getAiGeneratedRoutineSuggestion function.
 * - AiGeneratedRoutineSuggestionOutput - The return type for the getAiGeneratedRoutineSuggestion function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const AiGeneratedRoutineSuggestionInputSchema = z.object({
  muscleGroupFocus: z
    .array(z.string())
    .optional()
    .describe('An array of muscle groups the user wants to focus on (e.g., "borst", "rug", "benen").'),
  equipmentAvailable: z
    .array(z.string())
    .optional()
    .describe('An array of available equipment (e.g., "halter", "barbell", "machine").'),
});
export type AiGeneratedRoutineSuggestionInput = z.infer<
  typeof AiGeneratedRoutineSuggestionInputSchema
>;

const AiGeneratedRoutineSuggestionOutputSchema = z.object({
  routineName: z.string().describe('The suggested name for the workout routine.'),
  exercises: z
    .array(
      z.object({
        name: z.string().describe('The name of the exercise.'),
        muscleGroup: z.string().describe('The primary muscle group targeted by the exercise.'),
        equipment: z.array(z.string()).describe('A list of equipment required for the exercise.'),
      })
    )
    .describe('A list of exercises included in the routine.'),
});
export type AiGeneratedRoutineSuggestionOutput = z.infer<
  typeof AiGeneratedRoutineSuggestionOutputSchema
>;

export async function getAiGeneratedRoutineSuggestion(
  input: AiGeneratedRoutineSuggestionInput
): Promise<AiGeneratedRoutineSuggestionOutput> {
  return aiGeneratedRoutineSuggestionFlow(input);
}

const prompt = ai.definePrompt({
  name: 'aiGeneratedRoutineSuggestionPrompt',
  input: { schema: AiGeneratedRoutineSuggestionInputSchema },
  output: { schema: AiGeneratedRoutineSuggestionOutputSchema },
  prompt: `You are a fitness expert creating a workout routine for the user.
Based on the user's preferences, generate a basic workout routine.

If the user specifies a muscle group focus, prioritize exercises targeting those muscle groups.
If the user specifies available equipment, ensure all exercises can be performed with the listed equipment.
If both are specified, ensure the routine aligns with both.

The routine should consist of 5-7 exercises. For each exercise, provide its name, the primary muscle group it targets, and a list of required equipment.

Return the response in JSON format according to the provided output schema.

User preferences:
{{#if muscleGroupFocus}}
Spiergroep focus: {{#each muscleGroupFocus}}{{{this}}}{{#unless @last}}, {{/unless}}{{/each}}
{{/if}}
{{#if equipmentAvailable}}
Beschikbare uitrusting: {{#each equipmentAvailable}}{{{this}}}{{#unless @last}}, {{/unless}}{{/each}}
{{/if}}`,
});

const aiGeneratedRoutineSuggestionFlow = ai.defineFlow(
  {
    name: 'aiGeneratedRoutineSuggestionFlow',
    inputSchema: AiGeneratedRoutineSuggestionInputSchema,
    outputSchema: AiGeneratedRoutineSuggestionOutputSchema,
  },
  async (input) => {
    let attempts = 0;
    const maxAttempts = 3;
    let lastError;

    while (attempts < maxAttempts) {
      try {
        const { output } = await prompt(input);
        if (!output) {
          throw new Error('Failed to generate routine suggestion.');
        }
        return output;
      } catch (err: any) {
        lastError = err;
        const isRetryable = err.message?.includes('503') || 
                           err.message?.includes('high demand') || 
                           err.message?.includes('UNAVAILABLE') ||
                           err.message?.includes('DEADLINE_EXCEEDED');

        if (isRetryable) {
          attempts++;
          if (attempts < maxAttempts) {
            await new Promise(resolve => setTimeout(resolve, 2000 * attempts));
            continue;
          }
        }
        throw err;
      }
    }
    throw lastError;
  }
);
