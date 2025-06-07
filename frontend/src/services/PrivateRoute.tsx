import React from "react";
import { Navigate } from "react-router-dom";

export default function PrivateRoute({ children, allowedRoles }: { children: React.ReactNode, allowedRoles: string[] }) {
  const role = localStorage.getItem('role');
  if (!role || !allowedRoles.includes(role)) {
    return <Navigate to="/login" />;
  }
  return <>{children}</>;
}