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
    useToast,
    Spinner,
    Text
} from "@chakra-ui/react";
import axios from 'axios';
import EndPointsURL from '../../api/EndPointsURL.tsx';
import SplashCursor from '../../components/SplashCursor.tsx';
import { ClickSpark } from "@appletosolutions/reactbits";

// … (interfaces y componentes internos omitidos por brevedad)

const LoginPage: React.FC = () => {
    const { login } = useAuth();
    const navigate = useNavigate();
    const toast = useToast();
    const endpoints = EndPointsURL();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [viewMode, setViewMode] = useState('login');
    const [isRequestDisabled, setIsRequestDisabled] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isForgotLoading, setIsForgotLoading] = useState(false);
    const requestTimeoutRef = useRef<NodeJS.Timeout | null>(null);

    // … (resto de la lógica de login/forgot)

    return (
        <ClickSpark
            sparkColor="#3182CE"
            sparkSize={12}
            sparkRadius={24}
            sparkCount={14}
            duration={800}
            easing="ease-out"
            extraScale={1.5}
        >
            <SplashCursor>
                <Container
                    minW={['auto', 'container.md', 'container.md']}
                    w={"full"}
                    h={"100vh"}
                    bg={"transparent"}
                >
                    <Flex
                        direction={"column"}
                        gap={7}
                        border={"0.5px solid gray"}
                        borderRadius={"2em"}
                        p={"4em"}
                        alignItems={"center"}
                        flex={1}
                    >
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
                </Container>
            </SplashCursor>
        </ClickSpark>
    );
};

export default LoginPage;
