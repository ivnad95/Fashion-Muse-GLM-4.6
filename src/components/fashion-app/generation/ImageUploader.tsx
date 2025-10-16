import React from 'react';
import { GlassPanel } from '../ui-elements/GlassPanel';
import type { UploadedImage } from '@/types';

interface ImageUploaderProps {
  uploadedImage: UploadedImage | null;
  uploading: boolean;
  onImageSelect: () => void;
}

/**
 * ImageUploader - Display uploaded image or upload prompt
 */
export function ImageUploader({ uploadedImage, uploading, onImageSelect }: ImageUploaderProps) {
  return (
    <GlassPanel className="w-full aspect-[4/5] mb-4" radius={20}>
      <div 
        className="absolute inset-0 image-container cursor-pointer" 
        onClick={onImageSelect}
      >
        {uploadedImage ? (
          <img 
            src={uploadedImage.url} 
            alt="Uploaded preview" 
            className="object-cover w-full h-full" 
          />
        ) : (
          <div className="flex flex-col items-center justify-center h-full">
            <div className="w-20 h-20 mb-3 opacity-30">
              <img
                src="/logo.svg"
                alt="FASHION MUSE Studio"
                className="w-full h-full object-contain"
              />
            </div>
            <p className="text-gray-400 text-sm font-medium">Tap to upload your photo</p>
            <p className="text-gray-500 text-xs mt-1">Start your fashion transformation</p>
          </div>
        )}
        {uploading && (
          <div className="loading-pulse">
            <div className="loader" />
          </div>
        )}
      </div>
    </GlassPanel>
  );
}
