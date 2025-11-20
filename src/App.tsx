// src/App.tsx

import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { MainLayout } from '@/components/templates/MainLayout';
import Dashboard from '@/pages/Index';
import { ThemeProvider } from '@/contexts/ThemeContext';
import {LanguageProvider} from '@/contexts/LanguageContext'
import '@/i18n';

const App = () => (
  <ThemeProvider>
    <LanguageProvider>
      <BrowserRouter>
        <Routes>
          <Route
            path="/HIAST.Transportation.UI"
            element={
              <MainLayout>
                <Dashboard />
              </MainLayout>
            }
          />
        </Routes>
      </BrowserRouter>
    </LanguageProvider>
  </ThemeProvider>
);

export default App;