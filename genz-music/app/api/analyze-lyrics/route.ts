// API Route: Analyze lyrics and generate music prompt
import { NextRequest, NextResponse } from 'next/server';
import { analyzeLyricsAndGenerateMusicPrompt } from '../../../lib/gemini';

export async function POST(request: NextRequest) {
  try {
    const { lyrics } = await request.json();
    
    if (!lyrics || typeof lyrics !== 'string' || lyrics.trim().length === 0) {
      return NextResponse.json(
        { error: 'Lyrics are required' },
        { status: 400 }
      );
    }

    const result = await analyzeLyricsAndGenerateMusicPrompt(lyrics);

    return NextResponse.json({
      success: true,
      analysis: result.analysis,
      musicPrompt: result.prompt,
    });
  } catch (error) {
    console.error('Error analyzing lyrics:', error);
    return NextResponse.json(
      { error: 'Failed to analyze lyrics', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}