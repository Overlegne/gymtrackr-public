
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
 */
export async function callParsingService(request: ParsingRequest): Promise<ParsingResponse> {
  // Use a configurable URL or default to the internal API route
  // Note: For bundled Capacitor, this must be an absolute URL pointing to your deployed server.
  const API_URL = process.env.NEXT_PUBLIC_PARSING_SERVICE_URL || '/api/parse-workout';

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
