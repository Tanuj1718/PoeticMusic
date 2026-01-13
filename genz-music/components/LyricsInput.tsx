// Component for manual lyrics input
'use client';

import { useState } from 'react';
import { FileText } from 'lucide-react';

interface LyricsInputProps {
  onLyricsSubmit: (lyrics: string) => void;
  initialValue?: string;
}

export default function LyricsInput({ onLyricsSubmit, initialValue = '' }: LyricsInputProps) {
  const [lyrics, setLyrics] = useState(initialValue);

  const handleSubmit = () => {
    if (lyrics.trim()) {
      onLyricsSubmit(lyrics.trim());
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 space-y-4">
      <div className="flex items-center gap-2 mb-4">
        <FileText className="w-5 h-5 text-blue-600" />
        <h2 className="text-xl font-semibold text-gray-800">Your Lyrics</h2>
      </div>

      <textarea
        value={lyrics}
        onChange={(e) => setLyrics(e.target.value)}
        placeholder="Paste your poem or song lyrics here..."
        className="w-full h-64 px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
      />

      <div className="flex items-center justify-between text-sm text-gray-600">
        <span>{lyrics.split('\n').filter(line => line.trim()).length} lines</span>
        <span>{lyrics.trim().split(/\s+/).filter(word => word).length} words</span>
      </div>

      <button
        onClick={handleSubmit}
        disabled={!lyrics.trim()}
        className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium py-3 px-4 rounded-md transition-colors"
      >
        Use These Lyrics
      </button>
    </div>
  );
}