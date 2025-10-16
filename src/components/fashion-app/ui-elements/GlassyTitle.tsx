import React from 'react';

interface GlassyTitleProps {
  children: React.ReactNode;
  className?: string;
}

/**
 * GlassyTitle - Title component with glass effect background
 */
export function GlassyTitle({ children, className = "" }: GlassyTitleProps) {
  return (
    <div className={`glass-3d-surface p-4 mb-4 ${className}`} style={{ borderRadius: "20px" }}>
      <h1 className="text-white font-bold" style={{ 
        fontSize: "2.25rem", 
        fontWeight: "700", 
        lineHeight: "1.1",
        textShadow: "0 2px 4px rgba(0,0,0,0.3)"
      }}>
        {children}
      </h1>
    </div>
  );
}
