// src/contexts/ThemeContext.tsx

import React, { createContext, useEffect, useState } from 'react';
import { LOCAL_STORAGE_KEYS } from '@/lib/constants';
import { type ThemeId, getThemeById } from '@/lib/theme';

type ThemeMode = 'light' | 'dark';

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
    const selectedTheme = getThemeById(theme);
    
    // Apply dark mode class
    if (mode === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }

    // Set theme-specific CSS custom properties
    if (selectedTheme) {
      const { colors, shadcn } = selectedTheme;
      const { backgrounds } = colors;
      
      // Set theme color variables
      Object.entries(colors).forEach(([colorCategory, shades]) => {
        if (colorCategory === 'backgrounds') return; // Skip backgrounds for now
        
        Object.entries(shades as Record<string, string>).forEach(([shade, value]) => {
          const variableName = `--theme-${colorCategory}${shade !== 'DEFAULT' ? `-${shade}` : ''}`;
          root.style.setProperty(variableName, value);
        });
      });

      // Set background colors based on mode
      const modeBackgrounds = mode === 'light' ? backgrounds.light : backgrounds.dark;
      Object.entries(modeBackgrounds).forEach(([backgroundType, value]) => {
        root.style.setProperty(`--theme-background-${backgroundType}`, value);
      });

      // Set Shadcn color variables
      Object.entries(shadcn).forEach(([variable, value]) => {
        root.style.setProperty(`--${variable}`, value);
      });
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