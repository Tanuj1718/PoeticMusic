"use client"

import { useState } from "react"
import { Music, Sparkles, Wand2, BookOpen } from "lucide-react"
import type { MusicAnalysis } from "../types"
import { saveGeneration } from "../lib/storage"
import LyricsInput from "../components/LyricsInput"
import LyricsGenerator from "../components/LyricsGenerator"
import MusicPlayer from "../components/MusicPlayer"
import GenerationHistory from "../components/GenerationHistory"

type InputMode = "manual" | "generate"

export default function Home() {
  const [inputMode, setInputMode] = useState<InputMode>("manual")
  const [lyrics, setLyrics] = useState<string>("")
  const [analysis, setAnalysis] = useState<MusicAnalysis | undefined>()
  const [musicPrompt, setMusicPrompt] = useState<string>("")
  const [audioUrl, setAudioUrl] = useState<string>("")
  const [generating, setGenerating] = useState(false)
  const [step, setStep] = useState<1 | 2>(1)

  const handleLyricsSubmit = (submittedLyrics: string) => {
    setLyrics(submittedLyrics)
    setStep(2)
    setAudioUrl("")
    setAnalysis(undefined)
  }

  const handleGenerateMusic = async () => {
    setGenerating(true)

    try {
      const analyzeResponse = await fetch("/api/analyze-lyrics", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ lyrics }),
      })

      if (!analyzeResponse.ok) {
        throw new Error("Failed to analyze lyrics")
      }

      const analyzeData = await analyzeResponse.json()
      setAnalysis(analyzeData.analysis)
      setMusicPrompt(analyzeData.musicPrompt)

      const musicResponse = await fetch("/api/generate-music", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: analyzeData.musicPrompt }),
      })

      if (!musicResponse.ok) {
        throw new Error("Failed to generate music")
      }

      const musicBlob = await musicResponse.blob()
      const url = URL.createObjectURL(musicBlob)
      setAudioUrl(url)

      saveGeneration({
        lyrics,
        analysis: analyzeData.analysis,
        musicPrompt: analyzeData.musicPrompt,
        audioUrl: url,
      })
    } catch (error) {
      console.error("Error:", error)
      alert(error instanceof Error ? error.message : "An error occurred")
    } finally {
      setGenerating(false)
    }
  }

  const handleReset = () => {
    setLyrics("")
    setAnalysis(undefined)
    setMusicPrompt("")
    setAudioUrl("")
    setStep(1)
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-900/20 to-slate-950">
      {/* Fixed Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-b from-slate-950/95 to-slate-950/70 backdrop-blur-xl border-b border-purple-500/10">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-lg bg-gradient-to-br from-purple-500 to-cyan-500 shadow-lg shadow-purple-500/50">
              <Music className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-200 via-cyan-100 to-amber-200 bg-clip-text text-transparent font-sans">
                Musical Poetry
              </h1>
              <p className="text-xs text-purple-300/60 mt-0.5">Transform your poetry into music</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="pt-28 pb-16 px-6">
        <div className="max-w-7xl mx-auto space-y-8">
          <div className="text-center mb-16 space-y-6 animate-fade-in">
            <div className="flex items-center justify-center gap-2 mb-4">
              <Sparkles className="w-5 h-5 text-purple-400 animate-pulse" />
              <span className="text-sm font-semibold text-purple-300 tracking-wider">AI-POWERED CREATIVE SUITE</span>
              <Sparkles className="w-5 h-5 text-purple-400 animate-pulse" />
            </div>
            <h2 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-purple-200 via-cyan-100 to-amber-200 bg-clip-text text-transparent max-w-4xl mx-auto leading-tight font-sans text-balance">
              Create Verses, Compose Melodies
            </h2>
            <p className="text-lg text-purple-300/70 max-w-2xl mx-auto leading-relaxed font-light">
              Generate stunning lyrics with AI and transform them into original music compositions. Perfect for poets,
              musicians, and creative minds.
            </p>
          </div>

          {/* Main Grid Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Input & Generation */}
            <div className="lg:col-span-2 space-y-6">
              {step === 1 && (
                <>
                  <div className="bg-gradient-to-br from-purple-900/20 to-cyan-900/10 rounded-xl shadow-xl border border-purple-500/20 p-1 backdrop-blur-sm">
                    <div className="flex gap-2">
                      <button
                        onClick={() => setInputMode("manual")}
                        className={`flex-1 py-4 px-6 rounded-lg font-semibold transition-all duration-300 flex items-center justify-center gap-2 ${
                          inputMode === "manual"
                            ? "bg-gradient-to-r from-blue-600 to-blue-500 text-white shadow-lg shadow-blue-500/50"
                            : "bg-slate-800/50 text-purple-300 hover:bg-slate-700/50 border border-slate-700/50"
                        }`}
                      >
                        <BookOpen className="w-5 h-5" />
                        Your Own Poetry
                      </button>
                      <button
                        onClick={() => setInputMode("generate")}
                        className={`flex-1 py-4 px-6 rounded-lg font-semibold transition-all duration-300 flex items-center justify-center gap-2 ${
                          inputMode === "generate"
                            ? "bg-gradient-to-r from-purple-600 to-pink-500 text-white shadow-lg shadow-purple-500/50"
                            : "bg-slate-800/50 text-purple-300 hover:bg-slate-700/50 border border-slate-700/50"
                        }`}
                      >
                        <Wand2 className="w-5 h-5" />
                        Generate with AI
                      </button>
                    </div>
                  </div>

                  <div className="transition-all duration-300">
                    {inputMode === "manual" ? (
                      <LyricsInput onLyricsSubmit={handleLyricsSubmit} initialValue={lyrics} />
                    ) : (
                      <LyricsGenerator onLyricsGenerated={handleLyricsSubmit} />
                    )}
                  </div>
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
                    className="w-full bg-gradient-to-r from-slate-700 to-slate-600 hover:from-slate-600 hover:to-slate-500 text-white font-semibold py-4 px-6 rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl border border-slate-500/30"
                  >
                    Start Over
                  </button>
                </>
              )}
            </div>

            {/* Right Column - History Sidebar */}
            <div className="lg:col-span-1">
              <div className="sticky top-24">
                <GenerationHistory />
              </div>
            </div>
          </div>

          {!lyrics && step === 1 && (
            <div className="text-center py-16 px-6 mt-8">
              <div className="inline-block p-6 rounded-2xl bg-gradient-to-br from-purple-500/10 to-cyan-500/10 border border-purple-500/20 mb-6 shadow-lg">
                <Music className="w-12 h-12 text-purple-400" />
              </div>
              <h3 className="text-2xl font-bold text-purple-200 mb-3 font-sans">Ready to Create?</h3>
              <p className="text-purple-300/70 max-w-md mx-auto text-base leading-relaxed">
                Choose between generating lyrics with AI or paste your own poem to get started on your musical journey
              </p>
            </div>
          )}
        </div>
      </div>

      <footer className="border-t border-purple-500/20 bg-gradient-to-r from-slate-950/50 via-purple-900/20 to-slate-950/50 backdrop-blur-sm py-12">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center space-y-3">
            <p className="text-sm font-semibold text-purple-300/80">Musical Poetry</p>
            <p className="text-xs text-purple-300/50">
              Empowering creative expression through AI • Powered by Google Gemini & Loudly
            </p>
          </div>
        </div>
      </footer>
    </main>
  )
}
