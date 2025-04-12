"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { useYoutubeHistory } from "@/hooks/use-youtube-history";

type YoutubeHistoryContextType = ReturnType<typeof useYoutubeHistory>;

const YoutubeHistoryContext = createContext<YoutubeHistoryContextType | null>(null);

export function YoutubeHistoryProvider({ children }: { children: React.ReactNode }) {
  const historyManager = useYoutubeHistory();

  return (
    <YoutubeHistoryContext.Provider value={historyManager}>
      {children}
    </YoutubeHistoryContext.Provider>
  );
}

export function useYoutubeHistoryContext() {
  const context = useContext(YoutubeHistoryContext);
  if (!context) {
    throw new Error("useYoutubeHistoryContext must be used within a YoutubeHistoryProvider");
  }
  return context;
}
