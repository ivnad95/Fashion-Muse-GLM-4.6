import React from 'react';
import type { TabType } from '@/types';

interface NavButtonProps {
  icon: React.ReactNode;
  isActive: boolean;
  onClick: () => void;
  label: string;
}

function NavButton({ icon, isActive, onClick, label }: NavButtonProps) {
  return (
    <button
      className={`glass-3d-button nav-button ${isActive ? 'active' : ''}`}
      onClick={onClick}
      aria-label={label}
      title={label}
    >
      {icon}
    </button>
  );
}

// Minimal SVG Icons
const HomeIcon = () => (
  <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
    <polyline points="9 22 9 12 15 12 15 22"/>
  </svg>
);

const ResultsIcon = () => (
  <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="3" y="3" width="7" height="7" rx="1"/>
    <rect x="14" y="3" width="7" height="7" rx="1"/>
    <rect x="3" y="14" width="7" height="7" rx="1"/>
    <rect x="14" y="14" width="7" height="7" rx="1"/>
  </svg>
);

const HistoryIcon = () => (
  <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="12" cy="12" r="10"/>
    <polyline points="12 6 12 12 16 14"/>
  </svg>
);

const SettingsIcon = () => (
  <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="12" cy="12" r="3"/>
    <path d="M12 1v6m0 6v6m4.22-13.22l4.24 4.24M1.54 9.96l4.24 4.24m12.44 0l4.24 4.24M1.54 14.04l4.24-4.24"/>
  </svg>
);

interface BottomNavigationProps {
  currentTab: TabType;
  onTabChange: (tab: TabType) => void;
}

/**
 * BottomNavigation - Navigation bar with glass effect
 */
export function BottomNavigation({ currentTab, onTabChange }: BottomNavigationProps) {
  return (
    <nav className="glass-3d-surface bottom-nav">
      <NavButton
        icon={<HomeIcon />}
        isActive={currentTab === 'home'}
        onClick={() => onTabChange('home')}
        label="Home"
      />
      <NavButton
        icon={<ResultsIcon />}
        isActive={currentTab === 'results'}
        onClick={() => onTabChange('results')}
        label="Results"
      />
      <NavButton
        icon={<HistoryIcon />}
        isActive={currentTab === 'history'}
        onClick={() => onTabChange('history')}
        label="History"
      />
      <NavButton
        icon={<SettingsIcon />}
        isActive={currentTab === 'settings'}
        onClick={() => onTabChange('settings')}
        label="Settings"
      />
    </nav>
  );
}
