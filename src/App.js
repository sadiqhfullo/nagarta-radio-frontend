// App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Registration from './pages/Registration';
import Login from './pages/Login';
import Home from './pages/HomePage';
import AdminDashboard from './pages/AdminDashboard';
import StaffDashboard from './pages/StaffDashboard';
import Unauthorized from './pages/Unauthorized';
import ManageUsers from './pages/ManageUsers';
import ManageStaff from './pages/ManageStaff';
import ManagePrograms from './pages/ManagePrograms';
import ProtectedRoute from './components/ProtectedRoute';
import UploadProgram from './pages/uploads/UploadProgram';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/register" element={<Registration />} />
        <Route path="/login" element={<Login />} />
<Route path="/uploads" element={<UploadProgram />} />

        <Route
          path="/home"
          element={
            <ProtectedRoute allowedRoles={['user', 'admin', 'staff']}>
              <Home />
            </ProtectedRoute>
          }
        />

        {/* Admin-only routes */}
        <Route
          path="/admin-dashboard"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/users"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <ManageUsers />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/staff"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <ManageStaff />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/programs"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <ManagePrograms />
            </ProtectedRoute>
          }
        />

        <Route
          path="/staff-dashboard"
          element={
            <ProtectedRoute allowedRoles={['staff']}>
              <StaffDashboard />
            </ProtectedRoute>
          }
        />

        <Route path="/unauthorized" element={<Unauthorized />} />
      </Routes>
    </Router>
  );
}

export default App;
