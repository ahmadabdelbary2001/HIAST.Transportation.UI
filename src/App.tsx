// src/App.tsx

import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { MainLayout } from '@/components/templates/MainLayout';
import Dashboard from '@/pages/Index';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { LanguageProvider } from '@/contexts/LanguageContext';
import { ROUTES } from '@/lib/constants';
import DriverList from '@/pages/drivers/DriverList';
import DriverForm from '@/pages/drivers/DriverForm';
import DriverDetail from '@/pages/drivers/DriverDetail';
import BusList from '@/pages/buses/BusList';
import BusForm from '@/pages/buses/BusForm';
import BusDetail from '@/pages/buses/BusDetail';
import EmployeeList from './pages/employees/EmployeeList';
import EmployeeForm from './pages/employees/EmployeeForm';
import '@/i18n';
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
            path={ROUTES.EMPLOYEE_CREATE}
            element={
              <MainLayout>
                <EmployeeForm />
              </MainLayout>
            }
          />
          <Route
            path={ROUTES.EMPLOYEE_EDIT}
            element={
              <MainLayout>
                <EmployeeForm />
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
          <Route
            path={ROUTES.DRIVER_CREATE}
            element={
              <MainLayout>
                <DriverForm />
              </MainLayout>
            }
          />
          <Route
            path={ROUTES.DRIVER_EDIT}
            element={
              <MainLayout>
                <DriverForm />
              </MainLayout>
            }
          />
          <Route
            path={ROUTES.DRIVER_DETAIL}
            element={
              <MainLayout>
                <DriverDetail />
              </MainLayout>
            }
          />
          <Route
            path={ROUTES.BUSES}
            element={
              <MainLayout>
                <BusList />
              </MainLayout>
            }
          />
          <Route
            path={ROUTES.BUS_CREATE}
            element={
              <MainLayout>
                <BusForm />
              </MainLayout>
            }
          />
          <Route
            path={ROUTES.BUS_EDIT}
            element={
              <MainLayout>
                <BusForm />
              </MainLayout>
            }
          />
          <Route
            path={ROUTES.BUS_DETAIL}
            element={
              <MainLayout>
                <BusDetail />
              </MainLayout>
            }
          />
        </Routes>
      </BrowserRouter>
    </LanguageProvider>
  </ThemeProvider>
);

export default App;