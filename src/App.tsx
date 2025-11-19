import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { MainLayout } from '@/components/templates/MainLayout';
import Dashboard from '@/pages/Index';

const App = () => (
  <BrowserRouter>
    <Routes>
      <Route
        path="/"
        element={
          <MainLayout>
            <Dashboard />
          </MainLayout>
        }
      />
    </Routes>
  </BrowserRouter>
);

export default App;