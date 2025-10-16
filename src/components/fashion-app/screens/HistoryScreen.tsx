"use client";

import React from 'react';
import { GlassyTitle } from '../ui-elements/GlassyTitle';
import { GlassPanel } from '../ui-elements/GlassPanel';
import { ImagePlaceholder } from '../ui-elements/ImagePlaceholder';
import { useGenerationStore } from '@/store/useGenerationStore';

/**
 * HistoryScreen - Display generation history
 * TODO: Connect to database in Phase 3
 */
export function HistoryScreen() {
  const { uploadedImage, aspectRatio } = useGenerationStore();

  const aspectRatioClass = {
    portrait: 'aspect-[3/4]',
    square: 'aspect-square',
    landscape: 'aspect-[4/3]',
  }[aspectRatio] || 'aspect-[3/4]';

  return (
    <div className="screen-content">
      <GlassyTitle>History</GlassyTitle>
      
      {/* Placeholder - will be replaced with database integration in Phase 3 */}
      <GlassPanel className={`w-full ${aspectRatioClass} mb-4`} radius={24}>
        <div className="absolute inset-0 image-container">
          {uploadedImage ? (
            <img 
              src={uploadedImage.url} 
              alt="Previously generated" 
              className="object-cover w-full h-full" 
            />
          ) : (
            <ImagePlaceholder size="large" />
          )}
        </div>
      </GlassPanel>
      
      <GlassPanel className="w-full p-6" radius={20}>
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 opacity-30">
            <img 
              src="/logo.png" 
              alt="FASHION MUSE Studio" 
              className="w-full h-full object-contain"
            />
          </div>
          <p className="text-gray-300 font-medium mb-2">History Coming Soon</p>
          <p className="text-gray-400 text-sm">
            Your generation history will be available here after Phase 3 implementation.
          </p>
        </div>
      </GlassPanel>
    </div>
  );
}
