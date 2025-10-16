"use client";

import React from 'react';
import { GlassyTitle } from '../ui-elements/GlassyTitle';
import { GlassPanel } from '../ui-elements/GlassPanel';
import { ImagePlaceholder } from '../ui-elements/ImagePlaceholder';
import { GenerationProgress } from '../generation/GenerationProgress';
import { useGenerationStore } from '@/store/useGenerationStore';
import { useUIStore } from '@/store/useUIStore';

/**
 * ResultsScreen - Display generation results in a grid
 */
export function ResultsScreen() {
  const { currentGeneration, selectedCount, aspectRatio } = useGenerationStore();
  const { openLightbox } = useUIStore();
  
  const loading = currentGeneration.status === 'generating';
  const results = currentGeneration.results;
  const progress = currentGeneration.progress;
  const error = currentGeneration.error;

  // Placeholder array for empty slots
  const displayImages = results.length > 0 
    ? results 
    : Array(selectedCount).fill(null);

  const aspectRatioClass = {
    portrait: 'aspect-[3/4]',
    square: 'aspect-square',
    landscape: 'aspect-[4/3]',
  }[aspectRatio] || 'aspect-[3/4]';

  const allImagesReady = results.length > 0 && results.every(img => img !== null);

  return (
    <div className="screen-content fade-in">
      <GlassyTitle>Results</GlassyTitle>
      
      {loading && <GenerationProgress progress={progress} />}
      
      <div className="grid grid-cols-2 gap-4">
        {displayImages.map((img, i) => (
          <GlassPanel key={i} className={`w-full ${aspectRatioClass} ${loading ? 'result-placeholder-glow' : ''}`} radius={20}>
            <div className="absolute inset-0 image-container">
              {img ? (
                <div className="relative group w-full h-full">
                  <img
                    src={img}
                    alt={`Result ${i + 1}`}
                    className="object-cover w-full h-full rounded-lg cursor-pointer"
                    onClick={() => openLightbox(img)}
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-60 opacity-0 group-hover:opacity-100 flex items-center justify-center gap-4 rounded-lg transition-opacity">
                    <button
                      className="text-white hover:text-blue-400 transition-colors"
                      onClick={() => openLightbox(img)}
                      aria-label="View full size"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    </button>
                    <button
                      className="text-white hover:text-blue-400 transition-colors"
                      onClick={(e) => {
                        e.stopPropagation();
                        const link = document.createElement('a');
                        link.href = img;
                        link.download = `fashion-muse-${i + 1}.png`;
                        document.body.appendChild(link);
                        link.click();
                        document.body.removeChild(link);
                      }}
                      aria-label="Download image"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                      </svg>
                    </button>
                  </div>
                </div>
              ) : loading ? (
                <div className="flex flex-col items-center justify-center h-full">
                  <div className="relative">
                    <div className="w-8 h-8 border-2 border-gray-600 border-t-yellow-400 rounded-full animate-spin"></div>
                    <div className="absolute inset-0 w-8 h-8 border-2 border-transparent border-b-yellow-400 rounded-full animate-spin animation-delay-150"></div>
                  </div>
                  <p className="text-gray-400 text-xs mt-2">Generating...</p>
                </div>
              ) : (
                <ImagePlaceholder size="medium" />
              )}
            </div>
          </GlassPanel>
        ))}
      </div>
      
      {!loading && allImagesReady && (
        <GlassPanel className="w-full p-4 mt-4" radius={20}>
          <div className="flex items-center justify-center">
            <div className="flex items-center text-green-400">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="text-sm font-medium">Your fashion photos are ready!</span>
            </div>
          </div>
        </GlassPanel>
      )}
      
      {error && (
        <GlassPanel className="w-full mt-4 p-4" radius={20}>
          <p className="text-red-400 text-center text-sm">{error}</p>
        </GlassPanel>
      )}
    </div>
  );
}
