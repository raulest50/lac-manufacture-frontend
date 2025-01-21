// src/context/AuthContext.tsx
import React, { createContext, useContext, useState } from 'react';

// Define shape of our auth state
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

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<string | null>(null);
    const [roles, setRoles] = useState<string[]>([]);

    // Attempt Basic Auth => if success => store user/roles in state
    const login = async (username: string, password: string) => {
        const response = await fetch('http://localhost:8080/user/whoami', {
            headers: {
                Authorization: 'Basic ' + btoa(username + ':' + password),
            },
        });

        if (!response.ok) {
            throw new Error('Login failed');
        }

        const authObj = await response.json();
        // Typically we get an object with "principal" and "authorities"
        // Example:
        // {
        //   "principal": {
        //       "username": "master",
        //       "authorities": [
        //         { "authority": "ROLE_MASTER" }
        //       ]
        //   },
        //   "authorities": [
        //       { "authority": "ROLE_MASTER" }
        //   ]
        // }
        const principal = authObj.principal;
        if (principal?.username) {
            setUser(principal.username);
        }
        if (authObj.authorities) {
            const newRoles = authObj.authorities.map((a: any) => a.authority);
            setRoles(newRoles);
        }
    };

    const logout = () => {
        // clear local state
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
