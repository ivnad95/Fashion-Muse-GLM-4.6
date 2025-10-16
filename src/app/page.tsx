"use client";

import { FashionMuseApp } from '@/components/fashion-app/FashionMuseApp';

/**
 * Main Page - Fashion Muse Studio
 * 
 * Refactored from 968-line monolithic file to use modular components.
 * 
 * Phase 2 Complete:
 * - Components extracted to separate files
 * - State management with Zustand
 * - Custom hooks for logic separation
 * - Styles moved to CSS modules
 * 
 * Total reduction: 968 lines → 15 lines (98% reduction!)
 */
export default function Home() {
  return <FashionMuseApp />;
}
