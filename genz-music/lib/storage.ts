// Client-side storage utilities for saved generations
import type { SavedGeneration } from '../types';

const STORAGE_KEY = 'music_generations';

/**
 * Saves a generation to localStorage
 */
export function saveGeneration(generation: Omit<SavedGeneration, 'id' | 'createdAt'>): void {
  const generations = getGenerations();
  const newGeneration: SavedGeneration = {
    ...generation,
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
  };
  
  generations.unshift(newGeneration);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(generations));
}

/**
 * Retrieves all saved generations from localStorage
 */
export function getGenerations(): SavedGeneration[] {
  if (typeof window === 'undefined') return [];
  
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) return [];
  
  try {
    return JSON.parse(stored);
  } catch (error) {
    console.error('Error parsing stored generations:', error);
    return [];
  }
}

/**
 * Deletes a generation by ID
 */
export function deleteGeneration(id: string): void {
  const generations = getGenerations();
  const filtered = generations.filter(g => g.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
}

/**
 * Clears all saved generations
 */
export function clearAllGenerations(): void {
  localStorage.removeItem(STORAGE_KEY);
}

/**
 * Downloads audio file to user's device
 */
export function downloadAudio(audioUrl: string, filename: string): void {
  const link = document.createElement('a');
  link.href = audioUrl;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}