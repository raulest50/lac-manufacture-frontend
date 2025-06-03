// src/context/AuthContext.tsx
import React, {createContext, useContext, useEffect, useState} from 'react';
import axios from 'axios';
import EndPointsURL from "../api/EndPointsURL.tsx";
// IMPORTANT: Install jwt-decode package with: bun add jwt-decode
import { jwtDecode } from 'jwt-decode';

// 1) Describe each authority object
/*interface Authority {
    authority: string;
}*/

// 2) Describe the JWT token payload structure
interface JwtPayload {
    sub: string;
    accesos: string; // Changed from authorities: Authority[] to match backend
    exp: number;
    iat: number;
    // Add other JWT claims as needed
}

// 3) Describe the login response
interface LoginResponse {
    token: string;
    username: string;
}

// Our AuthContext type
type AuthContextType = {
    user: string | null;
    roles: string[];
    login: (username: string, password: string) => Promise<LoginResponse>;
    logout: () => void;
};

const AuthContext = createContext<AuthContextType>({
    user: null,
    roles: [],
    login: async () => {
        throw new Error('login function not implemented');
    },
    logout: () => {},
});

const endPoints = new EndPointsURL();

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<string | null>(null);
    const [roles, setRoles] = useState<string[]>([]);

    useEffect(() => {
        const token = localStorage.getItem('authToken');
        if (token) {
            // Configurar el header de autorización con el token guardado
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

            // Decodificar el token para obtener el usuario y los roles
            try {
                const decodedToken = jwtDecode<JwtPayload>(token);

                // Establecer el usuario si está disponible en el token
                if (decodedToken.sub) {
                    setUser(decodedToken.sub);
                }

                // Extraer los roles del token
                if (decodedToken.accesos) {
                    // Split the comma-separated string into an array of role strings
                    const userRoles = decodedToken.accesos.split(',');
                    setRoles(userRoles);
                } else if (decodedToken.sub === 'master') {
                    // Si el usuario es 'master', darle acceso a todo incondicionalmente
                    setRoles(['ROLE_MASTER']);
                } else {
                    // Sin accesos asignados, no debe tener acceso a ningún módulo
                    setRoles([]);
                }
            } catch (error) {
                console.error('Error decoding token on init:', error);
                // Si hay un error al decodificar, probablemente el token es inválido
                // Limpiar el token y forzar un nuevo login
                localStorage.removeItem('authToken');
                delete axios.defaults.headers.common['Authorization'];
            }
        }
    }, []);

    // Login with JWT authentication
    const login = async (username: string, password: string) => {
        try {
            // Usar el nuevo endpoint de autenticación JWT
            const response = await fetch(endPoints.login, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, password }),
            });

            if (!response.ok) {
                throw new Error('Login failed');
            }

            const authData = await response.json() as LoginResponse;

            // Guardar el token JWT
            const token = authData.token;

            // Establecer el usuario desde la respuesta
            setUser(authData.username);

            // Decodificar el token JWT para obtener los roles
            try {
                const decodedToken = jwtDecode<JwtPayload>(token);
                if (decodedToken.accesos) {
                    // Split the comma-separated string into an array of role strings
                    const userRoles = decodedToken.accesos.split(',');
                    setRoles(userRoles);
                } else if (authData.username === 'master') {
                    // Si el usuario es 'master', darle acceso a todo incondicionalmente
                    setRoles(['ROLE_MASTER']);
                } else {
                    // Sin accesos asignados, no debe tener acceso a ningún módulo
                    setRoles([]);
                }
            } catch (error) {
                console.error('Error decoding token:', error);
                // Verificar si el usuario es 'master' incluso en caso de error
                if (authData.username === 'master') {
                    // Si el usuario es 'master', darle acceso a todo incondicionalmente
                    setRoles(['ROLE_MASTER']);
                } else {
                    // Sin accesos asignados en caso de error, no debe tener acceso a ningún módulo
                    setRoles([]);
                }
            }

            // Configurar el header de autorización para futuras peticiones
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

            // Opcional: Guardar el token en localStorage para persistencia
            localStorage.setItem('authToken', token);

            return authData;
        } catch (error) {
            console.error('Login error:', error);
            throw error;
        }
    };

    const logout = () => {
        setUser(null);
        setRoles([]);
        // Eliminar el header de autorización
        delete axios.defaults.headers.common['Authorization'];
        // Eliminar el token del localStorage
        localStorage.removeItem('authToken');
    };

    return (
        <AuthContext.Provider value={{ user, roles, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

// Helper hook to use the AuthContext in other components
export const useAuth = () => useContext(AuthContext);
