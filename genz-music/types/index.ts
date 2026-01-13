// Types for the application

export type ContentType = 'poem' | 'song';

export type Mood = 
  | 'sad' 
  | 'happy' 
  | 'peaceful' 
  | 'energetic' 
  | 'romantic' 
  | 'melancholic' 
  | 'uplifting' 
  | 'dark';

export interface LyricsGenerationParams {
  contentType: ContentType;
  mood: Mood;
  length: number;
  language: string;
}

export interface GeneratedLyrics {
  content: string;
  metadata: {
    contentType: ContentType;
    mood: Mood;
    length: number;
    language: string;
  };
}

export interface MusicAnalysis {
  mood: string;
  tempo: string;
  style: string;
  instruments: string[];
  energy: string;
  ambiance: string;
}

export interface MusicPrompt {
  prompt: string;
  analysis: MusicAnalysis;
}

export interface GeneratedMusic {
  audioUrl: string;
  blob: Blob;
  filename: string;
}

export interface SavedGeneration {
  id: string;
  lyrics: string;
  analysis: MusicAnalysis;
  musicPrompt: string;
  audioUrl: string;
  createdAt: string;
}