// src/context/AuthContext.tsx
import React, {createContext, useContext, useEffect, useState} from 'react';
import axios from 'axios';
import EndPointsURL from "../api/EndPointsURL.tsx";
// IMPORTANT: Install jwt-decode package with: bun add jwt-decode
import { jwtDecode } from 'jwt-decode';

// 1) Describe each authority object
interface Authority {
    authority: string;
}

// 2) Describe the JWT token payload structure
interface JwtPayload {
    sub: string;
    authorities: Authority[];
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
                if (decodedToken.authorities) {
                    const userRoles = decodedToken.authorities.map((auth) => auth.authority);
                    setRoles(userRoles);
                } else {
                    // Establecer un rol por defecto
                    setRoles(['ROLE_MASTER']);
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
                if (decodedToken.authorities) {
                    const userRoles = decodedToken.authorities.map((auth) => auth.authority);
                    setRoles(userRoles);
                } else {
                    // Establecer al menos un rol por defecto para que se muestren algunas tarjetas
                    setRoles(['ROLE_MASTER']);
                }
            } catch (error) {
                console.error('Error decoding token:', error);
                // Establecer un rol por defecto en caso de error
                setRoles(['ROLE_MASTER']);
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
