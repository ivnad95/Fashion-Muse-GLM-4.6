import React from 'react';

interface PhoneFrameProps {
  children: React.ReactNode;
}

/**
 * PhoneFrame - iPhone-style frame container with gradient background
 */
export function PhoneFrame({ children }: PhoneFrameProps) {
  return (
    <div className="phone">
      <div className="phone-shimmer-bg" />
      {children}
    </div>
  );
}
