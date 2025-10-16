"use client";

import React, { useState, useEffect } from 'react';
import { PhoneFrame, BottomNavigation, Lightbox } from './ui-elements';
import { HomeScreen, ResultsScreen, HistoryScreen, SettingsScreen } from './screens';
import { useUIStore } from '@/store/useUIStore';
import { ErrorBoundary } from '@/components/error-boundary';

/**
 * Helper function to get greeting based on time of day
 */
function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 18) return "Good afternoon";
  return "Good evening";
}

/**
 * FashionMuseApp - Main application component
 */
export function FashionMuseApp() {
  const { currentTab, setTab } = useUIStore();
  const [greeting, setGreeting] = useState<string>(getGreeting());
  const [profileName, setProfileName] = useState<string>("");
  const [customApiKey, setCustomApiKey] = useState<string>("");

  // Load saved settings from localStorage
  useEffect(() => {
    try {
      const name = localStorage.getItem("virtualPhotoshoot.profileName");
      const apiKey = localStorage.getItem("virtualPhotoshoot.customApiKey");
      if (name) setProfileName(name);
      if (apiKey) setCustomApiKey(apiKey);
    } catch (error) {
      console.error('Error loading settings:', error);
    }
  }, []);

  // Update greeting every minute
  useEffect(() => {
    const updateGreeting = () => {
      setGreeting(getGreeting());
    };

    updateGreeting();
    const interval = setInterval(updateGreeting, 60000);

    return () => clearInterval(interval);
  }, []);

  return (
    <ErrorBoundary>
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-900 via-purple-900 to-blue-900 p-4">
        <PhoneFrame>
          <div className="screen-content">
            {currentTab === 'home' && (
              <HomeScreen
                profileName={profileName}
                greeting={greeting}
                customApiKey={customApiKey}
              />
            )}
            
            {currentTab === 'results' && <ResultsScreen />}
            
            {currentTab === 'history' && <HistoryScreen />}
            
            {currentTab === 'settings' && (
              <SettingsScreen
                profileName={profileName}
                setProfileName={setProfileName}
                customApiKey={customApiKey}
                setCustomApiKey={setCustomApiKey}
              />
            )}
          </div>
          
          <BottomNavigation
            currentTab={currentTab}
            onTabChange={setTab}
          />
        </PhoneFrame>
        
        <Lightbox />
      </div>
    </ErrorBoundary>
  );
}
