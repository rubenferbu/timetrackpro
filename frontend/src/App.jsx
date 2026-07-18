import { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import ProtectedRoute from './routes/ProtectedRoute';
import Layout from './components/layout/Layout';

const Login = lazy(() => import('./pages/auth/Login'));
const Register = lazy(() => import('./pages/auth/Register'));
const Dashboard = lazy(() => import('./pages/dashboard/Dashboard'));
const MyTimeEntries = lazy(() => import('./pages/time-entries/MyTimeEntries'));
const MyLeaveRequests = lazy(() => import('./pages/leave-requests/MyLeaveRequests'));
const TeamTimeEntries = lazy(() => import('./pages/team/TeamTimeEntries'));
const TeamLeaveRequests = lazy(() => import('./pages/team/TeamLeaveRequests'));
const Employees = lazy(() => import('./pages/employees/Employees'));
const NotAuthorized = lazy(() => import('./pages/NotAuthorized'));

function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={<div style={{ padding: 'var(--spacing-xl)' }}>Cargando...</div>}>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/no-autorizado" element={<NotAuthorized />} />

          <Route
            element={
              <ProtectedRoute>
                <Layout />
              </ProtectedRoute>
            }
          >
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/time-entries" element={<MyTimeEntries />} />
            <Route path="/leave-requests" element={<MyLeaveRequests />} />

            {/* Grupo manager/companyAdmin: solo verifica rol, NO vuelve a
                envolver con Layout (ya estamos dentro de uno). Por eso pasa
                <Outlet/> como children en vez de <Layout/>. */}
            <Route
              element={
                <ProtectedRoute allowedRoles={['manager', 'companyAdmin']}>
                  <Outlet />
                </ProtectedRoute>
              }
            >
              <Route path="/team" element={<TeamTimeEntries />} />
              <Route path="/team/leave-requests" element={<TeamLeaveRequests />} />
            </Route>

            <Route
              element={
                <ProtectedRoute allowedRoles={['companyAdmin']}>
                  <Outlet />
                </ProtectedRoute>
              }
            >
              <Route path="/employees" element={<Employees />} />
            </Route>
          </Route>

          <Route path="/" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}

export default App;