import { genkit } from 'genkit';
import { googleAI } from '@genkit-ai/google-genai';

/**
 * @fileOverview Central Genkit initialization.
 * 
 * We use a factory-like approach for the AI object to ensure it's handled safely
 * during static export or when environment variables are missing.
 */

// Use a fallback for the API key to prevent crashes during module initialization in static builds
const apiKey = process.env.GOOGLE_GENAI_API_KEY || process.env.GEMINI_API_KEY || 'MISSING_API_KEY';

export const ai = genkit({
  plugins: [googleAI({ apiKey: apiKey === 'MISSING_API_KEY' ? undefined : apiKey })],
  model: 'googleai/gemini-2.5-flash',
});
