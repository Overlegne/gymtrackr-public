'use server';
/**
 * @fileOverview A Genkit flow for parsing workout data from PDF text.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import pdf from 'pdf-parse';

const ImportedExerciseSchema = z.object({
  id: z.string(),
  originalText: z.string().describe('The raw text for the exercise as it appeared in the PDF.'),
  displayName: z.string().describe('A cleaned up name for the exercise.'),
  sets: z.number().optional().describe('Detected number of sets.'),
  reps: z.number().optional().describe('Detected target reps.'),
  durationSeconds: z.number().optional().describe('Detected duration in seconds (if applicable).'),
  notes: z.string().optional().describe('Any specific notes or coaching cues from the PDF.'),
  confidence: z.number().describe('Confidence score from 0 to 1.'),
  needsReview: z.boolean().describe('Whether this item requires user verification.'),
});

const ImportedRoutineDaySchema = z.object({
  id: z.string(),
  name: z.string().describe('The name of the workout day (e.g., "Push", "Dag 1").'),
  confidence: z.number(),
  exercises: z.array(ImportedExerciseSchema),
});

const ParseWorkoutPdfOutputSchema = z.object({
  title: z.string().describe('The detected title of the routine.'),
  sourceFileName: z.string().optional(),
  days: z.array(ImportedRoutineDaySchema),
  unmatchedItems: z.array(z.string()).describe('Text snippets that seemed relevant but could not be parsed into exercises.'),
});

export type ParseWorkoutPdfOutput = z.infer<typeof ParseWorkoutPdfOutputSchema>;

const ParseWorkoutPdfInputSchema = z.object({
  pdfBase64: z.string().describe('Base64 encoded PDF file content.'),
  fileName: z.string().optional(),
});

export type ParseWorkoutPdfInput = z.infer<typeof ParseWorkoutPdfInputSchema>;

export async function parseWorkoutPdf(input: ParseWorkoutPdfInput): Promise<ParseWorkoutPdfOutput> {
  // Extract text from PDF first
  const buffer = Buffer.from(input.pdfBase64, 'base64');
  const pdfData = await pdf(buffer);
  const rawText = pdfData.text;

  return parseWorkoutPdfFlow({ rawText, fileName: input.fileName });
}

const prompt = ai.definePrompt({
  name: 'parseWorkoutPdfPrompt',
  input: { schema: z.object({ rawText: z.string(), fileName: z.string().optional() }) },
  output: { schema: ParseWorkoutPdfOutputSchema },
  prompt: `You are an expert fitness coach and data analyst. Your task is to extract a structured workout routine from the provided raw text, which was extracted from a workout PDF.

PDFs can be messy, containing tables, mixed blocks, and unrelated text. 

FOLLOW THESE RULES:
1. Detect the Routine Title (e.g., "PPL 12 Weeks", "Summer Body Program").
2. Identify separate workout Days or Sessions (e.g., "Push", "Dag 1", "Workout A").
3. For each day, extract the list of Exercises.
4. For each exercise, try to find:
   - Exercise Name (e.g., "Bankdruk", "Lat Pulldown").
   - Set Count (look for numbers followed by "x" or "sets").
   - Rep targets (look for numbers after "x" or "reps").
   - Duration (e.g., "60 sec plank" -> 60s).
   - Notes (specific cues or equipment details).
5. IGNORE irrelevant text:
   - Personal info (age, gender, weight).
   - Branding, URLs, or generic notes about the gym.
   - Table labels like "Exercise", "Sets", "Reps" when they aren't part of a specific row.
6. QUALITY & CONFIDENCE:
   - Set "confidence" from 0.0 to 1.0 based on how clear the text was.
   - Set "needsReview" to true if the exercise name is messy, sets/reps are ambiguous, or if it looks like the text might be noise.
   - If an exercise name is in Dutch or another language, keep it as "originalText" but provide a clean "displayName".

RAW TEXT FROM PDF:
{{{rawText}}}

Source Filename: {{{fileName}}}`,
});

const parseWorkoutPdfFlow = ai.defineFlow(
  {
    name: 'parseWorkoutPdfFlow',
    inputSchema: z.object({ rawText: z.string(), fileName: z.string().optional() }),
    outputSchema: ParseWorkoutPdfOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    if (!output) {
      throw new Error('Failed to parse workout data from text.');
    }
    return {
      ...output,
      sourceFileName: input.fileName,
    };
  }
);
