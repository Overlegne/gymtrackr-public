/**
 * @fileOverview Client for the remote workout parsing service.
 * Separates AI logic from the mobile app bundle to keep the APK lightweight.
 */

import { Capacitor } from '@capacitor/core';

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
 * Note: For a standalone Capacitor APK, this MUST point to a deployed URL.
 * Static exports do not include API routes.
 */
export async function callParsingService(request: ParsingRequest): Promise<ParsingResponse> {
  // Use environment variable if provided, otherwise fallback to relative path (for local dev)
  const BASE_URL = process.env.NEXT_PUBLIC_PARSING_SERVICE_URL || '';
  const API_PATH = '/api/parse-workout';
  
  // In Capacitor, a relative URL like '/api/...' will fail because there is no origin server.
  if (Capacitor.isNativePlatform() && !BASE_URL) {
    throw new Error('Parsing Service URL not configured. Please set NEXT_PUBLIC_PARSING_SERVICE_URL.');
  }

  const API_URL = `${BASE_URL}${API_PATH}`;

  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
    });

    if (!response.ok) {
      // Handle 404 specifically to explain the Static Export limitation
      if (response.status === 404) {
        throw new Error(
          Capacitor.isNativePlatform() 
            ? 'Parsing service endpoint not found on the remote server.'
            : 'Parsing API route not found. Note: API routes are unavailable in static exports (out/ folder).'
        );
      }

      const errorData = await response.json().catch(() => ({}));
      
      // Attempt to build a descriptive error message from the response
      const errorMessage = errorData.message || `Parsing service returned ${response.status}`;
      const detailedMessage = errorData.details ? `${errorMessage}: ${errorData.details}` : errorMessage;
      
      throw new Error(detailedMessage);
    }

    return await response.json();
  } catch (error: any) {
    console.error('Parsing Service Error:', error);
    // Wrap generic fetch errors (like "Failed to fetch" on network issues)
    if (error.message === 'Failed to fetch') {
      throw new Error('Could not connect to the parsing service. Check your internet connection or service URL.');
    }
    throw error;
  }
}
