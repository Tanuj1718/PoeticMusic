import { NextRequest, NextResponse } from "next/server";
import { generateMusic } from "../../../lib/elevenlabs";

export async function POST(req: NextRequest) {
  try {
    const { prompt, duration, test } = await req.json();

    const song = await generateMusic(prompt, duration, test);
    console.log("Generated Song: ", song)
    return NextResponse.json(song);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      {
        error: "Failed to generate music",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
