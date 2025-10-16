import React from 'react';

interface CountSelectorProps {
  value: number;
  onChange: (count: number) => void;
  disabled?: boolean;
}

/**
 * CountSelector - Select number of images to generate (1, 2, 4, 6, 8)
 */
export function CountSelector({ value, onChange, disabled = false }: CountSelectorProps) {
  const counts = [1, 2, 4, 6, 8];

  return (
    <div className="flex gap-2 mb-4">
      {counts.map((count) => (
        <button
          key={count}
          onClick={() => onChange(count)}
          disabled={disabled}
          className={`glass-3d-button number-chip ${value === count ? 'active' : ''}`}
          aria-label={`Generate ${count} image${count > 1 ? 's' : ''}`}
        >
          <span className="button-text">{count}</span>
        </button>
      ))}
    </div>
  );
}
