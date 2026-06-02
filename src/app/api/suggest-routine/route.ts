import { NextRequest, NextResponse } from 'next/server';
import { getAiGeneratedRoutineSuggestion } from '@/ai/flows/ai-generated-routine-suggestion';

/**
 * @fileOverview HTTP API Endpoint for the Routine Suggestion Service.
 * This route is intended to run on a Node.js server.
 */

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { muscleGroupFocus, equipmentAvailable } = body;

    const result = await getAiGeneratedRoutineSuggestion({
      muscleGroupFocus,
      equipmentAvailable,
    });

    return NextResponse.json(result);
  } catch (error: any) {
    console.error('Suggestion API Error:', error);
    return NextResponse.json(
      { message: 'Internal suggestion error', details: error.message },
      { status: 500 }
    );
  }
}
