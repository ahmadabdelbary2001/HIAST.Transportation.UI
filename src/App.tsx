// src/App.tsx

import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { MainLayout } from '@/components/templates/MainLayout';
import Dashboard from '@/pages/Index';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { LanguageProvider } from '@/contexts/LanguageContext';
import { AuthProvider } from '@/contexts/AuthContext';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import { ROUTES } from '@/lib/constants';
import Login from '@/pages/auth/Login';
import Register from '@/pages/auth/Register';
import DriverList from '@/pages/drivers/DriverList';
import DriverForm from '@/pages/drivers/DriverForm';
import DriverDetail from '@/pages/drivers/DriverDetail';
import BusList from '@/pages/buses/BusList';
import BusForm from '@/pages/buses/BusForm';
import BusDetail from '@/pages/buses/BusDetail';
import EmployeeList from './pages/employees/EmployeeList';
import EmployeeDetail from './pages/employees/EmployeeDetail';
import LineList from './pages/lines/LineList';
import LineForm from './pages/lines/LineForm';
import LineDetail from './pages/lines/LineDetail';
import SupervisorReport from './pages/supervisors/SupervisorReport';
import StopList from './pages/stops/StopList';
import StopForm from './pages/stops/StopForm';
import SubscriptionList from './pages/subscriptions/SubscriptionList';
import SubscriptionForm from './pages/subscriptions/SubscriptionForm';
import SubscriptionDetail from './pages/subscriptions/SubscriptionDetail';
import '@/i18n';

import { NotificationProvider } from '@/contexts/NotificationContext';

import { GlobalToaster } from '@/components/atoms/GlobalToaster';

