import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

type ToolName = 'KEYWORD_FINDER' | 'THUMBNAIL_MAKER' | 'THUMBNAIL_COMPARER' | 'CONTENT_IDEATION' | 'VIDEO_SCRIPT_HELPER' | 'UPLOAD_TIME_SUGGESTER';

const TOOL_USAGE_LIMIT = 10;
const GUEST_USAGE_DB_KEY = 'yt-seo-guest-usage-db';

interface GuestUsageContextType {
  isUsageBlocked: (tool: ToolName) => boolean;
  incrementUsage: (tool: ToolName) => void;
  getRemainingUsage: (tool: ToolName) => number;
}

const GuestUsageContext = createContext<GuestUsageContextType | undefined>(undefined);

type UsageDB = {
  [key in ToolName]?: number;
};

export const GuestUsageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [usage, setUsage] = useState<UsageDB>({});

  useEffect(() => {
    try {
      const storedUsage = localStorage.getItem(GUEST_USAGE_DB_KEY);
      if (storedUsage) {
        setUsage(JSON.parse(storedUsage));
      }
    } catch (error) {
      console.error("Failed to parse guest usage from localStorage", error);
      localStorage.removeItem(GUEST_USAGE_DB_KEY);
    }
  }, []);

  const incrementUsage = useCallback((tool: ToolName) => {
    setUsage(currentUsage => {
        const newCount = (currentUsage[tool] || 0) + 1;
        const newUsage = { ...currentUsage, [tool]: newCount };
        localStorage.setItem(GUEST_USAGE_DB_KEY, JSON.stringify(newUsage));
        return newUsage;
    });
  }, []);

  const isUsageBlocked = useCallback((tool: ToolName): boolean => {
    return (usage[tool] || 0) >= TOOL_USAGE_LIMIT;
  }, [usage]);

  const getRemainingUsage = useCallback((tool: ToolName): number => {
      return Math.max(0, TOOL_USAGE_LIMIT - (usage[tool] || 0));
  }, [usage]);
  

  const value = { isUsageBlocked, incrementUsage, getRemainingUsage };

  return (
    <GuestUsageContext.Provider value={value}>
      {children}
    </GuestUsageContext.Provider>
  );
};

export const useGuestUsage = () => {
  const context = useContext(GuestUsageContext);
  if (context === undefined) {
    throw new Error('useGuestUsage must be used within a GuestUsageProvider');
  }
  return context;
};