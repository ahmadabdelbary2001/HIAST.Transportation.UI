// src/App.tsx

import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { MainLayout } from '@/components/templates/MainLayout';
import Dashboard from '@/pages/Index';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { LanguageProvider } from '@/contexts/LanguageContext';
import { ROUTES } from '@/lib/constants';
import DriverList from '@/pages/drivers/DriverList';
import '@/i18n';
import EmployeeList from './pages/employees/EmployeeList';

const App = () => (
  <ThemeProvider>
    <LanguageProvider>
      <BrowserRouter basename="/HIAST.Transportation.UI">
        <Routes>
          <Route
            path={ROUTES.DASHBOARD}
            element={
              <MainLayout>
                <Dashboard />
              </MainLayout>
            }
          />
          <Route
            path={ROUTES.EMPLOYEES}
            element={
              <MainLayout>
                <EmployeeList />
              </MainLayout>
            }
          />
          <Route
            path={ROUTES.DRIVERS}
            element={
              <MainLayout>
                <DriverList />
              </MainLayout>
            }
          />
        </Routes>
      </BrowserRouter>
    </LanguageProvider>
  </ThemeProvider>
);

export default App;