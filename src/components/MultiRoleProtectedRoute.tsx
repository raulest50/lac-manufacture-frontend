// src/components/MultiRoleProtectedRoute.tsx
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Modulo } from '../types/Modulo';

type MultiRoleProtectedRouteProps = {
    children: JSX.Element;
    supportedModules: Modulo[]; // Array of allowed modules (e.g., [Modulo.USUARIOS, Modulo.PRODUCTOS])
};

const MultiRoleProtectedRoute: React.FC<MultiRoleProtectedRouteProps> = ({ children, supportedModules }) => {
    const { user, roles } = useAuth();

    // If not logged in, redirect to /login.
    if (!user) {
        return <Navigate to="/login" replace />;
    }

    // Check if the user is master or has access to at least one of the supported modules
    const isMaster = roles.includes('ROLE_MASTER');
    const hasAccess = isMaster || supportedModules.some(module => roles.includes(module));

    if (!hasAccess) {
        return <div>403 Forbidden: No tienes acceso a este módulo.</div>;
    }

    return children;
};

export default MultiRoleProtectedRoute;
