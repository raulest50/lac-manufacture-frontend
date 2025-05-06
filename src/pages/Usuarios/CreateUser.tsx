// src/pages/Usuarios/CreateUser.tsx
import { useState } from 'react';
import {
    Box,
    Button,
    FormControl,
    FormLabel,
    Input,
    useToast,
    Heading,
    Grid,
    GridItem,
    Flex,
    Select
} from '@chakra-ui/react';
import axios from 'axios';
import EndPointsURL from '../../api/EndPointsURL';

type Props = {
    onUserCreated: () => void;
    onCancel: () => void;
};

export default function CreateUser({ onUserCreated, onCancel }: Props) {
    const [cedula, setCedula] = useState('');
    const [username, setUsername] = useState('');
    const [nombreCompleto, setNombreCompleto] = useState('');
    const [password, setPassword] = useState('');
    const [cel, setCel] = useState('');
    const [direccion, setDireccion] = useState('');
    const [fechaNacimiento, setFechaNacimiento] = useState('');
    const [estado, setEstado] = useState('1');

    const toast = useToast();

    const handleCreate = async () => {
        try {
            await axios.post(`${EndPointsURL.getDomain()}/usuarios`, {
                cedula: Number(cedula),
                username,
                nombreCompleto,
                password,
                cel,
                direccion,
                fechaNacimiento,
                estado: Number(estado)
            });

            toast({
                title: "Usuario creado",
                description: "El usuario ha sido creado exitosamente.",
                status: "success",
                duration: 5000,
                isClosable: true,
            });
            onUserCreated(); // vuelve al modo UserViewer
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
            <Grid templateColumns="repeat(2, 1fr)" gap={4}>
                <GridItem>
                    <FormControl isRequired>
                        <FormLabel>Cédula</FormLabel>
                        <Input type="number" value={cedula} onChange={(e) => setCedula(e.target.value)} />
                    </FormControl>
                </GridItem>
                <GridItem>
                    <FormControl isRequired>
                        <FormLabel>Nombre Completo</FormLabel>
                        <Input value={nombreCompleto} onChange={(e) => setNombreCompleto(e.target.value)} />
                    </FormControl>
                </GridItem>

                <GridItem>
                    <FormControl isRequired>
                        <FormLabel>Nombre de Usuario</FormLabel>
                        <Input value={username} onChange={(e) => setUsername(e.target.value)} />
                    </FormControl>
                </GridItem>
                <GridItem>
                    <FormControl isRequired>
                        <FormLabel>Contraseña</FormLabel>
                        <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
                    </FormControl>
                </GridItem>

                <GridItem>
                    <FormControl>
                        <FormLabel>Celular</FormLabel>
                        <Input value={cel} onChange={(e) => setCel(e.target.value)} />
                    </FormControl>
                </GridItem>
                <GridItem>
                    <FormControl>
                        <FormLabel>Dirección</FormLabel>
                        <Input value={direccion} onChange={(e) => setDireccion(e.target.value)} />
                    </FormControl>
                </GridItem>

                <GridItem>
                    <FormControl>
                        <FormLabel>Fecha de Nacimiento</FormLabel>
                        <Input type="date" value={fechaNacimiento} onChange={(e) => setFechaNacimiento(e.target.value)} />
                    </FormControl>
                </GridItem>
                <GridItem>
                    <FormControl isRequired>
                        <FormLabel>Estado</FormLabel>
                        <Select value={estado} onChange={(e) => setEstado(e.target.value)}>
                            <option value="1">Activo</option>
                            <option value="2">Inactivo</option>
                        </Select>
                    </FormControl>
                </GridItem>
            </Grid>

            <Flex gap={4} mt={6}>
                <Button colorScheme="blue" onClick={handleCreate}>Crear Usuario</Button>
                <Button onClick={onCancel}>Cancelar</Button>
            </Flex>
        </Box>
    );
}
