// tailwind.config.ts

import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: ['class'],
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        // Syrian Visual Identity Theme
        syrian: {
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
        },
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
        chart: {
          '1': 'hsl(var(--chart-1))',
          '2': 'hsl(var(--chart-2))',
          '3': 'hsl(var(--chart-3))',
          '4': 'hsl(var(--chart-4))',
          '5': 'hsl(var(--chart-5))',
        },
        sidebar: {
          DEFAULT: 'hsl(var(--sidebar-background))',
          foreground: 'hsl(var(--sidebar-foreground))',
          primary: 'hsl(var(--sidebar-primary))',
          'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
          accent: 'hsl(var(--sidebar-accent))',
          'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
          border: 'hsl(var(--sidebar-border))',
          ring: 'hsl(var(--sidebar-ring))',
        },
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        arabic: ['Cairo', 'Tajawal', 'sans-serif'],
      },
    },
  },
  plugins: [
    // RTL Support Plugin - Adds logical property utilities
    function ({ addUtilities }: { addUtilities: (utilities: Record<string, Record<string, string>>) => void }) {
      const newUtilities: Record<string, Record<string, string>> = {};
      
      // Margin logical properties
      for (let i = 0; i <= 96; i += 0.5) {
        const key = i.toString().replace('.', '_');
        newUtilities[`.ms-${key}`] = { 'margin-inline-start': `${i * 0.25}rem` };
        newUtilities[`.me-${key}`] = { 'margin-inline-end': `${i * 0.25}rem` };
      }
      
      // Padding logical properties
      for (let i = 0; i <= 96; i += 0.5) {
        const key = i.toString().replace('.', '_');
        newUtilities[`.ps-${key}`] = { 'padding-inline-start': `${i * 0.25}rem` };
        newUtilities[`.pe-${key}`] = { 'padding-inline-end': `${i * 0.25}rem` };
      }
      
      // Position logical properties
      newUtilities['.start-0'] = { 'inset-inline-start': '0' };
      newUtilities['.end-0'] = { 'inset-inline-end': '0' };
      newUtilities['.start-auto'] = { 'inset-inline-start': 'auto' };
      newUtilities['.end-auto'] = { 'inset-inline-end': 'auto' };
      
      // Text alignment
      newUtilities['.text-start'] = { 'text-align': 'start' };
      newUtilities['.text-end'] = { 'text-align': 'end' };
      
      addUtilities(newUtilities);
    },
  ],
};

export default config;