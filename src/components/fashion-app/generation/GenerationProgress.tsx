import React from 'react';
import { GlassPanel } from '../ui-elements/GlassPanel';
import type { GenerationProgress as ProgressType } from '@/types';

interface GenerationProgressProps {
  progress: ProgressType;
}

/**
 * GenerationProgress - Shows generation progress with animated loader
 */
export function GenerationProgress({ progress }: GenerationProgressProps) {
  const percentage = progress.total > 0 
    ? (progress.done / progress.total) * 100 
    : 0;

  return (
    <GlassPanel className="w-full p-6 mb-4" radius={20}>
      <div className="flex flex-col items-center">
        <div className="w-16 h-16 mb-4 opacity-40">
          <img
            src="/logo.svg"
            alt="FASHION MUSE Studio"
            className="w-full h-full object-contain animate-pulse"
          />
        </div>
        <div className="flex space-x-2 mb-3">
          <div className="w-3 h-3 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
          <div className="w-3 h-3 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
          <div className="w-3 h-3 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
        </div>
        <p className="text-gray-300 text-center text-sm font-medium">
          Creating your fashion photos...
        </p>
        <p className="text-gray-400 text-center text-xs mt-1">
          {progress.done} of {progress.total} images ready
        </p>
        <div className="w-full bg-gray-700 rounded-full h-2 mt-3">
          <div 
            className="bg-gradient-to-r from-blue-400 to-purple-500 h-2 rounded-full transition-all duration-500 ease-out"
            style={{ width: `${percentage}%` }}
          ></div>
        </div>
      </div>
    </GlassPanel>
  );
}
