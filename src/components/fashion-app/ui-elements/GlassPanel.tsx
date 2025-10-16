import React from 'react';

interface GlassPanelProps {
  children: React.ReactNode;
  className?: string;
  radius?: number;
  onClick?: () => void;
}

/**
 * GlassPanel - Glassmorphism UI surface component
 * Creates a beautiful glass effect with backdrop blur
 */
export function GlassPanel({ 
  children, 
  className = "", 
  radius = 28,
  onClick 
}: GlassPanelProps) {
  return (
    <div
      className={`glass-3d-surface ${className}`}
      style={{ borderRadius: `${radius}px`, position: "relative" }}
      onClick={onClick}
    >
      {children}
    </div>
  );
}
