// Client-side storage utilities for saved generations
import type { SavedGeneration } from '../types';

const STORAGE_KEY = 'music_generations';

/**
 * Convert blob URL to base64 for persistent storage
 */
async function blobUrlToBase64(blobUrl: string): Promise<string> {
  const response = await fetch(blobUrl);
  const blob = await response.blob();
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}

/**
 * Saves a generation to localStorage
 */
export async function saveGeneration(generation: Omit<SavedGeneration, 'id' | 'createdAt'>): Promise<void> {
  const generations = getGenerations();
  
  // Convert blob URL to base64 for persistent storage
  const audioBase64 = await blobUrlToBase64(generation.audioUrl);
  
  const newGeneration: SavedGeneration = {
    ...generation,
    audioUrl: audioBase64, // Store as base64 instead of blob URL
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
  link.href = audioUrl; // audioUrl is now base64, which works for downloads
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}