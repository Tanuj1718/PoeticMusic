// Component for displaying saved music generations
'use client';

import { useState, useEffect } from 'react';
import { History, Download, Trash2, Music2 } from 'lucide-react';
import { SavedGeneration } from '../types';
import { deleteGeneration, getGenerations } from '../lib/storage';


export default function GenerationHistory() {
  const [generations, setGenerations] = useState<SavedGeneration[]>([]);

  useEffect(() => {
    loadGenerations();
    
    // Reload when storage changes (e.g., new generation added)
    const handleStorageChange = () => loadGenerations();
    window.addEventListener('storage', handleStorageChange);
    
    // Custom event for same-tab updates
    window.addEventListener('generationsUpdated', handleStorageChange);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('generationsUpdated', handleStorageChange);
    };
  }, []);

  const loadGenerations = () => {
    setGenerations(getGenerations());
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this generation?')) {
      deleteGeneration(id);
      loadGenerations();
    }
  };

  const handleDownload = (audioUrl: string, index: number) => {
    // audioUrl is now base64, so we can directly use it
    const link = document.createElement('a');
    link.href = audioUrl;
    link.download = `musical-poetry-${index + 1}.mp3`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (generations.length === 0) {
    return (
      <div className="bg-gradient-to-br from-slate-900/50 to-purple-900/20 rounded-xl border border-purple-500/20 p-6 backdrop-blur-sm">
        <div className="flex items-center gap-2 mb-4">
          <History className="w-5 h-5 text-purple-300" />
          <h2 className="text-xl font-semibold text-purple-100">History</h2>
        </div>
        <div className="text-center py-8">
          <Music2 className="w-12 h-12 text-purple-400/30 mx-auto mb-3" />
          <p className="text-purple-300/50 text-sm">No saved generations yet</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-slate-900/50 to-purple-900/20 rounded-xl border border-purple-500/20 p-6 backdrop-blur-sm">
      <div className="flex items-center gap-2 mb-4">
        <History className="w-5 h-5 text-purple-300" />
        <h2 className="text-xl font-semibold text-purple-100">History</h2>
        <span className="ml-auto text-sm text-purple-300/60">{generations.length} saved</span>
      </div>

      <div className="space-y-3 max-h-[600px] overflow-y-auto pr-2">
        {generations.map((gen, index) => (
          <div
            key={gen.id}
            className="border border-purple-500/20 rounded-lg p-4 hover:bg-purple-500/10 transition-all duration-300 bg-slate-800/40 backdrop-blur-sm"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1 min-w-0">
                <p className="text-sm text-purple-100/80 line-clamp-2 mb-3 leading-relaxed">
                  {gen.lyrics}
                </p>
                <div className="flex flex-wrap gap-2">
                  <span className="text-xs bg-purple-500/20 text-purple-200 px-2.5 py-1 rounded-full border border-purple-500/30">
                    {gen.analysis.mood}
                  </span>
                  <span className="text-xs bg-cyan-500/20 text-cyan-200 px-2.5 py-1 rounded-full border border-cyan-500/30">
                    {gen.analysis.style}
                  </span>
                </div>
              </div>
              <div className="flex gap-2 ml-3 flex-shrink-0">
                <button
                  onClick={() => handleDownload(gen.audioUrl, index)}
                  className="p-2 text-amber-400 hover:bg-amber-500/20 rounded-lg transition-all duration-300 border border-amber-500/20 hover:border-amber-500/40"
                  title="Download audio"
                >
                  <Download className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(gen.id)}
                  className="p-2 text-red-400 hover:bg-red-500/20 rounded-lg transition-all duration-300 border border-red-500/20 hover:border-red-500/40"
                  title="Delete"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
            <p className="text-xs text-purple-300/40">
              {new Date(gen.createdAt).toLocaleDateString()} at{' '}
              {new Date(gen.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}