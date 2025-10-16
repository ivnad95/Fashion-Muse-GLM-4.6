"use client";

import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { GlassyTitle } from '../ui-elements/GlassyTitle';
import { GlassPanel } from '../ui-elements/GlassPanel';
import { ImagePlaceholder } from '../ui-elements/ImagePlaceholder';
import { saveAs } from 'file-saver';

interface Generation {
  id: string;
  imageUrls: string[];
  prompt: string;
  style: string | null;
  aspectRatio: string;
  createdAt: string;
}

export function HistoryScreen() {
  const { data: session, status } = useSession();
  const [history, setHistory] = useState<Generation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (status === 'authenticated') {
      const fetchHistory = async () => {
        try {
          const response = await fetch('/api/history');
          if (!response.ok) {
            throw new Error('Failed to fetch history');
          }
          const data = await response.json();
          setHistory(data.history);
        } catch (err) {
          setError('Could not load history.');
        }
        setLoading(false);
      };
      fetchHistory();
    }
  }, [status]);

  const handleDelete = async (generationId: string) => {
    if (!confirm('Are you sure you want to delete this generation?')) {
      return;
    }

    try {
      const response = await fetch(`/api/history?id=${generationId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete generation');
      }

      setHistory(history.filter((gen) => gen.id !== generationId));
    } catch (err) {
      setError('Could not delete generation.');
    }
  };

  const handleDownload = (imageUrl: string) => {
    saveAs(imageUrl, 'fashion-muse-generation.png');
  };

  if (status === 'loading') {
    return <div className="screen-content"><GlassyTitle>History</GlassyTitle><div className="loader"></div></div>;
  }

  if (status === 'unauthenticated') {
    return (
      <div className="screen-content">
        <GlassyTitle>History</GlassyTitle>
        <GlassPanel className="w-full p-6" radius={20}>
          <p className="text-center text-gray-400">Please sign in to view your generation history.</p>
        </GlassPanel>
      </div>
    );
  }

  return (
    <div className="screen-content">
      <GlassyTitle>History</GlassyTitle>
      {loading ? (
        <div className="loader"></div>
      ) : error ? (
        <p className="text-red-400">{error}</p>
      ) : history.length === 0 ? (
        <GlassPanel className="w-full p-6" radius={20}>
          <p className="text-center text-gray-400">No generations found.</p>
        </GlassPanel>
      ) : (
        <div className="space-y-6">
          {history.map((generation) => (
            <GlassPanel key={generation.id} className="w-full p-4" radius={24}>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {generation.imageUrls.map((url, index) => (
                  <div key={index} className="relative group">
                    <img src={url} alt={`Generated image ${index + 1}`} className="rounded-lg object-cover w-full h-full" />
                    <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <button onClick={() => window.open(url, '_blank')} className="text-white p-2"><svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 1h6v6h-6zM1 13h6v6h-6zM13 1h6v6h-6zM13 13h6v6h-6z"/></svg></button>
                      <button onClick={() => handleDownload(url)} className="text-white p-2"><svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3"/></svg></button>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-4 flex justify-between items-center">
                <div>
                  <p className="text-white text-sm">{new Date(generation.createdAt).toLocaleString()}</p>
                  <p className="text-gray-400 text-xs">{generation.prompt}</p>
                </div>
                <button onClick={() => handleDelete(generation.id)} className="text-red-400 p-2"><svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/></svg></button>
              </div>
            </GlassPanel>
          ))}
        </div>
      )}
    </div>
  );
}
