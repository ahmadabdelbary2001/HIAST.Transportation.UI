// src/lib/theme.ts

export interface ThemeColors {
  primary: {
    DEFAULT: string;
    dark: string;
    darker: string;
    light: string;
  };
  accent: {
    DEFAULT: string;
    light: string;
    dark: string;
  };
  secondary: {
    DEFAULT: string;
    dark: string;
    darker: string;
  };
  neutral: {
    DEFAULT: string;
    dark: string;
    light: string;
  };
  backgrounds: {
    light: {
      primary: string;    // Main background
      secondary: string;  // Card background
      tertiary: string;   // Alternative background
    };
    dark: {
      primary: string;    // Main background
      secondary: string;  // Card background  
      tertiary: string;   // Alternative background
    };
  };
}

export interface ThemeConfig {
  id: string;
  name: { en: string; ar: string };
  colors: ThemeColors;
  shadcn: {
    primary: string;
    primaryForeground: string;
    accent: string;
    accentForeground: string;
    secondary: string;
    secondaryForeground: string;
  };
}

export const THEME_OPTIONS: ThemeConfig[] = [
  {
    id: 'syrian',
    name: { en: 'Syrian Identity', ar: 'الهوية السورية' },
    colors: {
      primary: { DEFAULT: '#428177', dark: '#054239', darker: '#002623', light: '#5a9d92' },
      accent: { DEFAULT: '#b9a779', light: '#edebe0', dark: '#988561' },
      secondary: { DEFAULT: '#6b1f2a', dark: '#4a151e', darker: '#260f14' },
      neutral: { DEFAULT: '#3d3a3b', dark: '#161616', light: '#ffffff' },
      backgrounds: {
        light: {
          primary: '#f8f9fa',      // Very light warm gray
          secondary: '#ffffff',     // Pure white for cards
          tertiary: '#f1f3f4'      // Slightly darker for contrast
        },
        dark: {
          primary: '#0f1419',      // Dark blue-gray instead of pure black
          secondary: '#1a1f2b',    // Slightly lighter for cards
          tertiary: '#252a35'      // Even lighter for contrast
        }
      }
    },
    shadcn: {
      primary: '166 50% 48%',
      primaryForeground: '0 0% 100%',
      accent: '42 35% 60%',
      accentForeground: '0 0% 0%',
      secondary: '349 69% 27%',
      secondaryForeground: '0 0% 100%',
    },
  },
  {
    id: 'default',
    name: { en: 'Default', ar: 'افتراضي' },
    colors: {
      primary: { DEFAULT: '#3b82f6', dark: '#1d4ed8', darker: '#1e3a8a', light: '#dbeafe' },
      accent: { DEFAULT: '#f59e0b', light: '#fef3c7', dark: '#d97706' },
      secondary: { DEFAULT: '#8b5cf6', dark: '#7c3aed', darker: '#5b21b6' },
      neutral: { DEFAULT: '#6b7280', dark: '#374151', light: '#f9fafb' },
      backgrounds: {
        light: {
          primary: '#f8fafc',      // Light blue-gray
          secondary: '#ffffff',     // White for cards
          tertiary: '#f1f5f9'      // Slightly darker blue-gray
        },
        dark: {
          primary: '#0f172a',      // Dark blue-gray
          secondary: '#1e293b',    // Slate for cards
          tertiary: '#334155'      // Lighter slate for contrast
        }
      }
    },
    shadcn: {
      primary: '221 83% 53%',
      primaryForeground: '0 0% 100%',
      accent: '38 92% 50%',
      accentForeground: '0 0% 0%',
      secondary: '262 83% 58%',
      secondaryForeground: '0 0% 100%',
    },
  },
  {
    id: 'pastel',
    name: { en: 'Soft Pastel', ar: 'باستيل ناعم' },
    colors: {
      primary: { DEFAULT: '#a3b9e5', dark: '#7a9ad6', darker: '#5a7bc2', light: '#c7d4f0' },
      accent: { DEFAULT: '#f8b4d9', light: '#fcddec', dark: '#f48ec6' },
      secondary: { DEFAULT: '#b5e8c3', dark: '#8dd9a3', darker: '#6ac989' },
      neutral: { DEFAULT: '#9ca3af', dark: '#6b7280', light: '#f9fafb' },
      backgrounds: {
        light: {
          primary: '#faf7ff',      // Very light lavender
          secondary: '#ffffff',     // White for cards
          tertiary: '#f0ebfa'      // Light lavender for contrast
        },
        dark: {
          primary: '#1a1625',      // Dark purple-gray
          secondary: '#2a2438',    // Slightly lighter for cards
          tertiary: '#3a324b'      // Even lighter for contrast
        }
      }
    },
    shadcn: {
      primary: '220 50% 75%',
      primaryForeground: '0 0% 0%',
      accent: '327 80% 80%',
      accentForeground: '0 0% 0%',
      secondary: '135 50% 75%',
      secondaryForeground: '0 0% 0%',
    },
  },
] as const;

export type ThemeId = typeof THEME_OPTIONS[number]['id'];

// Helper function to get theme by ID
export function getThemeById(id: ThemeId): ThemeConfig {
  return THEME_OPTIONS.find(theme => theme.id === id) || THEME_OPTIONS[0];
}

// Helper function to iterate over theme colors safely
export function iterateThemeColors(colors: Omit<ThemeColors, 'backgrounds'>, callback: (category: string, shade: string, value: string) => void) {
  Object.entries(colors).forEach(([colorCategory, shades]) => {
    Object.entries(shades as Record<string, string>).forEach(([shade, value]) => {
      callback(colorCategory, shade, value);
    });
  });
}