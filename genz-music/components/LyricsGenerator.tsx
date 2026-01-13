"use client"

import { useState } from "react"
type ContentType = "poem" | "song"
type Mood = "sad" | "happy" | "peaceful" | "energetic" | "romantic" | "melancholic" | "uplifting" | "dark"

interface LyricsGenerationParams {
  contentType: ContentType
  mood: Mood
  length: number
  language: string
}

interface LyricsGeneratorProps {
  onLyricsGenerated: (lyrics: string) => void
}

const moods: Mood[] = ["sad", "happy", "peaceful", "energetic", "romantic", "melancholic", "uplifting", "dark"]
const languages = ["English", "Spanish", "French", "German", "Italian", "Portuguese"]

import { Sparkles, Loader2 } from "lucide-react"

export default function LyricsGenerator({ onLyricsGenerated }: LyricsGeneratorProps) {
  const [params, setParams] = useState<LyricsGenerationParams>({
    contentType: "poem",
    mood: "peaceful",
    length: 15,
    language: "English",
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleGenerate = async () => {
    setLoading(true)
    setError(null)

    try {
      const response = await fetch("/api/generate-lyrics", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(params),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to generate lyrics")
      }

      onLyricsGenerated(data.lyrics)
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 border border-purple-500/20 shadow-2xl p-8 space-y-6">
      <div className="absolute inset-0 bg-gradient-to-r from-purple-600/10 via-transparent to-amber-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      <div className="relative z-10">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2.5 rounded-lg bg-gradient-to-br from-purple-400 to-purple-600 shadow-lg">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-200 via-purple-100 to-amber-200 bg-clip-text text-transparent">
              AI Lyrics Generator
            </h2>
            <p className="text-xs text-purple-300/60 mt-1">Create poetic verses with AI</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div>
            <label className="block text-sm font-semibold text-purple-100 mb-3">Content Type</label>
            <select
              value={params.contentType}
              onChange={(e) => setParams({ ...params, contentType: e.target.value as ContentType })}
              className="w-full px-4 py-3 bg-slate-800/50 border border-purple-500/30 rounded-lg text-purple-100 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all hover:border-purple-500/50"
            >
              <option value="poem">Poem</option>
              <option value="song">Song Lyrics</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-purple-100 mb-3">Mood</label>
            <select
              value={params.mood}
              onChange={(e) => setParams({ ...params, mood: e.target.value as Mood })}
              className="w-full px-4 py-3 bg-slate-800/50 border border-purple-500/30 rounded-lg text-purple-100 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all hover:border-purple-500/50"
            >
              {moods.map((mood) => (
                <option key={mood} value={mood}>
                  {mood.charAt(0).toUpperCase() + mood.slice(1)}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-purple-100 mb-3">Length (lines)</label>
            <input
              type="number"
              min="10"
              max="50"
              value={params.length}
              onChange={(e) => setParams({ ...params, length: Number.parseInt(e.target.value) })}
              className="w-full px-4 py-3 bg-slate-800/50 border border-purple-500/30 rounded-lg text-purple-100 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all hover:border-purple-500/50"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-purple-100 mb-3">Language</label>
            <select
              value={params.language}
              onChange={(e) => setParams({ ...params, language: e.target.value })}
              className="w-full px-4 py-3 bg-slate-800/50 border border-purple-500/30 rounded-lg text-purple-100 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all hover:border-purple-500/50"
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
          <div className="bg-red-500/10 border border-red-500/30 text-red-200 px-4 py-3 rounded-lg text-sm">
            {error}
          </div>
        )}

        <button
          onClick={handleGenerate}
          disabled={loading}
          className="w-full bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-500 hover:to-purple-600 disabled:from-purple-400 disabled:to-purple-500 text-white font-semibold py-4 px-6 rounded-lg transition-all duration-300 flex items-center justify-center gap-2 shadow-lg hover:shadow-purple-500/50 disabled:shadow-none transform hover:scale-105 disabled:scale-100"
        >
          {loading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Generating verses...
            </>
          ) : (
            <>
              <Sparkles className="w-5 h-5" />
              Generate Lyrics
            </>
          )}
        </button>
      </div>
    </div>
  )
}
