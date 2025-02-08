// src/context/AuthContext.tsx
import React, { createContext, useContext, useState } from 'react';
import axios from 'axios';
import EndPointsURL from "../api/EndPointsURL.tsx";

// 1) Describe each authority object
interface Authority {
    authority: string;
}

// 2) Describe the whoami response object
interface AuthResponse {
    principal?: {
        username?: string;
        authorities?: Authority[];
        // add more fields if needed
    };
    authorities?: Authority[];
}

// Our AuthContext type
type AuthContextType = {
    user: string | null;
    roles: string[];
    login: (username: string, password: string) => Promise<void>;
    logout: () => void;
};

const AuthContext = createContext<AuthContextType>({
    user: null,
    roles: [],
    login: async () => {},
    logout: () => {},
});

const endPoints = new EndPointsURL();

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<string | null>(null);
    const [roles, setRoles] = useState<string[]>([]);

    // Attempt Basic Auth => if successful, store user/roles in state and set Axios header
    const login = async (username: string, password: string) => {
        const authHeader = 'Basic ' + btoa(username + ':' + password);

        // Make the login call using fetch (or you could use axios)
        const response = await fetch(endPoints.whoami, {
            headers: {
                Authorization: authHeader,
            },
        });

        if (!response.ok) {
            throw new Error('Login failed');
        }

        const authObj = (await response.json()) as AuthResponse;

        // Set the user if returned from the response
        if (authObj.principal?.username) {
            setUser(authObj.principal.username);
        }

        // Set roles from the top-level authorities array, or fallback to principal.authorities
        if (authObj.authorities) {
            const newRoles = authObj.authorities.map((a) => a.authority);
            setRoles(newRoles);
        } else if (authObj.principal?.authorities) {
            const newRoles = authObj.principal.authorities.map((a) => a.authority);
            setRoles(newRoles);
        }

        // Set the Axios default header so that all subsequent axios requests include this
        axios.defaults.headers.common['Authorization'] = authHeader;
    };

    const logout = () => {
        setUser(null);
        setRoles([]);
        // Remove the header from axios defaults
        delete axios.defaults.headers.common['Authorization'];
        // Optionally, you can clear any stored credentials in localStorage as well.
    };

    return (
        <AuthContext.Provider value={{ user, roles, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

// Helper hook to use the AuthContext in other components
export const useAuth = () => useContext(AuthContext);
