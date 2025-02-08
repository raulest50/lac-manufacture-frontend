// src/components/MultiRoleProtectedRoute.tsx
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

type MultiRoleProtectedRouteProps = {
    children: JSX.Element;
    supportedRoles: string[]; // Array of allowed roles (e.g., ["MASTER", "COMPRAS"])
};

const MultiRoleProtectedRoute: React.FC<MultiRoleProtectedRouteProps> = ({ children, supportedRoles }) => {
    const { user, roles } = useAuth();

    // If not logged in, redirect to /login.
    if (!user) {
        return <Navigate to="/login" replace />;
    }

    // Check if the user has at least one allowed role.
    const hasRole = roles.some(role => supportedRoles.includes(role));
    if (!hasRole) {
        return <div>403 Forbidden: You do not have access.</div>;
    }

    return children;
};

export default MultiRoleProtectedRoute;
