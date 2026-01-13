"use client"

import { useState } from "react"
import { Pen } from "lucide-react"

interface LyricsInputProps {
  onLyricsSubmit: (lyrics: string) => void
  initialValue?: string
}

export default function LyricsInput({ onLyricsSubmit, initialValue = "" }: LyricsInputProps) {
  const [lyrics, setLyrics] = useState(initialValue)

  const handleSubmit = () => {
    if (lyrics.trim()) {
      onLyricsSubmit(lyrics.trim())
    }
  }

  const wordCount = lyrics
    .trim()
    .split(/\s+/)
    .filter((word) => word).length
  const lineCount = lyrics.split("\n").filter((line) => line.trim()).length

  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-200/40 shadow-xl p-8 space-y-4">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2.5 rounded-lg bg-gradient-to-br from-amber-400 to-orange-500 shadow-lg">
          <Pen className="w-6 h-6 text-white" />
        </div>
        <div>
          <h2 className="text-2xl font-bold bg-gradient-to-r from-amber-900 to-orange-900 bg-clip-text text-transparent">
            Your Lyrics
          </h2>
          <p className="text-xs text-amber-700/60 mt-1">Paste your poem or song</p>
        </div>
      </div>

      <div className="relative">
        <textarea
          value={lyrics}
          onChange={(e) => setLyrics(e.target.value)}
          placeholder="Paste your poem or song lyrics here... Let your creativity flow..."
          className="w-full h-72 px-6 py-4 bg-white/80 border-2 border-amber-200/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent resize-none transition-all hover:border-amber-300 placeholder:text-amber-300/60 text-amber-950 font-serif"
        />
        <div className="absolute top-3 right-3 text-xs font-medium text-amber-600/70 bg-white/60 px-3 py-1.5 rounded-full">
          ✨ {lineCount} lines
        </div>
      </div>

      <div className="flex items-center justify-between text-sm font-medium">
        <div className="flex gap-4">
          <div className="flex items-center gap-2">
            <span className="text-amber-700/70">Lines:</span>
            <span className="text-amber-900 font-semibold">{lineCount}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-amber-700/70">Words:</span>
            <span className="text-amber-900 font-semibold">{wordCount}</span>
          </div>
        </div>
        <span className="text-xs text-amber-600/50">Character count: {lyrics.length}</span>
      </div>

      <button
        onClick={handleSubmit}
        disabled={!lyrics.trim()}
        className="w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 disabled:from-amber-300 disabled:to-orange-300 text-white font-semibold py-4 px-6 rounded-lg transition-all duration-300 shadow-lg hover:shadow-amber-500/50 disabled:shadow-none transform hover:scale-105 disabled:scale-100 disabled:cursor-not-allowed"
      >
        Use These Lyrics ✍️
      </button>
    </div>
  )
}
