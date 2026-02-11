import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';

// Pages
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import AddMembership from './pages/AddMembership';
import UpdateMembership from './pages/UpdateMembership';
import Flowchart from './pages/Flowchart';
import AddEvent from './pages/AddEvent';
import UpdateEvent from './pages/UpdateEvent';
import RegisterEvent from './pages/RegisterEvent';
import CancelRegistration from './pages/CancelRegistration';
import EventsReport from './pages/Reports/EventsReport';
import MembershipsReport from './pages/Reports/MembershipsReport';
import RegistrationsReport from './pages/Reports/RegistrationsReport';

// Protected Route Component
const ProtectedRoute = ({ children, adminOnly = false }) => {
  const { user, loading, isAdmin } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/login" />;
  }

  if (adminOnly && !isAdmin()) {
    return <Navigate to="/dashboard" />;
  }

  return children;
};

function AppContent() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/flowchart" element={<Flowchart />} />
        
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        
        <Route
          path="/maintenance/add-membership"
          element={
            <ProtectedRoute adminOnly={true}>
              <AddMembership />
            </ProtectedRoute>
          }
        />

        <Route
          path="/maintenance/add-event"
          element={
            <ProtectedRoute adminOnly={true}>
              <AddEvent />
            </ProtectedRoute>
          }
        />
        
        <Route
          path="/maintenance/update-membership"
          element={
            <ProtectedRoute adminOnly={true}>
              <UpdateMembership />
            </ProtectedRoute>
          }
        />

        <Route
          path="/maintenance/update-event"
          element={
            <ProtectedRoute adminOnly={true}>
              <UpdateEvent />
            </ProtectedRoute>
          }
        />

        <Route
          path="/transactions/register-event"
          element={
            <ProtectedRoute>
              <RegisterEvent />
            </ProtectedRoute>
          }
        />

        <Route
          path="/transactions/cancel-registration"
          element={
            <ProtectedRoute>
              <CancelRegistration />
            </ProtectedRoute>
          }
        />

        <Route
          path="/reports/events"
          element={
            <ProtectedRoute>
              <EventsReport />
            </ProtectedRoute>
          }
        />

        <Route
          path="/reports/memberships"
          element={
            <ProtectedRoute>
              <MembershipsReport />
            </ProtectedRoute>
          }
        />

        <Route
          path="/reports/registrations"
          element={
            <ProtectedRoute>
              <RegistrationsReport />
            </ProtectedRoute>
          }
        />
        
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </Router>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
