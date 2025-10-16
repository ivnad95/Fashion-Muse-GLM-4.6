"use client";

import React, { useState, useEffect } from 'react';
import { useSession, signIn, signOut } from 'next-auth/react';
import { GlassyTitle } from '../ui-elements/GlassyTitle';
import { GlassPanel } from '../ui-elements/GlassPanel';
import { useGenerationStore } from '@/store/useGenerationStore';
import { useUIStore } from '@/store/useUIStore';
import type { AspectRatio } from '@/types';

interface SettingsScreenProps {
  profileName: string;
  setProfileName: (name: string) => void;
  customApiKey: string;
  setCustomApiKey: (key: string) => void;
}

/**
 * SettingsScreen - User settings and configuration
 */
export function SettingsScreen({
  profileName,
  setProfileName,
  customApiKey,
  setCustomApiKey,
}: SettingsScreenProps) {
  const { data: session, status } = useSession();
  const { aspectRatio, setAspectRatio } = useGenerationStore();
  const { blurStrength, setBlurStrength } = useUIStore();
  
  const [localName, setLocalName] = useState(profileName);
  const [localApiKey, setLocalApiKey] = useState(customApiKey);

  useEffect(() => {
    setLocalName(profileName);
  }, [profileName]);

  useEffect(() => {
    setLocalApiKey(customApiKey);
  }, [customApiKey]);

  const handleSaveSettings = () => {
    setProfileName(localName);
    setCustomApiKey(localApiKey);
    
    // Save to localStorage
    localStorage.setItem("virtualPhotoshoot.profileName", localName);
    if (localApiKey) {
      localStorage.setItem("virtualPhotoshoot.customApiKey", localApiKey);
    }
    
    alert("Settings saved successfully!");
  };

  const clamp = (value: number, min: number, max: number) => {
    return Math.min(Math.max(value, min), max);
  };

  return (
    <div className="screen-content space-y-6">
      <GlassyTitle>Settings</GlassyTitle>
      
      {/* Authentication Section */}
      <GlassPanel className="w-full p-4" radius={24}>
        <h3 className="text-white font-semibold mb-4">Account</h3>
        {status === 'loading' ? (
          <div className="flex items-center justify-center py-4">
            <div className="loader"></div>
          </div>
        ) : session ? (
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              {session.user?.image ? (
                <img 
                  src={session.user.image} 
                  alt="Profile" 
                  className="w-16 h-16 rounded-full object-cover" 
                />
              ) : (
                <div className="w-16 h-16 rounded-full bg-gray-700 flex items-center justify-center text-xl text-gray-400">
                  <span>{session.user?.name?.charAt(0).toUpperCase() || 'U'}</span>
                </div>
              )}
              <div className="flex-grow">
                <p className="text-white font-medium">{session.user?.name}</p>
                <p className="text-gray-400 text-sm">{session.user?.email}</p>
              </div>
            </div>
            <div className="bg-green-500/20 border border-green-500/50 rounded-lg p-3">
              <p className="text-green-400 text-sm">
                ✓ Signed in with Google - Using your Gemini API key automatically
              </p>
            </div>
            <button 
              className="glass-3d-button delete-button w-full"
              onClick={() => signOut()}
            >
              <span className="button-text">Sign Out</span>
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="bg-yellow-500/20 border border-yellow-500/50 rounded-lg p-3">
              <p className="text-yellow-400 text-sm mb-2">
                Sign in with Google to automatically use your Gemini API key
              </p>
              <p className="text-gray-400 text-xs">
                No manual API key configuration needed
              </p>
            </div>
            <button 
              className="glass-3d-button primary-button w-full flex items-center justify-center gap-2"
              onClick={() => signIn('google')}
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              <span className="button-text">Sign in with Google</span>
            </button>
          </div>
        )}
      </GlassPanel>

      {/* Manual API Key Section (only when not signed in) */}
      {!session && (
        <GlassPanel className="w-full p-4" radius={24}>
          <h3 className="text-white font-semibold mb-4">Manual API Key Setup</h3>
          <div className="space-y-4">
            <div>
              <label className="text-gray-300/80 text-sm mb-1 block">Gemini API Key</label>
              <input
                className="glass-3d-button px-3 py-2 rounded-md text-gray-900 bg-white/80 focus:outline-none w-full"
                placeholder="Enter your Gemini API key"
                value={localApiKey}
                onChange={(e) => setLocalApiKey(e.target.value)}
                type="password"
              />
              <p className="text-gray-400 text-xs mt-1">
                Get your key from: <span className="text-blue-400">makersuite.google.com/app/apikey</span>
              </p>
            </div>
          </div>
        </GlassPanel>
      )}

      {/* Profile Settings (always shown) */}
      <GlassPanel className="w-full p-4" radius={24}>
        <h3 className="text-white font-semibold mb-4">Profile Settings</h3>
        <div className="flex flex-col gap-4">
          <div>
            <label className="text-gray-300/80 text-sm mb-1 block">Display Name</label>
            <input
              className="glass-3d-button px-3 py-2 rounded-md text-gray-900 bg-white/80 focus:outline-none w-full"
              placeholder="Enter your name"
              value={localName}
              onChange={(e) => setLocalName(e.target.value)}
            />
          </div>
          <div>
            <label className="text-gray-300/80 text-sm mb-1 block">Aspect Ratio</label>
            <select
              className="glass-3d-button px-3 py-2 rounded-md bg-white/80 text-gray-900 w-full"
              value={aspectRatio}
              onChange={(e) => setAspectRatio(e.target.value as AspectRatio)}
            >
              <option value="portrait">Portrait (3/4)</option>
              <option value="square">Square (1/1)</option>
              <option value="landscape">Landscape (4/3)</option>
            </select>
          </div>
          <div className="flex flex-col">
            <label className="text-gray-300/80 text-sm mb-1">Glass Blur (10–50px)</label>
            <input
              type="range"
              min="10"
              max="50"
              step="1"
              value={blurStrength}
              onChange={(e) => setBlurStrength(clamp(parseInt(e.target.value, 10), 10, 50))}
              className="w-full"
            />
            <span className="text-gray-400 text-xs mt-1">Current blur: {blurStrength}px</span>
          </div>
          <div className="flex gap-3 mt-4">
            <button 
              className="glass-3d-button flex-1 py-3 px-6 rounded-xl" 
              onClick={handleSaveSettings}
            >
              <span className="button-text">Save Settings</span>
            </button>
          </div>
        </div>
      </GlassPanel>
    </div>
  );
}
