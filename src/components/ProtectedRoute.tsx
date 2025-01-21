// src/components/ProtectedRoute.tsx
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

type ProtectedRouteProps = {
    children: JSX.Element;  // The actual page we want to render
    requiredRole?: string;  // e.g. "ROLE_WORKER" or "ROLE_MASTER"
};

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, requiredRole }) => {
    const { user, roles } = useAuth();

    // 1) If no user => not logged in => go to /login
    if (!user) {
        return <Navigate to="/login" replace />;
    }

    // 2) If a required role is specified, check if user has it
    if (requiredRole && !roles.includes(requiredRole)) {
        return <div>403 Forbidden: Missing {requiredRole}</div>;
    }

    // 3) Otherwise, authorized => render child
    return children;
};
