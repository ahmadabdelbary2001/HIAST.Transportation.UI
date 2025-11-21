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
      
      // Set theme color variables
      Object.entries(colors).forEach(([colorCategory, shades]) => {
        if (colorCategory === 'backgrounds') return;
        
        Object.entries(shades as Record<string, string>).forEach(([shade, value]) => {
          const variableName = `--theme-${colorCategory}${shade !== 'DEFAULT' ? `-${shade}` : ''}`;
          root.style.setProperty(variableName, value);
        });
      });

      // Set background colors based on mode
      const modeBackgrounds = mode === 'light' ? colors.backgrounds.light : colors.backgrounds.dark;
      Object.entries(modeBackgrounds).forEach(([backgroundType, value]) => {
        root.style.setProperty(`--theme-background-${backgroundType}`, value);
      });

      // Set sidebar and header specific colors
      root.style.setProperty('--theme-sidebar-bg', modeBackgrounds.sidebar);
      root.style.setProperty('--theme-header-bg', modeBackgrounds.header);

      // Set sidebar and header colors based on mode
      const isDark = mode === 'dark';
      
      // Sidebar border
      root.style.setProperty('--theme-sidebar-border', isDark ? colors.primary.darker : colors.primary.DEFAULT);
      
      // Sidebar text
      root.style.setProperty('--theme-sidebar-text', isDark ? colors.neutral.light : colors.neutral.DEFAULT);
      
      // Sidebar hover - second theme color (accent)
      root.style.setProperty('--theme-sidebar-hover', isDark ? colors.accent.dark : colors.accent.light);
      root.style.setProperty('--theme-sidebar-hover-text', isDark ? colors.neutral.light : colors.neutral.dark);
      
      // Sidebar active - third theme color (secondary)
      root.style.setProperty('--theme-sidebar-active', isDark ? colors.secondary.dark : colors.secondary.DEFAULT);
      root.style.setProperty('--theme-sidebar-active-text', colors.neutral.light);
      
      // Sidebar icons
      root.style.setProperty('--theme-sidebar-icon-bg', isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)');
      root.style.setProperty('--theme-sidebar-icon', isDark ? colors.neutral.light : colors.neutral.DEFAULT);
      root.style.setProperty('--theme-sidebar-icon-hover-bg', isDark ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.1)');
      root.style.setProperty('--theme-sidebar-icon-hover', isDark ? colors.neutral.light : colors.neutral.dark);

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