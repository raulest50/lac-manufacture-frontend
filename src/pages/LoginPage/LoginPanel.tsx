// src/pages/LoginPage.tsx
import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext.tsx';
import { useNavigate } from 'react-router-dom';
import {Button, Container, Flex, FormControl, FormLabel, Heading, Input, Image, Box} from "@chakra-ui/react";

export default function LoginPanel() {
    const { login } = useAuth();
    const navigate = useNavigate();

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

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

    return (
        <Container minW={['auto', 'container.md', 'container.md']} w={"full"} h={"full"}>
            <Flex direction={"column"} gap={7} border={"0.5px solid gray"} borderRadius={"2em"} p={"4em"} alignItems={"center"}>
                <Box boxSize={'3xs'}>
                    <Image src={'/logo_exotic.svg'} />
                </Box>
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
            </Flex>
        </Container>
    );
}
