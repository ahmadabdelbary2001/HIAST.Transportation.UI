// src/contexts/ThemeContext.tsx

import React, { createContext, useEffect, useState } from 'react';
import { LOCAL_STORAGE_KEYS } from '@/lib/constants';
import { THEME_OPTIONS } from '@/lib/theme';

type ThemeMode = 'light' | 'dark';
type ThemeId = 'syrian' | 'default';

interface ThemeContextType {
  theme: ThemeId;
  mode: ThemeMode;
  setTheme: (theme: ThemeId) => void;
  setMode: (mode: ThemeMode) => void;
  toggleMode: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export { ThemeContext };

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<ThemeId>(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEYS.THEME);
    return (saved as ThemeId) || 'syrian';
  });

  const [mode, setModeState] = useState<ThemeMode>(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEYS.DARK_MODE);
    return (saved as ThemeMode) || 'light';
  });

  useEffect(() => {
    const root = document.documentElement;
    
    // Apply dark mode class
    if (mode === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }

    // Apply theme-specific CSS variables
    const selectedTheme = THEME_OPTIONS.find((t) => t.id === theme);
    if (selectedTheme) {
      const colors = selectedTheme.colors;
      
      // Set CSS custom properties for the theme
      root.style.setProperty('--theme-primary', colors.primary.DEFAULT);
      root.style.setProperty('--theme-primary-dark', colors.primary.dark);
      root.style.setProperty('--theme-primary-light', colors.primary.light);
      root.style.setProperty('--theme-accent', colors.accent.DEFAULT);
      root.style.setProperty('--theme-accent-light', colors.accent.light);
      root.style.setProperty('--theme-accent-dark', colors.accent.dark);
      root.style.setProperty('--theme-secondary', colors.secondary.DEFAULT);
      root.style.setProperty('--theme-secondary-dark', colors.secondary.dark);
      
      // Update Shadcn color variables based on theme
      if (theme === 'syrian') {
        // Syrian theme colors
        root.style.setProperty('--primary', '166 50% 48%'); // #428177
        root.style.setProperty('--primary-foreground', '0 0% 100%');
        root.style.setProperty('--accent', '42 35% 60%'); // #b9a779
        root.style.setProperty('--accent-foreground', '0 0% 0%');
        root.style.setProperty('--secondary', '349 69% 27%'); // #6b1f2a
        root.style.setProperty('--secondary-foreground', '0 0% 100%');
      } else {
        // Default theme colors
        root.style.setProperty('--primary', '221 83% 53%');
        root.style.setProperty('--primary-foreground', '0 0% 100%');
        root.style.setProperty('--accent', '38 92% 50%');
        root.style.setProperty('--accent-foreground', '0 0% 0%');
        root.style.setProperty('--secondary', '262 83% 58%');
        root.style.setProperty('--secondary-foreground', '0 0% 100%');
      }
    }
  }, [theme, mode]);

  const setTheme = (newTheme: ThemeId) => {
    setThemeState(newTheme);
    localStorage.setItem(LOCAL_STORAGE_KEYS.THEME, newTheme);
  };

  const setMode = (newMode: ThemeMode) => {
    setModeState(newMode);
    localStorage.setItem(LOCAL_STORAGE_KEYS.DARK_MODE, newMode);
  };

  const toggleMode = () => {
    setMode(mode === 'light' ? 'dark' : 'light');
  };

  return (
    <ThemeContext.Provider value={{ theme, mode, setTheme, setMode, toggleMode }}>
      {children}
    </ThemeContext.Provider>
  );
}