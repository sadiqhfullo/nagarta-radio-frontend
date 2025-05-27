// src/components/ProtectedRoute.js
import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '../firebase';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const [authorized, setAuthorized] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        setAuthorized(false);
        return;
      }

      try {
        const snap = await getDoc(doc(db, 'profiles', user.uid));
        const role = snap.exists() ? snap.data().role.toLowerCase() : null;
        setAuthorized(allowedRoles.includes(role));
      } catch (error) {
        console.error('Error checking access:', error);
        setAuthorized(false);
      }
    });

    return () => unsubscribe();
  }, [allowedRoles]);

  if (authorized === null) return <div>Loading...</div>;

  return authorized ? children : <Navigate to="/unauthorized" />;
};

export default ProtectedRoute;
