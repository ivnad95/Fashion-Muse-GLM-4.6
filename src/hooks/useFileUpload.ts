import { useCallback, useRef } from 'react';
import { useGenerationStore } from '@/store/useGenerationStore';
import type { UploadedImage } from '@/types';

/**
 * Custom hook for handling file uploads
 */
export function useFileUpload() {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const { setUploadedImage, setUploading, uploadedImage } = useGenerationStore();

  const triggerFileInput = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  const handleImageUpload = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;

      setUploading(true);

      // Revoke previous object URL to prevent memory leaks
      if (uploadedImage?.url) {
        try {
          URL.revokeObjectURL(uploadedImage.url);
        } catch (error) {
          console.error('Error revoking URL:', error);
        }
      }

      // Create new object URL
      const url = URL.createObjectURL(file);
      const newImage: UploadedImage = { url, file };
      
      setUploadedImage(newImage);

      // Reset input value to allow re-uploading same file
      if (e.target) {
        try {
          (e.target as HTMLInputElement).value = "";
        } catch (error) {
          console.error('Error resetting input:', error);
        }
      }

      setTimeout(() => setUploading(false), 500);
    },
    [uploadedImage, setUploadedImage, setUploading]
  );

  // Cleanup function
  const cleanup = useCallback(() => {
    if (uploadedImage?.url) {
      try {
        URL.revokeObjectURL(uploadedImage.url);
      } catch (error) {
        console.error('Error during cleanup:', error);
      }
    }
  }, [uploadedImage]);

  return {
    fileInputRef,
    triggerFileInput,
    handleImageUpload,
    cleanup,
  };
}
