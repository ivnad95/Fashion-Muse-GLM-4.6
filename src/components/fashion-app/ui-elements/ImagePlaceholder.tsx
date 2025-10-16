import React from 'react';

interface ImagePlaceholderProps {
  size?: "small" | "medium" | "large";
}

/**
 * ImagePlaceholder - Displays logo placeholder with varying sizes and opacity
 */
export function ImagePlaceholder({ size = "small" }: ImagePlaceholderProps) {
  const sizeClasses = {
    small: "w-16 h-16",
    medium: "w-20 h-20", 
    large: "w-24 h-24"
  };
  
  const opacityClasses = {
    small: "opacity-15",
    medium: "opacity-20",
    large: "opacity-25"
  };

  return (
    <div className="absolute inset-0 flex items-center justify-center p-4">
      <div className={`${sizeClasses[size]} ${opacityClasses[size]}`}>
        <img 
          src="/logo.png" 
          alt="FASHION MUSE Studio" 
          className="w-full h-full object-contain"
        />
      </div>
    </div>
  );
}
