/**
 * @fileOverview Client for the remote workout parsing service.
 * Separates AI logic from the mobile app bundle to keep the APK lightweight.
 */

export interface ParsedExercise {
  id: string;
  displayName: string;
  sets?: number;
  reps?: number;
  durationSeconds?: number;
  notes?: string;
  confidence: number;
  needsReview: boolean;
}

export interface ParsedDay {
  id: string;
  name: string;
  exercises: ParsedExercise[];
}

export interface ParsingResponse {
  title: string;
  days: ParsedDay[];
  unmatchedItems: string[];
}

export interface ParsingRequest {
  fileBase64: string;
  fileName: string;
  mimeType: string;
}

/**
 * Calls the external parsing service. 
 * Note: In production, this should point to the absolute URL of your deployed Next.js API.
 */
export async function callParsingService(request: ParsingRequest): Promise<ParsingResponse> {
  // We use a relative path here which works in dev and when served from the same origin.
  // For a standalone Capacitor APK, ensure your API route is deployed and accessible.
  const API_URL = '/api/parse-workout';

  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `Parsing service error (${response.status})`);
    }

    return await response.json();
  } catch (error) {
    console.error('Parsing Service Error:', error);
    throw error;
  }
}
