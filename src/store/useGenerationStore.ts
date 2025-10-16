import { create } from 'zustand';
import type { UploadedImage, AspectRatio, GenerationProgress } from '@/types';

interface GenerationState {
  // Current generation
  currentGeneration: {
    id: string | null;
    status: 'idle' | 'uploading' | 'generating' | 'completed' | 'failed';
    progress: GenerationProgress;
    results: (string | null)[];
    error: string | null;
  };
  
  // Settings
  selectedCount: number;
  aspectRatio: AspectRatio;
  uploadedImage: UploadedImage | null;
  uploading: boolean;
  
  // Actions
  setSelectedCount: (count: number) => void;
  setAspectRatio: (ratio: AspectRatio) => void;
  setUploadedImage: (image: UploadedImage | null) => void;
  setUploading: (uploading: boolean) => void;
  startGeneration: (id: string, total: number) => void;
  updateProgress: (done: number, total: number) => void;
  addResult: (index: number, url: string) => void;
  setResults: (results: (string | null)[]) => void;
  setError: (error: string) => void;
  completeGeneration: () => void;
  reset: () => void;
}

const initialState = {
  currentGeneration: {
    id: null,
    status: 'idle' as const,
    progress: { done: 0, total: 0 },
    results: [],
    error: null,
  },
  selectedCount: 1,
  aspectRatio: 'portrait' as AspectRatio,
  uploadedImage: null,
  uploading: false,
};

export const useGenerationStore = create<GenerationState>((set) => ({
  ...initialState,
  
  setSelectedCount: (count) => set({ selectedCount: count }),
  
  setAspectRatio: (ratio) => set({ aspectRatio: ratio }),
  
  setUploadedImage: (image) => set({ uploadedImage: image }),
  
  setUploading: (uploading) => set({ uploading }),
  
  startGeneration: (id, total) => set((state) => ({
    currentGeneration: {
      ...state.currentGeneration,
      id,
      status: 'generating',
      progress: { done: 0, total },
      results: Array(total).fill(null),
      error: null,
    },
  })),
  
  updateProgress: (done, total) => set((state) => ({
    currentGeneration: {
      ...state.currentGeneration,
      progress: { done, total },
    },
  })),
  
  addResult: (index, url) => set((state) => {
    const newResults = [...state.currentGeneration.results];
    newResults[index] = url;
    return {
      currentGeneration: {
        ...state.currentGeneration,
        results: newResults,
      },
    };
  }),
  
  setResults: (results) => set((state) => ({
    currentGeneration: {
      ...state.currentGeneration,
      results,
    },
  })),
  
  setError: (error) => set((state) => ({
    currentGeneration: {
      ...state.currentGeneration,
      status: 'failed',
      error,
    },
  })),
  
  completeGeneration: () => set((state) => ({
    currentGeneration: {
      ...state.currentGeneration,
      status: 'completed',
    },
  })),
  
  reset: () => set(initialState),
}));
