"use client";

import React, { useRef } from 'react';
import { GlassyTitle } from '../ui-elements/GlassyTitle';
import { GlassPanel } from '../ui-elements/GlassPanel';
import { CountSelector } from '../generation/CountSelector';
import { ImageUploader } from '../generation/ImageUploader';
import { useGenerationStore } from '@/store/useGenerationStore';
import { useFileUpload } from '@/hooks/useFileUpload';
import { useImageGeneration } from '@/hooks/useImageGeneration';

interface HomeScreenProps {
  profileName: string;
  greeting: string;
  customApiKey?: string;
}

/**
 * HomeScreen - Main screen for image upload and generation
 */
export function HomeScreen({ profileName, greeting, customApiKey }: HomeScreenProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const {
    selectedCount,
    uploadedImage,
    uploading,
    setSelectedCount,
    currentGeneration,
  } = useGenerationStore();
  
  const { handleImageUpload } = useFileUpload();
  const { generateImages } = useImageGeneration();
  
  const loading = currentGeneration.status === 'generating';
  const error = currentGeneration.error;

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const handleGenerate = async () => {
    await generateImages(customApiKey);
  };

  return (
    <div className="screen-content">
      <GlassyTitle>
        {greeting}, {profileName || 'Muse'}
      </GlassyTitle>
      
      <CountSelector
        value={selectedCount}
        onChange={setSelectedCount}
        disabled={loading}
      />
      
      <ImageUploader
        uploadedImage={uploadedImage}
        uploading={uploading}
        onImageSelect={triggerFileInput}
      />
      
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleImageUpload}
        style={{ display: 'none' }}
      />
      
      <button
        className="glass-3d-button primary-button w-full"
        onClick={handleGenerate}
        disabled={loading || !uploadedImage}
      >
        <span className="button-text">Generate Photoshoot</span>
      </button>
      
      {error && (
        <GlassPanel className="w-full mt-3 p-3" radius={16}>
          <p className="text-red-400 text-center text-xs">{error}</p>
        </GlassPanel>
      )}
    </div>
  );
}
