
import { NextRequest, NextResponse } from 'next/server';
import { parseWorkoutFile } from '@/ai/flows/parse-workout-file';

/**
 * @fileOverview HTTP API Endpoint for the Workout Parsing Service.
 * This route is intended to run on a Node.js server (e.g., Vercel, Cloud Run).
 * It is NOT included in the static Capacitor bundle.
 */

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { fileBase64, fileName, mimeType } = body;

    if (!fileBase64 || !fileName || !mimeType) {
      return NextResponse.json(
        { message: 'Missing required fields: fileBase64, fileName, or mimeType' },
        { status: 400 }
      );
    }

    // Call the Genkit flow
    const result = await parseWorkoutFile({
      fileBase64,
      fileName,
      mimeType,
    });

    return NextResponse.json(result);
  } catch (error: any) {
    console.error('Parsing API Error:', error);
    return NextResponse.json(
      { 
        message: 'Internal parsing error', 
        details: error.message,
        unmatchedItems: [] 
      },
      { status: 500 }
    );
  }
}
