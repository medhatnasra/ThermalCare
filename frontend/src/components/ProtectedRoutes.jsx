import React from "react";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

const ProtectedRoutes = ({ children, role, roles }) => {
  const { user } = useSelector((state) => state.auth);

  const allowedRoles = Array.isArray(roles) ? roles : role ? [role] : [];

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoutes;
