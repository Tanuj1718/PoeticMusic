"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Play, Pause, Download, Music, Loader2, Volume2 } from "lucide-react"

interface MusicAnalysis {
  mood: string
  tempo: string
  style: string
  energy: string
  instruments: string[]
}

interface MusicPlayerProps {
  lyrics: string
  audioUrl?: string
  analysis?: MusicAnalysis
  onGenerateMusic: () => Promise<void>
  generating: boolean
}

export default function MusicPlayer({ lyrics, audioUrl, analysis, onGenerateMusic, generating }: MusicPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [playableUrl, setPlayableUrl] = useState<string | null>(null)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const audioRef = useRef<HTMLAudioElement | null>(null)

  useEffect(() => {
    setIsPlaying(false)
    setCurrentTime(0)
    setDuration(0)
  }, [audioUrl])

  useEffect(() => {
    if (!audioUrl) return

    let revokedUrl: string | null = null

    const fixBlobForPlayback = async () => {
      try {
        const response = await fetch(audioUrl)
        const blob = await response.blob()
        const fixedBlob = new Blob([blob], { type: "audio/mpeg" })
        const url = URL.createObjectURL(fixedBlob)
        revokedUrl = url
        setPlayableUrl(url)
        setIsPlaying(false)
        setCurrentTime(0)
        setDuration(0)
      } catch (err) {
        console.error("Failed to fix audio blob:", err)
      }
    }

    fixBlobForPlayback()

    return () => {
      if (revokedUrl) URL.revokeObjectURL(revokedUrl)
    }
  }, [audioUrl])

  const togglePlayPause = async () => {
    if (!audioRef.current) return

    try {
      if (isPlaying) {
        audioRef.current.pause()
      } else {
        await audioRef.current.play()
      }
      setIsPlaying(!isPlaying)
    } catch (err) {
      console.error("Audio playback failed:", err)
    }
  }

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime)
    }
  }

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration || 0)
    }
  }

  const handleEnded = () => {
    setIsPlaying(false)
    setCurrentTime(0)
  }

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!audioRef.current) return
    const time = Number(e.target.value)
    audioRef.current.currentTime = time
    setCurrentTime(time)
  }

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60)
    const seconds = Math.floor(time % 60)
    return `${minutes}:${seconds.toString().padStart(2, "0")}`
  }

  const handleDownload = async () => {
    if (!audioUrl) return

    try {
      const response = await fetch(audioUrl)
      const blob = await response.blob()
      const fixedBlob = new Blob([blob], { type: "audio/mpeg" })
      const url = URL.createObjectURL(fixedBlob)
      const link = document.createElement("a")
      link.href = url
      link.download = `music-${Date.now()}.mp3`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url)
    } catch (err) {
      console.error("Download failed:", err)
    }
  }

  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-900 via-cyan-900 to-slate-900 border border-cyan-500/20 shadow-2xl p-8 space-y-6">
      <div className="absolute inset-0 bg-gradient-to-r from-cyan-600/10 via-transparent to-blue-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

      <div className="relative z-10">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2.5 rounded-lg bg-gradient-to-br from-cyan-400 to-blue-600 shadow-lg">
            <Music className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold bg-gradient-to-r from-cyan-200 via-blue-100 to-cyan-100 bg-clip-text text-transparent">
              Music Generation
            </h2>
            <p className="text-xs text-cyan-300/60 mt-1">Transform lyrics into melodies</p>
          </div>
        </div>

        {/* Lyrics Display */}
        <div className="bg-slate-800/40 border border-cyan-500/20 rounded-xl p-5 max-h-48 overflow-y-auto mb-6 backdrop-blur-sm">
          <p className="text-sm text-cyan-100/80 whitespace-pre-wrap leading-relaxed font-serif">{lyrics}</p>
        </div>

        {/* Analysis */}
        {analysis && (
          <div className="bg-gradient-to-br from-cyan-500/10 to-blue-500/10 border border-cyan-500/20 rounded-xl p-5 space-y-4 mb-6 backdrop-blur-sm">
            <h3 className="font-semibold text-cyan-100 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-cyan-400" />
              Music Analysis
            </h3>

            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="bg-slate-800/40 rounded-lg p-3 border border-cyan-500/10">
                <span className="text-cyan-300/70 text-xs font-semibold">Mood</span>
                <p className="text-cyan-100 font-medium">{analysis.mood}</p>
              </div>
              <div className="bg-slate-800/40 rounded-lg p-3 border border-cyan-500/10">
                <span className="text-cyan-300/70 text-xs font-semibold">Tempo</span>
                <p className="text-cyan-100 font-medium">{analysis.tempo}</p>
              </div>
              <div className="bg-slate-800/40 rounded-lg p-3 border border-cyan-500/10">
                <span className="text-cyan-300/70 text-xs font-semibold">Style</span>
                <p className="text-cyan-100 font-medium">{analysis.style}</p>
              </div>
              <div className="bg-slate-800/40 rounded-lg p-3 border border-cyan-500/10">
                <span className="text-cyan-300/70 text-xs font-semibold">Energy</span>
                <p className="text-cyan-100 font-medium">{analysis.energy}</p>
              </div>
            </div>

            <div>
              <span className="text-cyan-300/70 text-xs font-semibold">Instruments</span>
              <div className="flex flex-wrap gap-2 mt-3">
                {analysis.instruments.map((instrument, idx) => (
                  <span
                    key={idx}
                    className="bg-cyan-500/20 text-cyan-100 text-xs px-3 py-1.5 rounded-full border border-cyan-500/30 font-medium"
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
            className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 disabled:from-cyan-400 disabled:to-blue-500 text-white font-semibold py-4 px-6 rounded-lg flex items-center justify-center gap-2 transition-all duration-300 shadow-lg hover:shadow-cyan-500/50 disabled:shadow-none transform hover:scale-105 disabled:scale-100"
          >
            {generating ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Composing your music...
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
            <audio
              ref={audioRef}
              src={playableUrl ?? undefined}
              preload="metadata"
              onTimeUpdate={handleTimeUpdate}
              onLoadedMetadata={handleLoadedMetadata}
              onEnded={handleEnded}
            />

            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <button
                  onClick={togglePlayPause}
                  className="bg-gradient-to-br from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white p-4 rounded-full transition-all shadow-lg hover:shadow-cyan-500/50 transform hover:scale-110 flex-shrink-0"
                >
                  {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6 ml-1" />}
                </button>

                <div className="flex-1">
                  <input
                    type="range"
                    min={0}
                    max={duration}
                    value={currentTime}
                    onChange={handleSeek}
                    className="w-full h-2 bg-slate-700 rounded-full appearance-none cursor-pointer accent-cyan-500"
                  />
                  <div className="flex justify-between text-xs text-cyan-300/70 mt-2 font-medium">
                    <span>{formatTime(currentTime)}</span>
                    <span>{formatTime(duration)}</span>
                  </div>
                </div>

                <button
                  onClick={handleDownload}
                  className="bg-gradient-to-br from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white p-4 rounded-full transition-all shadow-lg hover:shadow-amber-500/50 transform hover:scale-110 flex-shrink-0"
                >
                  <Download className="w-6 h-6" />
                </button>
              </div>

              <div className="flex items-center gap-2 text-xs text-cyan-300/60 bg-slate-800/40 rounded-lg px-4 py-3">
                <Volume2 className="w-4 h-4" />
                <span>Now playing • {isPlaying ? "Playing" : "Ready"}</span>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
