'use client';

import { useState, useRef, useEffect } from 'react';
import { Play, Pause, Download, Music, Loader2 } from 'lucide-react';
import type { MusicAnalysis } from '../types';

interface MusicPlayerProps {
  lyrics: string;
  audioUrl?: string;
  analysis?: MusicAnalysis;
  onGenerateMusic: () => Promise<void>;
  generating: boolean;
}

export default function MusicPlayer({
  lyrics,
  audioUrl,
  analysis,
  onGenerateMusic,
  generating,
}: MusicPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [playableUrl, setPlayableUrl] = useState<string | null>(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Reset player when new audio is generated
  useEffect(() => {
    setIsPlaying(false);
    setCurrentTime(0);
    setDuration(0);
  }, [audioUrl]);


  useEffect(() => {
  if (!audioUrl) return;

  let revokedUrl: string | null = null;

  const fixBlobForPlayback = async () => {
    try {
      const response = await fetch(audioUrl);
      const blob = await response.blob();

      // 🔥 FORCE correct MIME
      const fixedBlob = new Blob([blob], { type: 'audio/mpeg' });

      const url = URL.createObjectURL(fixedBlob);
      revokedUrl = url;

      setPlayableUrl(url);
      setIsPlaying(false);
      setCurrentTime(0);
      setDuration(0);
    } catch (err) {
      console.error('Failed to fix audio blob:', err);
    }
  };

  fixBlobForPlayback();

  return () => {
    if (revokedUrl) URL.revokeObjectURL(revokedUrl);
  };
}, [audioUrl]);


  const togglePlayPause = async () => {
    if (!audioRef.current) return;

    try {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        await audioRef.current.play(); // IMPORTANT: await
      }
      setIsPlaying(!isPlaying);
    } catch (err) {
      console.error('Audio playback failed:', err);
    }
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration || 0);
    }
  };

  const handleEnded = () => {
    setIsPlaying(false);
    setCurrentTime(0);
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!audioRef.current) return;

    const time = Number(e.target.value);
    audioRef.current.currentTime = time;
    setCurrentTime(time);
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  // ✅ Proper blob download
  const handleDownload = async () => {
    if (!audioUrl) return;

    try {
      const response = await fetch(audioUrl);
      const blob = await response.blob();
      const fixedBlob = new Blob([blob], { type: 'audio/mpeg' });

      const url = URL.createObjectURL(fixedBlob);

      const link = document.createElement('a');
      link.href = url;
      link.download = `music-${Date.now()}.mp3`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Download failed:', err);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 space-y-6">
      <div className="flex items-center gap-2 mb-4">
        <Music className="w-5 h-5 text-green-600" />
        <h2 className="text-xl font-semibold text-gray-800">Music Generation</h2>
      </div>

      {/* Lyrics */}
      <div className="bg-gray-50 rounded-lg p-4 max-h-48 overflow-y-auto">
        <p className="text-sm text-gray-600 whitespace-pre-wrap">{lyrics}</p>
      </div>

      {/* Analysis */}
      {analysis && (
        <div className="border border-gray-200 rounded-lg p-4 space-y-3">
          <h3 className="font-semibold text-gray-800">Analysis</h3>

          <div className="grid grid-cols-2 gap-3 text-sm">
            <div><span className="text-gray-600">Mood:</span> {analysis.mood}</div>
            <div><span className="text-gray-600">Tempo:</span> {analysis.tempo}</div>
            <div><span className="text-gray-600">Style:</span> {analysis.style}</div>
            <div><span className="text-gray-600">Energy:</span> {analysis.energy}</div>
          </div>

          <div>
            <span className="text-gray-600 text-sm">Instruments:</span>
            <div className="flex flex-wrap gap-2 mt-1">
              {analysis.instruments.map((instrument, idx) => (
                <span
                  key={idx}
                  className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded"
                >
                  {instrument}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Generate or Player */}
      {!audioUrl ? (
        <button
          onClick={onGenerateMusic}
          disabled={generating}
          className="w-full bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white font-medium py-3 rounded-md flex items-center justify-center gap-2"
        >
          {generating ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Generating Music...
            </>
          ) : (
            <>
              <Music className="w-5 h-5" />
              Generate Music
            </>
          )}
        </button>
      ) : (
        <>
          {/* ✅ CLEAN AUDIO ELEMENT */}
          <audio
            ref={audioRef}
            src={playableUrl ?? undefined}
            preload="metadata"
            onTimeUpdate={handleTimeUpdate}
            onLoadedMetadata={handleLoadedMetadata}
            onEnded={handleEnded}
          />


          <div className="flex items-center gap-4">
            <button
              onClick={togglePlayPause}
              className="bg-green-600 hover:bg-green-700 text-white p-3 rounded-full"
            >
              {isPlaying ? <Pause /> : <Play />}
            </button>

            <div className="flex-1">
              <input
                type="range"
                min={0}
                max={duration}
                value={currentTime}
                onChange={handleSeek}
                className="w-full accent-green-600"
              />
              <div className="flex justify-between text-sm text-gray-600 mt-1">
                <span>{formatTime(currentTime)}</span>
                <span>{formatTime(duration)}</span>
              </div>
            </div>

            <button
              onClick={handleDownload}
              className="bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-full"
            >
              <Download />
            </button>
          </div>
        </>
      )}
    </div>
  );
}
