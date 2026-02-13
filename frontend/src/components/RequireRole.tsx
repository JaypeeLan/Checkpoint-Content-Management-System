import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { getStoredRole, isAuthenticated, routeForRole, type UserRole } from '../api/auth';

type Props = {
  allowedRoles: UserRole[];
};

export default function RequireRole({ allowedRoles }: Props) {
  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }

  const role = getStoredRole();
  if (!role) {
    return <Navigate to="/login" replace />;
  }

  if (!allowedRoles.includes(role)) {
    return <Navigate to={routeForRole(role)} replace />;
  }

  return <Outlet />;
}
