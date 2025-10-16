import { useCallback } from 'react';
import { useSession } from 'next-auth/react';
import { useGenerationStore } from '@/store/useGenerationStore';
import { useUIStore } from '@/store/useUIStore';
import type { GenerationRequest, GenerationResponse } from '@/types';

/**
 * Helper to convert File to base64 for Gemini API
 */
async function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const result = (reader.result as string) || "";
      const base64 = result.split(",")[1] || "";
      resolve(base64);
    };
    reader.readAsDataURL(file);
  });
}

/**
 * Custom hook for image generation logic
 */
export function useImageGeneration() {
  const { data: session } = useSession();
  const { setTab } = useUIStore();
  const {
    uploadedImage,
    selectedCount,
    startGeneration,
    updateProgress,
    setResults,
    setError,
    completeGeneration,
  } = useGenerationStore();

  const generateImages = useCallback(async (customApiKey?: string) => {
    if (!uploadedImage?.file) {
      setError("Please upload an image first.");
      return { success: false, error: "No image uploaded" };
    }

    try {
      // Start generation
      const generationId = `gen_${Date.now()}`;
      startGeneration(generationId, selectedCount);
      
      // Switch to results page immediately
      setTab('results');

      // Convert file to base64
      const base64Data = await fileToBase64(uploadedImage.file);

      // Determine API key source
      let apiKey = "";
      let useUserAccount = false;

      if (session) {
        useUserAccount = true;
        console.log('Using authenticated Google account for API access');
      } else {
        apiKey = customApiKey || localStorage.getItem("virtualPhotoshoot.customApiKey") || "";
        if (!apiKey) {
          throw new Error("Please set your Gemini API key in Settings first or sign in with Google.");
        }
      }

      console.log('Starting generation with Gemini 2.5 Flash...');
      console.log('Number of images:', selectedCount);

      // Make API request
      const requestBody: GenerationRequest = {
        image: base64Data,
        numberOfImages: selectedCount,
        apiKey,
        useUserAccount,
        userId: session?.user?.email || 'anonymous',
      };

      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        const text = await response.text();
        throw new Error(`API error ${response.status}: ${text}`);
      }

      const data: GenerationResponse = await response.json();
      console.log('API Response:', data);

      if (data.success && data.results) {
        // Process results
        const resultsArray = Array(selectedCount).fill(null);
        
        // Place successful images
        data.results.successful.forEach((result) => {
          resultsArray[result.index] = result.imageUrl;
        });

        updateProgress(selectedCount, selectedCount);
        setResults(resultsArray);
        completeGeneration();

        // Show error for failed images
        if (data.results.failed.length > 0) {
          const failedNames = data.results.failed.map((f) => f.name).join(', ');
          setError(`Some images failed: ${failedNames}`);
        }

        return { success: true, data };
      } else {
        throw new Error(data.error || 'Unknown error occurred');
      }
    } catch (error: any) {
      console.error('Generation error:', error);
      const errorMessage = error?.message || "Generation error";
      setError(errorMessage);
      updateProgress(selectedCount, selectedCount);
      return { success: false, error: errorMessage };
    }
  }, [uploadedImage, selectedCount, session, startGeneration, updateProgress, setResults, setError, completeGeneration, setTab]);

  return {
    generateImages,
  };
}
