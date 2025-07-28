// src/pages/LoginPage.tsx
import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../context/AuthContext.tsx';
import Metaballs from '../../componentes/reactbites/Metaballs.tsx';
import WelcomeBite from '../../componentes/reactbites/WelcomeBite.tsx';
import { useNavigate } from 'react-router-dom';
import {
    Button, 
    Container, 
    Flex, 
    FormControl, 
    FormLabel, 
    Heading, 
    Input, 
    Image, 
    Box,
    Link,
    useToast,
    Spinner,
    Text
} from "@chakra-ui/react";
import axios from 'axios';
import EndPointsURL from '../../api/EndPointsURL.tsx';

// TypeScript interfaces for component props
interface FormularioLoginProps {
    username: string;
    setUsername: (username: string) => void;
    password: string;
    setPassword: (password: string) => void;
    handleLogin: (e: React.FormEvent) => void;
    setViewMode: (mode: string) => void;
    isLoading: boolean;
}

interface FormularioForgotProps {
    onHandleEnviarForgot: (email: string) => void;
    isRequestDisabled: boolean;
    isLoading: boolean;
    setViewMode: (mode: string) => void;
}

// Login form component
const FormularioLogin: React.FC<FormularioLoginProps> = ({ 
    username, 
    setUsername, 
    password, 
    setPassword, 
    handleLogin, 
    setViewMode,
    isLoading
}) => {
    return (
        <>
            <Heading>Login Panel</Heading>
            <WelcomeBite text="Bienvenido a Exotic Expert ERP" />
            <FormControl isRequired>
                <FormLabel>Usuario</FormLabel>
                <Input
                    placeholder="username"
                    value={username}
                    onChange={e => setUsername(e.target.value)}
                    isDisabled={isLoading}
                />
            </FormControl>
            <FormControl isRequired>
                <FormLabel>Contraseña</FormLabel>
                <Input
                    placeholder="password"
                    type="password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    required
                    isDisabled={isLoading}
                />
            </FormControl>
            <Button
                variant="solid"
                colorScheme={"blue"}
                onClick={handleLogin}
                isLoading={isLoading}
                loadingText="Iniciando sesión"
                spinnerPlacement="start"
            >
                Login
            </Button>
            {isLoading && (
                <Flex align="center" justify="center" mt={2}>
                    <Spinner size="sm" color="blue.500" mr={2} />
                    <Text fontSize="sm" color="gray.600">Verificando credenciales...</Text>
                </Flex>
            )}
            <Link 
                color="blue.500" 
                onClick={() => setViewMode('forgot')}
                pointerEvents={isLoading ? "none" : "auto"}
                opacity={isLoading ? 0.6 : 1}
            >
                ¿Olvidó su contraseña?
            </Link>
        </>
    );
};

// Forgot password form component
const FormularioForgot: React.FC<FormularioForgotProps> = ({ 
    onHandleEnviarForgot, 
    isRequestDisabled, 
    isLoading,
    setViewMode 
}) => {
    const [email, setEmail] = useState('');

    return (
        <>
            <Heading>Recuperar Contraseña</Heading>
            <FormControl isRequired>
                <FormLabel>Correo Electrónico</FormLabel>
                <Input
                    placeholder="correo@ejemplo.com"
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    isDisabled={isLoading}
                />
            </FormControl>
            <Button
                variant="solid"
                colorScheme={"blue"}
                onClick={() => onHandleEnviarForgot(email)}
                isDisabled={isRequestDisabled}
                isLoading={isLoading}
                loadingText="Enviando correo"
                spinnerPlacement="start"
            >
                Enviar
            </Button>
            {isLoading && (
                <Flex align="center" justify="center" mt={2}>
                    <Spinner size="sm" color="blue.500" mr={2} />
                    <Text fontSize="sm" color="gray.600">Enviando solicitud...</Text>
                </Flex>
            )}
            <Link 
                color="blue.500" 
                onClick={() => setViewMode('login')}
                pointerEvents={isLoading ? "none" : "auto"}
                opacity={isLoading ? 0.6 : 1}
            >
                Volver al login
            </Link>
        </>
    );
};

export default function LoginPanel() {
    const { login } = useAuth();
    const navigate = useNavigate();
    const toast = useToast();
    const endpoints = new EndPointsURL();

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [viewMode, setViewMode] = useState('login'); // 'login' or 'forgot'
    const [isRequestDisabled, setIsRequestDisabled] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isForgotLoading, setIsForgotLoading] = useState(false);
    const requestTimeoutRef = useRef<NodeJS.Timeout | null>(null);

    // Clean up timeout on component unmount
    useEffect(() => {
        return () => {
            if (requestTimeoutRef.current) {
                clearTimeout(requestTimeoutRef.current);
            }
        };
    }, []);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();

        // Activar estado de carga
        setIsLoading(true);

        try {
            await login(username, password);
            //console.log(response);
            navigate('/');
            // after successful login, go to home or wherever you want
            // No necesitamos desactivar el estado de carga aquí porque la página se redirigirá
        } catch (error) {
            // Desactivar estado de carga en caso de error
            setIsLoading(false);

            // Mostrar mensaje de error con toast en lugar de alert
            toast({
                title: "Error de inicio de sesión",
                description: "No se pudo iniciar sesión. Verifique sus credenciales.",
                status: "error",
                duration: 5000,
                isClosable: true,
            });
        }
    };

    const onHandleEnviarForgot = async (email: string) => {
        // Implement rate limiting to prevent system overload
        setIsRequestDisabled(true);
        // Set loading state to true
        setIsForgotLoading(true);

        try {
            // Call the API to request password reset
            await axios.post(endpoints.request_reset_passw, { email });

            // Show success toast notification
            toast({
                title: "Solicitud enviada",
                description: "Se ha enviado un correo para recuperar su contraseña.",
                status: "success",
                duration: 5000,
                isClosable: true,
            });
        } catch (error) {
            console.error("Error requesting password reset:", error);

            // Show error toast notification, but with generic message for security
            toast({
                title: "Solicitud enviada",
                description: "Si el correo existe en nuestro sistema, recibirá un enlace para restablecer su contraseña.",
                status: "info",
                duration: 5000,
                isClosable: true,
            });
        } finally {
            // Set loading state to false
            setIsForgotLoading(false);
        }

        // Enable the button after 60 seconds to prevent abuse
        requestTimeoutRef.current = setTimeout(() => {
            setIsRequestDisabled(false);
        }, 60000); // 60 seconds cooldown
    };

    return (
        <Container minW={['auto', 'container.md', 'container.md']} w={"full"} h={"100vh"}>
            <Flex direction={"column"} gap={7} border={"0.5px solid gray"} borderRadius={"2em"} p={"4em"}
                  alignItems={"center"} flex={1}>
            <Box boxSize={'3xs'}>
                    <Image src={'/logo_exotic.svg'} />
                </Box>
                {viewMode === 'login' ? (
                    <FormularioLogin
                        username={username}
                        setUsername={setUsername}
                        password={password}
                        setPassword={setPassword}
                        handleLogin={handleLogin}
                        setViewMode={setViewMode}
                        isLoading={isLoading}
                    />
                ) : (
                    <FormularioForgot 
                        onHandleEnviarForgot={onHandleEnviarForgot}
                        isRequestDisabled={isRequestDisabled}
                        isLoading={isForgotLoading}
                        setViewMode={setViewMode}
                    />
                )}
            </Flex>
            <Metaballs />
        </Container>
    );
}
