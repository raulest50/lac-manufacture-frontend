// src/components/CreateUserDialog.tsx
import React, { useState } from 'react';
import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalCloseButton,
    ModalBody,
    ModalFooter,
    Button,
    FormControl,
    FormLabel,
    Input,
    useToast
} from '@chakra-ui/react';
import axios from 'axios';
import EndPointsURL from '../../api/EndPointsURL';


interface CreateUserDialogProps {
    isOpen: boolean;
    onClose: () => void;
    onUserCreated: () => void;
}

const CreateUserDialog: React.FC<CreateUserDialogProps> = ({ isOpen, onClose, onUserCreated }) => {
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
            onUserCreated();
            onClose();
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
        <Modal isOpen={isOpen} onClose={onClose}>
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>Crear Nuevo Usuario</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                    <FormControl id="fullname" mb={4} isRequired>
                        <FormLabel>Nombre Completo</FormLabel>
                        <Input value={nombreCompleto} onChange={(e) => setNombreCompleto(e.target.value)} />
                    </FormControl>
                    <FormControl id="username" mb={4} isRequired>
                        <FormLabel>Nombre de Usuario</FormLabel>
                        <Input value={username} onChange={(e) => setUsername(e.target.value)} />
                    </FormControl>
                    <FormControl id="password" mb={4} isRequired>
                        <FormLabel>Password</FormLabel>
                        <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
                    </FormControl>
                    {/* Add additional fields here if needed */}
                </ModalBody>
                <ModalFooter>
                    <Button colorScheme="blue" mr={3} onClick={handleCreate}>
                        Crear Usuario
                    </Button>
                    <Button variant="ghost" onClick={onClose}>Cancelar</Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
};

export default CreateUserDialog;
