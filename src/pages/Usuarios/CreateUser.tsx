// src/components/CreateUser.tsx
import { useState } from 'react';
import {
    Box,
    Button,
    FormControl,
    FormLabel,
    Input,
    useToast,
    VStack,
    Heading,
    Flex
} from '@chakra-ui/react';
import axios from 'axios';
import EndPointsURL from '../../api/EndPointsURL';

type Props = {
    onUserCreated: () => void;
    onCancel: () => void;
}

export default function CreateUser({onUserCreated, onCancel}:Props){
    const [username, setUsername] = useState('');
    const [nombreCompleto, setNombreCompleto] = useState('');
    const [password, setPassword] = useState('');
    const toast = useToast();

    const handleCreate = async () => {
        try {
            await axios.post(`${EndPointsURL.getDomain()}/usuarios`, {
                username,
                nombreCompleto,
                password
            });
            toast({
                title: "Usuario creado",
                description: "El usuario ha sido creado exitosamente.",
                status: "success",
                duration: 5000,
                isClosable: true,
            });
            onUserCreated(); // se regresa al UserViewer
        } catch (error) {
            toast({
                title: "Error",
                description: "No se pudo crear el usuario.",
                status: "error",
                duration: 5000,
                isClosable: true,
            });
        }
    };

    return (
        <Box borderWidth="1px" borderRadius="lg" p={6}>
            <Heading size="md" mb={4}>Crear Nuevo Usuario</Heading>
            <VStack spacing={4} align="stretch">
                <FormControl id="fullname" isRequired>
                    <FormLabel>Nombre Completo</FormLabel>
                    <Input value={nombreCompleto} onChange={(e) => setNombreCompleto(e.target.value)} />
                </FormControl>
                <FormControl id="username" isRequired>
                    <FormLabel>Nombre de Usuario</FormLabel>
                    <Input value={username} onChange={(e) => setUsername(e.target.value)} />
                </FormControl>
                <FormControl id="password" isRequired>
                    <FormLabel>Password</FormLabel>
                    <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
                </FormControl>
                <Flex gap={4} mt={4}>
                    <Button colorScheme="blue" onClick={handleCreate}>Crear Usuario</Button>
                    <Button onClick={onCancel}>Cancelar</Button>
                </Flex>
            </VStack>
        </Box>
    );
}
