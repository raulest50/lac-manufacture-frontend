// src/components/UserViewer.tsx
import {useEffect, useState} from 'react';
import {
    Box, Button, Flex, Spacer, Table,
    Tbody, Td, Th, Thead, Tr, Text,
    useToast
} from '@chakra-ui/react';
import axios from 'axios';
import ModuleSelectionDialog, { ModuleItem } from './ModuleSelectionDialog.tsx';
import {User, Acceso} from './types.tsx';
import { Modulo } from './types.tsx';
import EndPointsURL from "../../../api/EndPointsURL.tsx";

type Props = {
    setViewMode: (viewMode: number) => void;
}

export default function UserViewer({setViewMode}:Props) {

    const [users, setUsers] = useState<User[]>([]);
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [selectedAcceso, setSelectedAcceso] = useState<Acceso | null>(null);
    const [showModuleDialog, setShowModuleDialog] = useState(false);
    const toast = useToast();
    const endPoints = new EndPointsURL();

    // List of all available modules
    const allModules: ModuleItem[] = Object.values(Modulo).map((modulo, index) => ({
        id: index + 1,
        modulo: modulo as Modulo,
        displayName: modulo.replace(/_/g, ' ')
    }));

    const fetchUsers = async () => {
        try {
            const response = await axios.get(`${endPoints.domain}/usuarios`);
            setUsers(response.data);
        } catch (error) {
            toast({
                title: 'Error',
                description: 'No se pudieron cargar los usuarios.',
                status: 'error',
                duration: 5000,
                isClosable: true,
            });
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const handleUserSelect = (user: User) => {
        setSelectedUser(user);
        console.log(user.accesos);
        setSelectedAcceso(null);
    };

    const handleDeleteUser = async () => {
        if (!selectedUser) return;
        if (selectedUser.username.toLowerCase() === 'master') {
            toast({
                title: 'Acción no permitida',
                description: 'El usuario master no se puede eliminar.',
                status: 'warning',
                duration: 5000,
                isClosable: true,
            });
            return;
        }
        try {
            await axios.delete(`${endPoints.domain}/usuarios/${selectedUser.id}`);
            toast({
                title: 'Usuario eliminado',
                description: 'El usuario ha sido eliminado exitosamente.',
                status: 'success',
                duration: 5000,
                isClosable: true,
            });
            setSelectedUser(null);
            fetchUsers();
        } catch (error) {
            toast({
                title: 'Error',
                description: 'No se pudo eliminar el usuario.',
                status: 'error',
                duration: 5000,
                isClosable: true,
            });
        }
    };

    const handleAddAcceso = async (moduleItem: ModuleItem) => {
        if (!selectedUser || !moduleItem.nivelAcceso) return;
        try {
            const response = await axios.post(
                `${endPoints.domain}/usuarios/${selectedUser.id}/accesos/modulo?modulo=${moduleItem.modulo}&nivel=${moduleItem.nivelAcceso}`
            );
            toast({
                title: 'Acceso asignado',
                description: 'El acceso ha sido asignado exitosamente.',
                status: 'success',
                duration: 5000,
                isClosable: true,
            });
            setSelectedUser(response.data);
            fetchUsers();
        } catch (error) {
            toast({
                title: 'Error',
                description: 'No se pudo asignar el acceso.',
                status: 'error',
                duration: 5000,
                isClosable: true,
            });
        }
    };

    const handleRemoveAcceso = async (accesoId: number) => {
        if (!selectedUser) return;
        if (selectedUser.username.toLowerCase() === 'master') {
            toast({
                title: 'Acción no permitida',
                description: 'No se puede remover accesos del usuario master.',
                status: 'warning',
                duration: 5000,
                isClosable: true,
            });
            return;
        }
        try {
            const response = await axios.delete(
                `${endPoints.domain}/usuarios/${selectedUser.id}/accesos/${accesoId}`
            );
            toast({
                title: 'Acceso removido',
                description: 'El acceso ha sido removido exitosamente.',
                status: 'success',
                duration: 5000,
                isClosable: true,
            });
            setSelectedUser(response.data);
            fetchUsers();
        } catch (error) {
            toast({
                title: 'Error',
                description: 'No se pudo remover el acceso.',
                status: 'error',
                duration: 5000,
                isClosable: true,
            });
        }
    };

    // Compute modules that can be assigned (those not already in the selected user's accesos)
    const assignableModules = selectedUser
        ? allModules.filter(
            (moduleItem) => !(selectedUser.accesos && selectedUser.accesos.some((a) => a.moduloAcceso && a.moduloAcceso === moduleItem.modulo))
        )
        : [];

    return (
        <Box p={4}>

            <Text fontSize="2xl" mb={4}>
                Creación de Usuarios y Asignación de Accesos
            </Text>
            <Flex mb={4}>
                <Button colorScheme="blue" mr={4} onClick={ () => setViewMode(1)}>
                    Crear Nuevo Usuario
                </Button>
                <Button
                    colorScheme="red"
                    onClick={handleDeleteUser}
                    isDisabled={
                        !selectedUser || selectedUser.username.toLowerCase() === 'master'
                    }
                >
                    Eliminar Usuario
                </Button>
            </Flex>
            <Flex>
                <Box flex="2">
                    <Table variant="simple">
                        <Thead>
                            <Tr>
                                <Th>ID</Th>
                                <Th>Username</Th>
                                <Th>Nombre Completo</Th>
                            </Tr>
                        </Thead>
                        <Tbody>
                            {users.map((user) => (
                                <Tr
                                    key={user.id}
                                    onClick={() => handleUserSelect(user)}
                                    _hover={{ bg: 'blue.50', cursor: 'pointer' }}
                                    bg={selectedUser?.id === user.id ? 'blue.100' : 'inherit'}
                                >
                                    <Td>{user.id}</Td>
                                    <Td>{user.username}</Td>
                                    <Td>{user.nombreCompleto}</Td>
                                </Tr>
                            ))}
                        </Tbody>
                    </Table>
                </Box>
                <Spacer />
                <Box flex="1" borderWidth="1px" borderRadius="md" p={4}>
                    <Text fontSize="lg" mb={2}>
                        Accesos asignados
                    </Text>
                    {selectedUser ? (
                        <Table variant="simple" size="sm">
                            <Thead>
                                <Tr>
                                    <Th>ID</Th>
                                    <Th>Módulo</Th>
                                    <Th>Nivel</Th>
                                </Tr>
                            </Thead>
                            <Tbody>
                                {selectedUser.accesos && selectedUser.accesos.length > 0 ? selectedUser.accesos.map((acceso) => (
                                    <Tr
                                        key={acceso.id}
                                        onClick={() => setSelectedAcceso(acceso)}
                                        _hover={{ bg: 'green.50', cursor: 'pointer' }}
                                        bg={selectedAcceso?.id === acceso.id ? 'green.100' : 'inherit'}
                                    >
                                        <Td>{acceso.id}</Td>
                                        <Td>{acceso.moduloAcceso ? acceso.moduloAcceso.replace(/_/g, ' ') : 'Desconocido'}</Td>
                                        <Td>{acceso.nivel}</Td>
                                    </Tr>
                                )) : (
                                    <Tr>
                                        <Td colSpan={3}>No hay accesos asignados</Td>
                                    </Tr>
                                )}
                            </Tbody>
                        </Table>
                    ) : (
                        <Text>No hay usuario seleccionado.</Text>
                    )}
                    <Flex mt={4}>
                        <Button
                            colorScheme="blue"
                            onClick={() => setShowModuleDialog(true)}
                            mr={2}
                            isDisabled={
                                !selectedUser || selectedUser.username.toLowerCase() === 'master'
                            }
                        >
                            Agregar Acceso
                        </Button>
                        <Button
                            colorScheme="red"
                            onClick={() =>
                                selectedAcceso && handleRemoveAcceso(selectedAcceso.id)
                            }
                            isDisabled={
                                !selectedUser ||
                                !selectedAcceso ||
                                selectedUser.username.toLowerCase() === 'master'
                            }
                        >
                            Remover Acceso
                        </Button>
                    </Flex>
                </Box>
            </Flex>

            {showModuleDialog && selectedUser && (
                <ModuleSelectionDialog
                    isOpen={showModuleDialog}
                    onClose={() => setShowModuleDialog(false)}
                    availableModules={assignableModules || []}
                    onModuleSelect={handleAddAcceso}
                />
            )}
        </Box>
    );
}
