import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { TabType } from '@/types';

interface UIState {
  // Navigation
  currentTab: TabType;
  
  // Modals
  lightboxImage: string | null;
  showUpgradeModal: boolean;
  showDeleteConfirm: string | null; // generation ID
  
  // UI State
  sidebarOpen: boolean;
  theme: 'light' | 'dark' | 'auto';
  blurStrength: number;
  
  // Actions
  setTab: (tab: TabType) => void;
  openLightbox: (url: string) => void;
  closeLightbox: () => void;
  setShowUpgradeModal: (show: boolean) => void;
  setShowDeleteConfirm: (id: string | null) => void;
  toggleSidebar: () => void;
  setSidebarOpen: (open: boolean) => void;
  setTheme: (theme: 'light' | 'dark' | 'auto') => void;
  setBlurStrength: (strength: number) => void;
}

export const useUIStore = create<UIState>()(
  persist(
    (set) => ({
      // Initial state
      currentTab: 'home',
      lightboxImage: null,
      showUpgradeModal: false,
      showDeleteConfirm: null,
      sidebarOpen: false,
      theme: 'dark',
      blurStrength: 24,
      
      // Actions
      setTab: (tab) => set({ currentTab: tab }),
      
      openLightbox: (url) => set({ lightboxImage: url }),
      
      closeLightbox: () => set({ lightboxImage: null }),
      
      setShowUpgradeModal: (show) => set({ showUpgradeModal: show }),
      
      setShowDeleteConfirm: (id) => set({ showDeleteConfirm: id }),
      
      toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
      
      setSidebarOpen: (open) => set({ sidebarOpen: open }),
      
      setTheme: (theme) => set({ theme }),
      
      setBlurStrength: (strength) => {
        // Also update CSS variable
        if (typeof document !== 'undefined') {
          document.documentElement.style.setProperty('--glass-blur', `${strength}px`);
        }
        set({ blurStrength: strength });
      },
    }),
    {
      name: 'fashion-muse-ui', // localStorage key
      partialize: (state) => ({
        theme: state.theme,
        blurStrength: state.blurStrength,
      }), // Only persist theme and blur settings
    }
  )
);
