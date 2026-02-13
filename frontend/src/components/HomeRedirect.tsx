import React from 'react';
import { Navigate } from 'react-router-dom';
import { getStoredRole, isAuthenticated, routeForRole } from '../api/auth';

export default function HomeRedirect() {
  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }

  const role = getStoredRole();
  if (!role) {
    return <Navigate to="/login" replace />;
  }

  return <Navigate to={routeForRole(role)} replace />;
}
