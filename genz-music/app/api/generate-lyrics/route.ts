// API Route: Generate lyrics using Gemini AI
import { NextRequest, NextResponse } from 'next/server';
import { generateLyrics } from '../../../lib/gemini';
import { LyricsGenerationParams } from '../../../types';


export async function POST(request: NextRequest) {
  try {
    const body = await request.json() as LyricsGenerationParams;
    
    // Validate input
    if (!body.contentType || !body.mood || !body.length || !body.language) {
      return NextResponse.json(
        { error: 'Missing required parameters' },
        { status: 400 }
      );
    }

    // Validate length range
    if (body.length < 10 || body.length > 50) {
      return NextResponse.json(
        { error: 'Length must be between 10 and 50 lines' },
        { status: 400 }
      );
    }

    const lyrics = await generateLyrics(body);

    return NextResponse.json({
      success: true,
      lyrics,
      metadata: {
        contentType: body.contentType,
        mood: body.mood,
        length: body.length,
        language: body.language,
      },
    });
  } catch (error) {
    console.error('Error generating lyrics:', error);
    return NextResponse.json(
      { error: 'Failed to generate lyrics', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}