
/**
 * @fileOverview Client for the remote workout parsing service.
 * Separates AI logic from the mobile app bundle.
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
 * Note: In a production Capacitor app, this would be an absolute URL to your hosted API.
 */
export async function callParsingService(request: ParsingRequest): Promise<ParsingResponse> {
  // Use the window location as a base if running in a web context, 
  // or a configured API URL for the mobile app.
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
      throw new Error(errorData.message || `Parsing service returned ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Parsing Service Error:', error);
    throw error;
  }
}
