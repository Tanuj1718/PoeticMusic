export type LoudlySongResponse = {
  id: string;
  title: string;
  duration: number;
  music_file_path: string;
  wave_form_file_path: string;
  created_at: string;
  bpm?: number;
  key?: {
    id: number;
    name: string;
    active: boolean;
  };
};

/**
 * Generate music using Loudly AI API
 */
export async function generateMusic(
  prompt: string,
  duration: number = 20,
  test: boolean = true
): Promise<LoudlySongResponse> {
  if (!prompt) {
    throw new Error("Prompt is required");
  }

  const formData = new FormData();
  formData.append("prompt", prompt);
  formData.append("duration", duration.toString());
  formData.append("test", test.toString());

  const response = await fetch(
    "https://soundtracks.loudly.com/api/ai/prompt/songs",
    {
      method: "POST",
      headers: {
        "API-KEY": process.env.LOUDLY_API_KEY!,
      },
      body: formData,
    }
  );

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Loudly API Error: ${errorText}`);
  }

  const data: LoudlySongResponse = await response.json();
  return data;
}