const App = () => (
  <ThemeProvider>
    <LanguageProvider>
      <AuthProvider>
        <NotificationProvider>
          <GlobalToaster />
          <BrowserRouter basename="/HIAST.Transportation.UI">
            <Routes>
              {/* Public Routes */}
              <Route path={ROUTES.LOGIN} element={<Login />} />
              <Route path={ROUTES.REGISTER} element={<Register />} />

              {/* Protected Routes */}
              <Route
                path={ROUTES.DASHBOARD}
                element={
                  <ProtectedRoute>
                    <MainLayout>
                      <Dashboard />
                    </MainLayout>
                  </ProtectedRoute>
                }
              />
              <Route
                path={ROUTES.EMPLOYEES}
                element={
                  <ProtectedRoute requiredRole="Administrator">
                    <MainLayout>
                      <EmployeeList />
                    </MainLayout>
                  </ProtectedRoute>
                }
              />
              <Route
                path={ROUTES.EMPLOYEE_DETAIL}
                element={
                  <ProtectedRoute requiredRole="Administrator">
                    <MainLayout>
                      <EmployeeDetail />
                    </MainLayout>
                  </ProtectedRoute>
                }
              />
              <Route
                path={ROUTES.EMPLOYEE_DETAIL_BY_USERID}
                element={
                  <ProtectedRoute>
                    <MainLayout>
                      <EmployeeDetail />
                    </MainLayout>
                  </ProtectedRoute>
                }
              />
              <Route
                path={ROUTES.DRIVERS}
                element={
                  <ProtectedRoute requiredRole="Administrator">
                    <MainLayout>
                      <DriverList />
                    </MainLayout>
                  </ProtectedRoute>
                }
              />
              <Route
                path={ROUTES.DRIVER_CREATE}
                element={
                  <ProtectedRoute requiredRole="Administrator">
                    <MainLayout>
                      <DriverForm />
                    </MainLayout>
                  </ProtectedRoute>
                }
              />
              <Route
                path={ROUTES.DRIVER_EDIT}
                element={
                  <ProtectedRoute requiredRole="Administrator">
                    <MainLayout>
                      <DriverForm />
                    </MainLayout>
                  </ProtectedRoute>
                }
              />
              <Route
                path={ROUTES.DRIVER_DETAIL}
                element={
                  <ProtectedRoute requiredRole="Administrator">
                    <MainLayout>
                      <DriverDetail />
                    </MainLayout>
                  </ProtectedRoute>
                }
              />
              <Route
                path={ROUTES.BUSES}
                element={
                  <ProtectedRoute requiredRole="Administrator">
                    <MainLayout>
                      <BusList />
                    </MainLayout>
                  </ProtectedRoute>
                }
              />
              <Route
                path={ROUTES.BUS_CREATE}
                element={
                  <ProtectedRoute requiredRole="Administrator">
                    <MainLayout>
                      <BusForm />
                    </MainLayout>
                  </ProtectedRoute>
                }
              />
              <Route
                path={ROUTES.BUS_EDIT}
                element={
                  <ProtectedRoute requiredRole="Administrator">
                    <MainLayout>
                      <BusForm />
                    </MainLayout>
                  </ProtectedRoute>
                }
              />
              <Route
                path={ROUTES.BUS_DETAIL}
                element={
                  <ProtectedRoute requiredRole="Administrator">
                    <MainLayout>
                      <BusDetail />
                    </MainLayout>
                  </ProtectedRoute>
                }
              />
              <Route
                path={ROUTES.LINES}
                element={
                  <ProtectedRoute>
                    <MainLayout>
                      <LineList />
                    </MainLayout>
                  </ProtectedRoute>
                }
              />
              <Route
                path={ROUTES.LINE_CREATE}
                element={
                  <ProtectedRoute requiredRole="Administrator">
                    <MainLayout>
                      <LineForm />
                    </MainLayout>
                  </ProtectedRoute>
                }
              />
              <Route
                path={ROUTES.LINE_EDIT}
                element={
                  <ProtectedRoute requiredRole="Administrator">
                    <MainLayout>
                      <LineForm />
                    </MainLayout>
                  </ProtectedRoute>
                }
              />
              <Route
                path={ROUTES.LINE_DETAIL}
                element={
                  <ProtectedRoute>
                    <MainLayout>
                      <LineDetail />
                    </MainLayout>
                  </ProtectedRoute>
                }
              />
              <Route
                path={ROUTES.STOPS}
                element={
                  <ProtectedRoute>
                    <MainLayout>
                      <StopList />
                    </MainLayout>
                  </ProtectedRoute>
                }
              />
              <Route
                path={ROUTES.STOP_CREATE}
                element={
                  <ProtectedRoute requiredRole="Administrator">
                    <MainLayout>
                      <StopForm />
                    </MainLayout>
                  </ProtectedRoute>
                }
              />
              <Route
                path={ROUTES.STOP_EDIT}
                element={
                  <ProtectedRoute requiredRole="Administrator">
                    <MainLayout>
                      <StopForm />
                    </MainLayout>
                  </ProtectedRoute>
                }
              />
              <Route
                path={ROUTES.SUPERVISORS}
                element={
                  <ProtectedRoute requiredRole="Administrator">
                    <MainLayout>
                      <SupervisorReport />
                    </MainLayout>
                  </ProtectedRoute>
                }
              />
              <Route
                path={ROUTES.SUBSCRIPTIONS}
                element={
                  <ProtectedRoute requiredRole="Administrator">
                    <MainLayout>
                      <SubscriptionList />
                    </MainLayout>
                  </ProtectedRoute>
                }
              />
              <Route
                path={ROUTES.SUBSCRIPTION_CREATE}
                element={
                  <ProtectedRoute>
                    <MainLayout>
                      <SubscriptionForm />
                    </MainLayout>
                  </ProtectedRoute>
                }
              />
              <Route
                path={ROUTES.SUBSCRIPTION_EDIT}
                element={
                  <ProtectedRoute requiredRole="Administrator">
                    <MainLayout>
                      <SubscriptionForm />
                    </MainLayout>
                  </ProtectedRoute>
                }
              />
              <Route
                path={ROUTES.SUBSCRIPTION_DETAIL}
                element={
                  <ProtectedRoute requiredRole="Administrator">
                    <MainLayout>
                      <SubscriptionDetail />
                    </MainLayout>
                  </ProtectedRoute>
                }
              />

              {/* Fallback */}
              <Route path="*" element={<Navigate to={ROUTES.DASHBOARD} replace />} />
            </Routes>
          </BrowserRouter>
        </NotificationProvider>
      </AuthProvider>
    </LanguageProvider>
  </ThemeProvider>
);

export default App;