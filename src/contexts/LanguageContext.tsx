// src/contexts/LanguageContext.tsx

import React, { createContext, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { LOCAL_STORAGE_KEYS } from '@/lib/constants';

interface LanguageContextType {
  language: string;
  setLanguage: (lang: string) => void;
  isRTL: boolean;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export { LanguageContext };

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const { i18n } = useTranslation();
  const language = i18n.language;
  const isRTL = language === 'ar';

  useEffect(() => {
    // Set document direction and lang attribute
    document.documentElement.dir = isRTL ? 'rtl' : 'ltr';
    document.documentElement.lang = language;
    
    // Apply RTL-specific font family
    if (isRTL) {
      document.body.classList.add('font-arabic');
    } else {
      document.body.classList.remove('font-arabic');
    }
  }, [language, isRTL]);

  const setLanguage = (lang: string) => {
    i18n.changeLanguage(lang);
    localStorage.setItem(LOCAL_STORAGE_KEYS.LANGUAGE, lang);
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, isRTL }}>
      {children}
    </LanguageContext.Provider>
  );
}