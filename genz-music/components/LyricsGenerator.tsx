// Component for AI-powered lyrics generation
'use client';

import { useState } from 'react';
import type { ContentType, Mood, LyricsGenerationParams } from '../types';
import { Sparkles, Loader2 } from 'lucide-react';

interface LyricsGeneratorProps {
  onLyricsGenerated: (lyrics: string) => void;
}

const moods: Mood[] = ['sad', 'happy', 'peaceful', 'energetic', 'romantic', 'melancholic', 'uplifting', 'dark'];
const languages = ['English', 'Spanish', 'French', 'German', 'Italian', 'Portuguese'];

export default function LyricsGenerator({ onLyricsGenerated }: LyricsGeneratorProps) {
  const [params, setParams] = useState<LyricsGenerationParams>({
    contentType: 'poem',
    mood: 'peaceful',
    length: 15,
    language: 'English',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/generate-lyrics', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(params),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate lyrics');
      }

      onLyricsGenerated(data.lyrics);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 space-y-4">
      <div className="flex items-center gap-2 mb-4">
        <Sparkles className="w-5 h-5 text-purple-600" />
        <h2 className="text-xl font-semibold text-gray-800">AI Lyrics Generator</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Content Type
          </label>
          <select
            value={params.contentType}
            onChange={(e) => setParams({ ...params, contentType: e.target.value as ContentType })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            <option value="poem">Poem</option>
            <option value="song">Song Lyrics</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Mood
          </label>
          <select
            value={params.mood}
            onChange={(e) => setParams({ ...params, mood: e.target.value as Mood })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            {moods.map((mood) => (
              <option key={mood} value={mood}>
                {mood.charAt(0).toUpperCase() + mood.slice(1)}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Length (lines)
          </label>
          <input
            type="number"
            min="10"
            max="50"
            value={params.length}
            onChange={(e) => setParams({ ...params, length: parseInt(e.target.value) })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Language
          </label>
          <select
            value={params.language}
            onChange={(e) => setParams({ ...params, language: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            {languages.map((lang) => (
              <option key={lang} value={lang}>
                {lang}
              </option>
            ))}
          </select>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      <button
        onClick={handleGenerate}
        disabled={loading}
        className="w-full bg-purple-600 hover:bg-purple-700 disabled:bg-purple-400 text-white font-medium py-3 px-4 rounded-md transition-colors flex items-center justify-center gap-2"
      >
        {loading ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            Generating...
          </>
        ) : (
          <>
            <Sparkles className="w-5 h-5" />
            Generate Lyrics
          </>
        )}
      </button>
    </div>
  );
}