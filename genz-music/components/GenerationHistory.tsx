// Component for displaying saved music generations
'use client';

import { useState, useEffect } from 'react';
import { History, Play, Download, Trash2 } from 'lucide-react';
import { SavedGeneration } from '../types';
import { deleteGeneration, getGenerations } from '../lib/storage';


export default function GenerationHistory() {
  const [generations, setGenerations] = useState<SavedGeneration[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  useEffect(() => {
    loadGenerations();
  }, []);

  const loadGenerations = () => {
    setGenerations(getGenerations());
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this generation?')) {
      deleteGeneration(id);
      loadGenerations();
      if (selectedId === id) {
        setSelectedId(null);
      }
    }
  };

  const handleDownload = (audioUrl: string) => {
    const link = document.createElement('a');
    link.href = audioUrl;
    link.download = `music-${Date.now()}.mp3`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (generations.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center gap-2 mb-4">
          <History className="w-5 h-5 text-gray-600" />
          <h2 className="text-xl font-semibold text-gray-800">History</h2>
        </div>
        <p className="text-gray-500 text-center py-8">No saved generations yet</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center gap-2 mb-4">
        <History className="w-5 h-5 text-gray-600" />
        <h2 className="text-xl font-semibold text-gray-800">History</h2>
        <span className="ml-auto text-sm text-gray-500">{generations.length} saved</span>
      </div>

      <div className="space-y-3 max-h-96 overflow-y-auto">
        {generations.map((gen) => (
          <div
            key={gen.id}
            className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors"
          >
            <div className="flex items-start justify-between mb-2">
              <div className="flex-1">
                <p className="text-sm text-gray-600 line-clamp-2 mb-2">{gen.lyrics}</p>
                <div className="flex flex-wrap gap-2">
                  <span className="text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded">
                    {gen.analysis.mood}
                  </span>
                  <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                    {gen.analysis.style}
                  </span>
                </div>
              </div>
              <div className="flex gap-2 ml-4">
                <button
                  onClick={() => handleDownload(gen.audioUrl)}
                  className="p-2 text-blue-600 hover:bg-blue-50 rounded transition-colors"
                  title="Download"
                >
                  <Download className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(gen.id)}
                  className="p-2 text-red-600 hover:bg-red-50 rounded transition-colors"
                  title="Delete"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
            <p className="text-xs text-gray-400">
              {new Date(gen.createdAt).toLocaleDateString()} at{' '}
              {new Date(gen.createdAt).toLocaleTimeString()}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}