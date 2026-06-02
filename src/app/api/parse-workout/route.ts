import { NextRequest, NextResponse } from 'next/server';
import { parseWorkoutFile } from '@/ai/flows/parse-workout-file';

/**
 * @fileOverview HTTP API Endpoint for the Workout Parsing Service.
 * This route is intended to run on a Node.js server (e.g., Vercel, Cloud Run).
 * It is NOT included in the static Capacitor bundle.
 */

export const maxDuration = 60; // Increase timeout to 60 seconds for AI processing

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
    
    const message = error.message || '';
    
    // Check for specific Genkit or downstream timeout errors
    if (message.includes('DEADLINE_EXCEEDED') || message.includes('timeout')) {
      return NextResponse.json(
        { 
          message: 'The AI service took too long to respond. Please try again with a smaller file or clearer text.', 
          details: error.message 
        },
        { status: 504 }
      );
    }

    // Check for safety blocks
    if (message.includes('SAFETY') || message.includes('finishReason: SAFETY')) {
      return NextResponse.json(
        { 
          message: 'Parsing blocked by safety filters', 
          details: 'The AI service declined to parse this content. This can sometimes happen with specific handwriting or complex layouts.' 
        },
        { status: 422 }
      );
    }

    // Check for quota issues
    if (message.includes('429') || message.includes('quota') || message.includes('RESOURCE_EXHAUSTED')) {
      return NextResponse.json(
        { 
          message: 'Server capacity reached', 
          details: 'The AI service is currently receiving too many requests. Please wait a minute and try again.' 
        },
        { status: 429 }
      );
    }

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
