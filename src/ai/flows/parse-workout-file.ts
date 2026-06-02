
'use server';
/**
 * @fileOverview A Genkit flow for parsing workout data from various file types (PDF, Excel, Word, Images).
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import pdf from 'pdf-parse';
import * as XLSX from 'xlsx';
import mammoth from 'mammoth';

const ImportedExerciseSchema = z.object({
  id: z.string(),
  originalText: z.string().describe('The raw text for the exercise as it appeared in the file.'),
  displayName: z.string().describe('A cleaned up name for the exercise.'),
  sets: z.number().optional().describe('Detected number of sets.'),
  reps: z.number().optional().describe('Detected target reps.'),
  durationSeconds: z.number().optional().describe('Detected duration in seconds (if applicable).'),
  notes: z.string().optional().describe('Any specific notes or coaching cues detected.'),
  confidence: z.number().describe('Confidence score from 0 to 1.'),
  needsReview: z.boolean().describe('Whether this item requires user verification.'),
});

const ImportedRoutineDaySchema = z.object({
  id: z.string(),
  name: z.string().describe('The name of the workout day (e.g., "Push", "Dag 1").'),
  confidence: z.number(),
  exercises: z.array(ImportedExerciseSchema),
});

const ParseWorkoutFileOutputSchema = z.object({
  title: z.string().describe('The detected title of the routine.'),
  sourceFileName: z.string().optional(),
  days: z.array(ImportedRoutineDaySchema),
  unmatchedItems: z.array(z.string()).describe('Text snippets that seemed relevant but could not be parsed into exercises.'),
});

export type ParseWorkoutFileOutput = z.infer<typeof ParseWorkoutFileOutputSchema>;

const ParseWorkoutFileInputSchema = z.object({
  fileBase64: z.string().describe('Base64 encoded file content.'),
  fileName: z.string(),
  mimeType: z.string(),
});

export type ParseWorkoutFileInput = z.infer<typeof ParseWorkoutFileInputSchema>;

/**
 * Main entry point for parsing any supported file type.
 */
export async function parseWorkoutFile(input: ParseWorkoutFileInput): Promise<ParseWorkoutFileOutput> {
  const { fileBase64, fileName, mimeType } = input;
  const buffer = Buffer.from(fileBase64, 'base64');

  let extractedText = '';
  let isImage = false;

  // Handle extraction based on MIME type
  if (mimeType === 'application/pdf') {
    const pdfData = await pdf(buffer);
    extractedText = pdfData.text;
  } else if (mimeType.includes('spreadsheet') || mimeType.includes('excel') || mimeType === 'text/csv' || fileName.endsWith('.ods')) {
    const workbook = XLSX.read(buffer, { type: 'buffer' });
    // Convert first sheet to CSV for easy parsing
    const firstSheetName = workbook.SheetNames[0];
    extractedText = XLSX.utils.sheet_to_csv(workbook.Sheets[firstSheetName]);
  } else if (mimeType.includes('word') || mimeType.includes('officedocument.wordprocessingml.document')) {
    const docResult = await mammoth.extractRawText({ buffer });
    extractedText = docResult.value;
  } else if (mimeType.startsWith('image/')) {
    isImage = true;
  } else {
    // Fallback for text files or unknown
    extractedText = buffer.toString('utf-8');
  }

  // If it's an image, we send the media part directly.
  // Otherwise, we send the extracted text.
  return parseWorkoutFileFlow({
    extractedText,
    fileName,
    fileBase64: isImage ? fileBase64 : undefined,
    mimeType: isImage ? mimeType : undefined,
  });
}

const prompt = ai.definePrompt({
  name: 'parseWorkoutFilePrompt',
  input: {
    schema: z.object({
      extractedText: z.string().optional(),
      fileName: z.string(),
      fileBase64: z.string().optional(),
      mimeType: z.string().optional(),
    }),
  },
  output: { schema: ParseWorkoutFileOutputSchema },
  prompt: `You are an expert fitness coach and data analyst. Your task is to extract a structured workout routine from the provided source.

The source might be raw text extracted from a document (PDF, Word, Excel) or an image (screenshot of a plan).

FOLLOW THESE RULES:
1. Detect the Routine Title (e.g., "PPL 12 Weeks", "Summer Body Program").
2. Identify separate workout Days or Sessions (e.g., "Push", "Day 1", "Workout A").
3. For each day, extract the list of Exercises.
4. For each exercise, try to find:
   - Exercise Name (e.g., "Bench Press", "Lat Pulldown").
   - Set Count (look for numbers followed by "x" or "sets").
   - Rep targets (look for numbers after "x" or "reps").
   - Duration (e.g., "60 sec plank" -> 60s).
   - Notes (specific cues or equipment details).
5. IGNORE irrelevant text:
   - Personal info (age, gender, weight).
   - Branding, URLs, or generic notes about the gym.
   - Table headers like "Exercise", "Sets", "Reps" when they aren't part of a specific row.
6. QUALITY & CONFIDENCE:
   - Set "confidence" from 0.0 to 1.0 based on how clear the text was.
   - Set "needsReview" to true if the exercise name is messy, sets/reps are ambiguous, or if it looks like the text might be noise.

SOURCE FILENAME: {{{fileName}}}

{{#if extractedText}}
RAW TEXT CONTENT:
{{{extractedText}}}
{{/if}}

{{#if fileBase64}}
The user has provided an image of their workout plan:
{{media url=(concat "data:" mimeType ";base64," fileBase64)}}
{{/if}}`,
});

const parseWorkoutFileFlow = ai.defineFlow(
  {
    name: 'parseWorkoutFileFlow',
    inputSchema: z.object({
      extractedText: z.string().optional(),
      fileName: z.string(),
      fileBase64: z.string().optional(),
      mimeType: z.string().optional(),
    }),
    outputSchema: ParseWorkoutFileOutputSchema,
  },
  async (input) => {
    let attempts = 0;
    const maxAttempts = 3;
    let lastError;

    while (attempts < maxAttempts) {
      try {
        const { output } = await prompt(input);
        if (!output) {
          throw new Error('Failed to parse workout data.');
        }
        return {
          ...output,
          sourceFileName: input.fileName,
        };
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
