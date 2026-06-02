
/**
 * @fileOverview A flow for parsing workout data from various file types.
 * Note: Node-specific libraries like pdf-parse/mammoth are guarded for browser compatibility.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

// Conditional imports to prevent crashes in browser environments
const getParsers = async () => {
  if (typeof window !== 'undefined') return null;
  try {
    const pdf = (await import('pdf-parse')).default;
    const XLSX = await import('xlsx');
    const mammoth = (await import('mammoth')).default;
    return { pdf, XLSX, mammoth };
  } catch (e) {
    return null;
  }
};

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

export async function parseWorkoutFile(input: ParseWorkoutFileInput): Promise<ParseWorkoutFileOutput> {
  const { fileBase64, fileName, mimeType } = input;
  const parsers = await getParsers();

  let extractedText = '';
  let isImage = false;

  if (parsers && mimeType === 'application/pdf') {
    const buffer = typeof window === 'undefined' ? Buffer.from(fileBase64, 'base64') : null;
    if (buffer) {
      const pdfData = await parsers.pdf(buffer);
      extractedText = pdfData.text;
    }
  } else if (parsers && (mimeType.includes('spreadsheet') || mimeType.includes('excel') || mimeType === 'text/csv' || fileName.endsWith('.ods'))) {
    const buffer = typeof window === 'undefined' ? Buffer.from(fileBase64, 'base64') : null;
    if (buffer) {
      const workbook = parsers.XLSX.read(buffer, { type: 'buffer' });
      const firstSheetName = workbook.SheetNames[0];
      extractedText = parsers.XLSX.utils.sheet_to_csv(workbook.Sheets[firstSheetName]);
    }
  } else if (parsers && (mimeType.includes('word') || mimeType.includes('officedocument.wordprocessingml.document'))) {
    const buffer = typeof window === 'undefined' ? Buffer.from(fileBase64, 'base64') : null;
    if (buffer) {
      const docResult = await parsers.mammoth.extractRawText({ buffer });
      extractedText = docResult.value;
    }
  } else if (mimeType.startsWith('image/')) {
    isImage = true;
  } else {
    // Basic text fallback for browser or unknown types
    try {
      extractedText = typeof window === 'undefined' 
        ? Buffer.from(fileBase64, 'base64').toString('utf-8') 
        : atob(fileBase64);
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
  prompt: `You are an expert fitness coach and data analyst. Extract a structured workout routine.
SOURCE FILENAME: {{{fileName}}}

{{#if extractedText}}
RAW TEXT CONTENT:
{{{extractedText}}}
{{/if}}

{{#if imageDataUri}}
The user has provided an image of their workout plan:
{{media url=imageDataUri}}
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
