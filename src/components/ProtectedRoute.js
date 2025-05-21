// src/components/ProtectedRoute.js
import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { getCurrentUser, getUserRole } from '../utils/auth';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const [authorized, setAuthorized] = useState(null);

  useEffect(() => {
    const checkAuth = async () => {
      const user = await getCurrentUser();
      if (!user) {
        setAuthorized(false);
        return;
      }

      let role = localStorage.getItem('userRole');

      if (!role) {
        role = await getUserRole();
        if (role) {
          localStorage.setItem('userRole', role);
        } else {
          setAuthorized(false);
          return;
        }
      }

      role = role.toLowerCase().trim(); // Normalize
      console.log('User Role:', role);

      if (allowedRoles.map(r => r.toLowerCase().trim()).includes(role)) {
        setAuthorized(true);
      } else {
        setAuthorized(false);
      }
    };

    checkAuth();
  }, [allowedRoles]);

  if (authorized === null) return <div>Loading...</div>;

  return authorized ? children : <Navigate to="/unauthorized" />;
};

export default ProtectedRoute;
