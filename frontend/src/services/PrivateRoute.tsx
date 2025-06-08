import { Navigate } from "react-router-dom";
import { getCurrentUser } from "./auth";

interface PrivateRouteProps {
  children: React.ReactNode;
  allowedRoles: string[];
}

export default function PrivateRoute({ children, allowedRoles }: PrivateRouteProps) {
  const user = getCurrentUser();
  
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (!allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />; 
  }

  return <>{children}</>;
}