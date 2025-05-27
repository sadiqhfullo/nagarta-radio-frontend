// src/components/ProtectedRoute.js
import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { getCurrentUser, getUserRole } from '../utils/auth';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const [authorized, setAuthorized] = useState(null); // null = loading, false = unauthorized, true = allowed

  useEffect(() => {
    const checkAuthorization = async () => {
      try {
        const user = await getCurrentUser();

        if (!user) {
          console.warn('No user found');
          setAuthorized(false); // Not logged in
          return;
        }

        let role = localStorage.getItem('userRole');

        if (!role) {
          role = await getUserRole();
          if (!role) {
            console.warn('User role not found or failed to fetch');
            setAuthorized(false);
            return;
          }
          localStorage.setItem('userRole', role);
        }

        // Normalize both user role and allowedRoles
        const normalizedRole = role.toLowerCase().trim();
        const normalizedAllowedRoles = allowedRoles.map(r => r.toLowerCase().trim());

        console.log('User Role:', normalizedRole);

        setAuthorized(normalizedAllowedRoles.includes(normalizedRole));
      } catch (err) {
        console.error('Authorization check failed:', err.message);
        setAuthorized(false);
      }
    };

    checkAuthorization();
  }, [allowedRoles]);

  if (authorized === null) return <div>Loading...</div>;

  return authorized ? children : <Navigate to="/unauthorized" />;
};

export default ProtectedRoute;
