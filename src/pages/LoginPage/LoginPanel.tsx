// src/pages/LoginPage.tsx
import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../context/AuthContext.tsx';
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
    useToast
} from "@chakra-ui/react";

// TypeScript interfaces for component props
interface FormularioLoginProps {
    username: string;
    setUsername: (username: string) => void;
    password: string;
    setPassword: (password: string) => void;
    handleLogin: (e: React.FormEvent) => void;
    setViewMode: (mode: string) => void;
}

interface FormularioForgotProps {
    onHandleEnviarForgot: (email: string) => void;
    isRequestDisabled: boolean;
    setViewMode: (mode: string) => void;
}

// Login form component
const FormularioLogin: React.FC<FormularioLoginProps> = ({ 
    username, 
    setUsername, 
    password, 
    setPassword, 
    handleLogin, 
    setViewMode 
}) => {
    return (
        <>
            <Heading>Login Panel</Heading>
            <FormControl isRequired>
                <FormLabel>Usuario</FormLabel>
                <Input
                    placeholder="username"
                    value={username}
                    onChange={e => setUsername(e.target.value)}
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
                />
            </FormControl>
            <Button
                variant="solid"
                colorScheme={"blue"}
                onClick={handleLogin}
            >Login
            </Button>
            <Link color="blue.500" onClick={() => setViewMode('forgot')}>
                ¿Olvidó su contraseña?
            </Link>
        </>
    );
};

// Forgot password form component
const FormularioForgot: React.FC<FormularioForgotProps> = ({ 
    onHandleEnviarForgot, 
    isRequestDisabled, 
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
                />
            </FormControl>
            <Button
                variant="solid"
                colorScheme={"blue"}
                onClick={() => onHandleEnviarForgot(email)}
                isDisabled={isRequestDisabled}
            >
                Enviar
            </Button>
            <Link color="blue.500" onClick={() => setViewMode('login')}>
                Volver al login
            </Link>
        </>
    );
};

export default function LoginPanel() {
    const { login } = useAuth();
    const navigate = useNavigate();
    const toast = useToast();

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [viewMode, setViewMode] = useState('login'); // 'login' or 'forgot'
    const [isRequestDisabled, setIsRequestDisabled] = useState(false);
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
        try {
            console.log(username);
            console.log(password);
            const response = await login(username, password);
            console.log(response);
            navigate('/');
            // after successful login, go to home or wherever you want
        } catch (error) {
            alert('Login failed. Check console or server logs.');
        }
    };

    const onHandleEnviarForgot = (email: string) => {
        // Implement rate limiting to prevent system overload
        setIsRequestDisabled(true);

        // Show toast notification
        toast({
            title: "Solicitud enviada",
            description: "Se ha enviado un correo para recuperar su contraseña.",
            status: "success",
            duration: 5000,
            isClosable: true,
        });

        // Enable the button after 60 seconds to prevent abuse
        requestTimeoutRef.current = setTimeout(() => {
            setIsRequestDisabled(false);
        }, 60000); // 60 seconds cooldown

        // Empty implementation as requested
        // The actual implementation will be added later
    };

    return (
        <Container minW={['auto', 'container.md', 'container.md']} w={"full"} h={"full"}>
            <Flex direction={"column"} gap={7} border={"0.5px solid gray"} borderRadius={"2em"} p={"4em"} alignItems={"center"}>
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
                    />
                ) : (
                    <FormularioForgot 
                        onHandleEnviarForgot={onHandleEnviarForgot}
                        isRequestDisabled={isRequestDisabled}
                        setViewMode={setViewMode}
                    />
                )}
            </Flex>
        </Container>
    );
}
