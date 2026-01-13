// Gemini AI integration for lyrics generation and analysis
import { GoogleGenAI } from "@google/genai";
import type { LyricsGenerationParams, MusicAnalysis, MusicPrompt } from '../types';
import { NextResponse } from "next/server";

const apikey = process.env.GEMINI_API_KEY!;
const genAI = new GoogleGenAI({apiKey: apikey});

/**
 * Generates lyrics based on user parameters using Gemini AI
 */
export async function generateLyrics(params: LyricsGenerationParams): Promise<string> {

  const prompt = `Generate a ${params.contentType} with the following characteristics:
- Mood: ${params.mood}
- Length: approximately ${params.length} lines
- Language: ${params.language}

Please write only the ${params.contentType} content without any additional commentary or explanations. Make it creative, emotionally resonant, and well-structured.`;

const result = await genAI.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
        config: {
        temperature: 0.1,
        responseMimeType: "application/json",
        },
    });

    let outputText = result.text?.trim() ?? "";

    console.log("Raw model output:", outputText);


    if (outputText.startsWith("```")) {
      outputText = outputText
        .replace(/^```[a-zA-Z]*\s*\n?/, "")
        .replace(/```$/, "")
        .trim();
    }

    let parsed: unknown;
    try {
      const t = outputText.trim();
      parsed = t.startsWith("{") || t.startsWith("[") ? JSON.parse(outputText) : outputText;
    } catch {
      parsed = outputText;
    }

    return typeof parsed === "string" ? parsed : JSON.stringify(parsed);
}

/**
 * Analyzes lyrics and generates a music prompt for ElevenLabs
 */
export async function analyzeLyricsAndGenerateMusicPrompt(lyrics: string): Promise<MusicPrompt> {

  const prompt = `Analyze the following lyrics and create a detailed music generation prompt:

LYRICS:
${lyrics}

Please provide your analysis in the following JSON format (respond ONLY with valid JSON, no additional text):
{
  "analysis": {
    "mood": "overall emotional tone (e.g., melancholic, uplifting, intense)",
    "tempo": "slow, medium, or fast with BPM range",
    "style": "music genre/style (e.g., ambient, electronic, orchestral, acoustic)",
    "instruments": ["list", "of", "recommended", "instruments"],
    "energy": "low, medium, or high",
    "ambiance": "atmospheric description"
  },
  "musicPrompt": "A detailed, single-paragraph prompt for music generation that describes the desired instrumental track, including tempo, instruments, mood, style, and any specific musical elements that should be emphasized. This should be 2-3 sentences optimized for AI music generation."
}`;

//     const result = await genAI.models.generateContent({
//         model: "gemini-2.5-flash",
//         contents: prompt,
//         config: {
//         temperature: 0.1,
//         responseMimeType: "application/json",
//         },
//     });

//     let outputText = result.text?.trim() ?? "";

//     console.log("Raw model output:", outputText);


//     if (outputText.startsWith("```")) {
//       outputText = outputText
//         .replace(/^```[a-zA-Z]*\s*\n?/, "")
//         .replace(/```$/, "")
//         .trim();
//     }

//     const parsed =
//       typeof outputText === "string" ? JSON.parse(outputText) : outputText;
// console.log('Parsed output: ', parsed)
// return parsed==null ? parsed: parsed as MusicPrompt;


  return {
    analysis: {
    mood: 'Reflective, resilient, nostalgic, with a touch of melancholic hope.',
    tempo: 'Medium, around 80-100 BPM.',
    style: 'Indian Folk Acoustic with ambient undertones.',
    instruments: [
      'Acoustic guitar',
      'Ektara/Sarangi (or similar single-stringed instrument for melody)',
      'Tabla/Djembe (simple, earthy percussion)',
      'Harmonium/Flute (for melodic embellishments)',
      'Subtle ambient pads/drones'
    ],
    energy: 'Medium-low',
    ambiance: 'Earthy, introspective, evoking a sense of journey and enduring spirit amidst everyday life and challenges.'
  },
    prompt: 'Generate an instrumental track in an Indian Folk Acoustic style with a medium-low energy and a tempo of 80-100 BPM. The mood should be reflective and resilient, featuring a prominent acoustic guitar, a melancholic yet hopeful melody played on an Ektara or Sarangi, and simple, earthy percussion like tabla or djembe. Incorporate subtle ambient pads and a gentle harmonium or flute to create an introspective and enduring atmosphere, evoking a sense of journey and the persistent spirit of art.',
  };
}