// Main page component - orchestrates the entire user flow
'use client';

import { useState } from 'react';
import { Music2 } from 'lucide-react';
import { MusicAnalysis } from '../types';
import { saveGeneration } from '../lib/storage';
import LyricsInput from '../components/LyricsInput';
import LyricsGenerator from '../components/LyricsGenerator';
import MusicPlayer from '../components/MusicPlayer';
import GenerationHistory from '../components/GenerationHistory';

type InputMode = 'manual' | 'generate';

export default function Home() {
  const [inputMode, setInputMode] = useState<InputMode>('manual');
  const [lyrics, setLyrics] = useState<string>('');
  const [analysis, setAnalysis] = useState<MusicAnalysis | undefined>();
  const [musicPrompt, setMusicPrompt] = useState<string>('');
  const [audioUrl, setAudioUrl] = useState<string>('');
  const [generating, setGenerating] = useState(false);
  const [step, setStep] = useState<1 | 2>(1);

  const handleLyricsSubmit = (submittedLyrics: string) => {
    setLyrics(submittedLyrics);
    setStep(2);
    setAudioUrl('');
    setAnalysis(undefined);
  };

  const handleGenerateMusic = async () => {
    setGenerating(true);

    try {
      // Step 1: Analyze lyrics and generate music prompt
      const analyzeResponse = await fetch('/api/analyze-lyrics', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ lyrics }),
      });

      if (!analyzeResponse.ok) {
        throw new Error('Failed to analyze lyrics');
      }

      const analyzeData = await analyzeResponse.json();
      setAnalysis(analyzeData.analysis);
      setMusicPrompt(analyzeData.musicPrompt);

      // Step 2: Generate music using the prompt
      const musicResponse = await fetch('/api/generate-music', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: analyzeData.musicPrompt }),
      });

      if (!musicResponse.ok) {
        throw new Error('Failed to generate music');
      }

      // Convert response to blob and create URL
      const musicBlob = await musicResponse.blob();
      const url = URL.createObjectURL(musicBlob);
      setAudioUrl(url);

      // Save to history
      saveGeneration({
        lyrics,
        analysis: analyzeData.analysis,
        musicPrompt: analyzeData.musicPrompt,
        audioUrl: url,
      });
    } catch (error) {
      console.error('Error:', error);
      alert(error instanceof Error ? error.message : 'An error occurred');
    } finally {
      setGenerating(false);
    }
  };

  const handleReset = () => {
    setLyrics('');
    setAnalysis(undefined);
    setMusicPrompt('');
    setAudioUrl('');
    setStep(1);
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-green-50 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Music2 className="w-12 h-12 text-purple-600" />
            <h1 className="text-4xl font-bold text-gray-900">Music from Poetry</h1>
          </div>
          <p className="text-gray-600 text-lg">
            Transform your poems and lyrics into beautiful instrumental music using AI
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Input */}
          <div className="lg:col-span-2 space-y-6">
            {step === 1 && (
              <>
                {/* Mode Selection */}
                <div className="bg-white rounded-lg shadow-md p-4">
                  <div className="flex gap-4">
                    <button
                      onClick={() => setInputMode('manual')}
                      className={`flex-1 py-3 px-4 rounded-md font-medium transition-colors ${
                        inputMode === 'manual'
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      Provide Your Own
                    </button>
                    <button
                      onClick={() => setInputMode('generate')}
                      className={`flex-1 py-3 px-4 rounded-md font-medium transition-colors ${
                        inputMode === 'generate'
                          ? 'bg-purple-600 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      Generate with AI
                    </button>
                  </div>
                </div>

                {/* Input Components */}
                {inputMode === 'manual' ? (
                  <LyricsInput onLyricsSubmit={handleLyricsSubmit} initialValue={lyrics} />
                ) : (
                  <LyricsGenerator onLyricsGenerated={handleLyricsSubmit} />
                )}
              </>
            )}

            {step === 2 && (
              <>
                <MusicPlayer
                  lyrics={lyrics}
                  audioUrl={audioUrl}
                  analysis={analysis}
                  onGenerateMusic={handleGenerateMusic}
                  generating={generating}
                />

                <button
                  onClick={handleReset}
                  className="w-full bg-gray-600 hover:bg-gray-700 text-white font-medium py-3 px-4 rounded-md transition-colors"
                >
                  Start Over
                </button>
              </>
            )}
          </div>

          {/* Right Column - History */}
          <div className="lg:col-span-1">
            <GenerationHistory />
          </div>
        </div>

        {/* Footer */}
        <div className="mt-12 text-center text-gray-600 text-sm">
          <p>Powered by Google Gemini & ElevenLabs</p>
        </div>
      </div>
    </main>
  );
}