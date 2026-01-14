import { Routes, Route, Navigate } from 'react-router-dom';
import AuthPage from './pages/AuthPage';
import Dashboard from './pages/Dashboard';
import ProtectedRoute from './components/ProtectedRoute';
import RoleRoute from './components/RoleRoute';
import AdminPage from './pages/AdminPage';
import StaffPage from './pages/StaffPage';
import Rooms from './pages/Rooms';
import CreateReservation from './pages/CreateReservation';
import Layout from './components/Layout';
import CalendarPage from './pages/Calendar';
import ReservationsPage from './pages/Reservations';

export default function App() {
  return (
    <Routes>
      <Route path="/auth" element={<AuthPage />} />
      <Route path="/" element={<Navigate to="/dashboard" replace />} />

      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Layout>
              <Dashboard />
            </Layout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/calendar"
        element={
          <ProtectedRoute>
            <Layout>
              <CalendarPage />
            </Layout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/rooms"
        element={
          <ProtectedRoute>
            <Layout>
              <Rooms />
            </Layout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/reservations"
        element={
          <ProtectedRoute>
            <Layout>
              <ReservationsPage />
            </Layout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/create-reservation"
        element={
          <ProtectedRoute>
            <Layout>
              <CreateReservation />
            </Layout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin"
        element={
          <ProtectedRoute>
            <RoleRoute allowedRoles={['admin']}>
              <Layout>
                <AdminPage />
              </Layout>
            </RoleRoute>
          </ProtectedRoute>
        }
      />

      <Route
        path="/staff"
        element={
          <ProtectedRoute>
            <RoleRoute allowedRoles={['admin', 'staff']}>
              <Layout>
                <StaffPage />
              </Layout>
            </RoleRoute>
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}
