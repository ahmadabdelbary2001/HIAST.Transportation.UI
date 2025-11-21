import { LOCAL_STORAGE_KEYS } from '@/lib/constants';

export class LocalStorageService {
  static get<T>(key: string): T | null {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : null;
    } catch (error) {
      console.error(`Error reading from localStorage key "${key}":`, error);
      return null;
    }
  }

  static set<T>(key: string, value: T): void {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error(`Error writing to localStorage key "${key}":`, error);
    }
  }

  static remove(key: string): void {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error(`Error removing localStorage key "${key}":`, error);
    }
  }

  static clear(): void {
    try {
      // Only clear HIAST-related keys
      Object.values(LOCAL_STORAGE_KEYS).forEach((key) => {
        if (key.startsWith('hiast_') && !['hiast_theme', 'hiast_language', 'hiast_dark_mode'].includes(key)) {
          localStorage.removeItem(key);
        }
      });
    } catch (error) {
      console.error('Error clearing localStorage:', error);
    }
  }

  static exists(key: string): boolean {
    return localStorage.getItem(key) !== null;
  }
}