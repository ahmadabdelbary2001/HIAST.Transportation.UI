// src/App.tsx

import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { MainLayout } from '@/components/templates/MainLayout';
import Dashboard from '@/pages/Index';
import { ThemeProvider } from '@/contexts/ThemeContext';

const App = () => (
  <ThemeProvider>
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
  </ThemeProvider>
);

export default App;