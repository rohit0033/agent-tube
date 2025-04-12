"use client";

import { useState, useEffect, useCallback } from "react";

type YoutubeHistory = {
  videoId: string;
  title?: string;
  timestamp: number;
};

export function useYoutubeHistory(maxItems = 10) {
  const [history, setHistory] = useState<YoutubeHistory[]>([]);
  const [isInitialized, setIsInitialized] = useState(false);

  // Load history from localStorage on component mount
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    try {
      const savedHistory = localStorage.getItem("youtube-history");
      if (savedHistory) {
        const parsedHistory = JSON.parse(savedHistory);
        setHistory(parsedHistory);
      }
    } catch (error) {
      console.error("Failed to load YouTube history:", error);
    } finally {
      setIsInitialized(true);
    }
  }, []);

  // Save to localStorage whenever history changes
  useEffect(() => {
    if (typeof window === 'undefined' || !isInitialized) return;
    
    try {
      localStorage.setItem("youtube-history", JSON.stringify(history));
    } catch (error) {
      console.error("Failed to save YouTube history:", error);
    }
  }, [history, isInitialized]);

  // Add a video to history
  const addToHistory = useCallback((videoId: string, title?: string) => {
    if (!videoId) return;
    
    setHistory((prev) => {
      // Remove if already exists to avoid duplicates
      const filtered = prev.filter((item) => item.videoId !== videoId);
      
      // Add new entry at the beginning
      const newHistory = [
        { videoId, title: title || '', timestamp: Date.now() },
        ...filtered,
      ].slice(0, maxItems);
      
      return newHistory;
    });
  }, [maxItems]);

  // Clear history
  const clearHistory = useCallback(() => {
    setHistory([]);
  }, []);

  return {
    history,
    addToHistory,
    clearHistory,
    isInitialized
  };
}
