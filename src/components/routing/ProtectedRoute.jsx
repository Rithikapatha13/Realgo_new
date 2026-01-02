import { Navigate } from "react-router-dom";

export default function ProtectedRoute({
  component: Component,
  allowedRoles = [],
  userRole,
}) {
  if (!userRole) {
    return <Navigate to="/auth/login" replace />;
  }

  if (allowedRoles.length && !allowedRoles.includes(userRole)) {
    return <Navigate to="/auth/login" replace />;
  }

  return <Component />;
}
