
/**
 * @fileOverview SERVER-SIDE ONLY flow for parsing workout data.
 * This file is part of the remote parsing service and is NOT bundled with the mobile app.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

// These imports are safe because this file is only executed in a Node environment (Model 2 Parsing Service)
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
 * Main entry point for the parsing logic (to be called by an API endpoint).
 */
export async function parseWorkoutFile(input: ParseWorkoutFileInput): Promise<ParseWorkoutFileOutput> {
  const { fileBase64, fileName, mimeType } = input;

  let extractedText = '';
  let isImage = false;

  const buffer = Buffer.from(fileBase64, 'base64');

  if (mimeType === 'application/pdf') {
    const pdfData = await pdf(buffer);
    extractedText = pdfData.text;
  } else if (mimeType.includes('spreadsheet') || mimeType.includes('excel') || mimeType === 'text/csv' || fileName.endsWith('.ods')) {
    const workbook = XLSX.read(buffer, { type: 'buffer' });
    const firstSheetName = workbook.SheetNames[0];
    extractedText = XLSX.utils.sheet_to_csv(workbook.Sheets[firstSheetName]);
  } else if (mimeType.includes('word') || mimeType.includes('officedocument.wordprocessingml.document')) {
    const docResult = await mammoth.extractRawText({ buffer });
    extractedText = docResult.value;
  } else if (mimeType.startsWith('image/')) {
    isImage = true;
  } else {
    try {
      extractedText = buffer.toString('utf-8');
    } catch (e) {
      extractedText = '';
    }
  }

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
      imageDataUri: z.string().optional(),
    }),
  },
  output: { schema: ParseWorkoutFileOutputSchema },
  prompt: `You are an expert fitness coach and data analyst. Extract a structured workout routine from the provided file content.
SOURCE FILENAME: {{{fileName}}}

{{#if extractedText}}
RAW TEXT CONTENT:
{{{extractedText}}}
{{/if}}

{{#if imageDataUri}}
The user has provided an image of their workout plan:
{{media url=imageDataUri}}
{{/if}}

Rules:
1. Identify the workout name/title.
2. Group exercises into logical 'days' or 'sessions' if present.
3. For each exercise, identify: name, sets, and reps (or duration for timed holds).
4. Set 'needsReview' to true if the data is ambiguous.
5. Provide a confidence score for each item.`,
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
    const imageDataUri = input.fileBase64 && input.mimeType 
      ? `data:${input.mimeType};base64,${input.fileBase64}` 
      : undefined;

    const { output } = await prompt({
      extractedText: input.extractedText,
      fileName: input.fileName,
      imageDataUri,
    });
    
    if (!output) throw new Error('Failed to parse workout data.');
    
    return {
      ...output,
      sourceFileName: input.fileName,
    };
  }
);
