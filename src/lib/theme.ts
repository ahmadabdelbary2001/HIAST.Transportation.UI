// src/lib/theme.ts

// Syrian Visual Identity Theme Colors
export const SYRIAN_THEME = {
  primary: {
    DEFAULT: '#428177',
    dark: '#054239',
    darker: '#002623',
    light: '#5a9d92',
  },
  accent: {
    DEFAULT: '#b9a779',
    light: '#edebe0',
    dark: '#988561',
  },
  secondary: {
    DEFAULT: '#6b1f2a',
    dark: '#4a151e',
    darker: '#260f14',
  },
  neutral: {
    DEFAULT: '#3d3a3b',
    dark: '#161616',
    light: '#ffffff',
  },
};

export const THEME_OPTIONS = [
  {
    id: 'syrian',
    name: { en: 'Syrian Identity', ar: 'الهوية السورية' },
    colors: SYRIAN_THEME,
  },
  {
    id: 'default',
    name: { en: 'Default', ar: 'افتراضي' },
    colors: {
      primary: { DEFAULT: '#3b82f6', dark: '#1e40af', darker: '#1e3a8a', light: '#60a5fa' },
      accent: { DEFAULT: '#f59e0b', light: '#fef3c7', dark: '#d97706' },
      secondary: { DEFAULT: '#8b5cf6', dark: '#6d28d9', darker: '#5b21b6' },
      neutral: { DEFAULT: '#6b7280', dark: '#1f2937', light: '#ffffff' },
    },
  },
];