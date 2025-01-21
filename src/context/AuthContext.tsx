// src/context/AuthContext.tsx
import React, { createContext, useContext, useState } from 'react';
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
        // add more fields if you have them
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

    // Attempt Basic Auth => if success => store user/roles in state
    const login = async (username: string, password: string) => {
        const response = await fetch(endPoints.whoami, {
            headers: {
                Authorization: 'Basic ' + btoa(username + ':' + password),
            },
        });

        if (!response.ok) {
            throw new Error('Login failed');
        }

        // Cast the JSON to our AuthResponse interface
        const authObj = (await response.json()) as AuthResponse;

        // Check principal
        const principal = authObj.principal;
        if (principal?.username) {
            setUser(principal.username);
        }

        // Check top-level authorities array
        if (authObj.authorities) {
            const newRoles = authObj.authorities.map((a) => a.authority);
            setRoles(newRoles);
        } else {
            // If there's no top-level array, maybe check principal.authorities
            // but depends on how your backend returns data
            // e.g.:
            // if (principal?.authorities) {
            //   const newRoles = principal.authorities.map(a => a.authority);
            //   setRoles(newRoles);
            // }
        }
    };

    const logout = () => {
        setUser(null);
        setRoles([]);
        // optionally fetch("/logout") if your backend ends the session
    };

    return (
        <AuthContext.Provider value={{ user, roles, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

// Helper hook
export const useAuth = () => useContext(AuthContext);
