// src/components/UserFullRoleCRUD.tsx
import { useEffect, useState } from 'react';
import {
    Box,
    Button,
    Table,
    Tbody,
    Td,
    Th,
    Thead,
    Tr,
    Text,
    Flex,
    Spacer,
    useToast,
} from '@chakra-ui/react';
import axios from 'axios';
import EndPointsURL from '../../api/EndPointsURL';
import CreateUserDialog from './CreateUserDialog';
import RoleSelectionDialog from './RoleSelectionDialog.tsx';
import { User, Role } from './types';

export default function UserFullRoleCRUD() {
    const [users, setUsers] = useState<User[]>([]);
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [selectedRole, setSelectedRole] = useState<Role | null>(null);
    const [showCreateDialog, setShowCreateDialog] = useState(false);
    const [showRoleDialog, setShowRoleDialog] = useState(false);
    const toast = useToast();
    const endPoints = new EndPointsURL();

    // Hardcoded list of all available roles
    const allRoles: Role[] = [
        { id: 1, name: 'ROLE_COMPRAS' },
        { id: 2, name: 'ROLE_JEFE_PRODUCCION' },
        { id: 3, name: 'ROLE_ASISTENTE_PRODUCCION' },
        { id: 4, name: 'ROLE_ALMACEN' },
    ];

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
        setSelectedRole(null);
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

    const handleAddRole = async (roleName: string) => {
        if (!selectedUser) return;
        try {
            const response = await axios.post(
                `${endPoints.domain}/usuarios/${selectedUser.id}/roles?roleName=${roleName}`
            );
            toast({
                title: 'Rol asignado',
                description: 'El rol ha sido asignado exitosamente.',
                status: 'success',
                duration: 5000,
                isClosable: true,
            });
            setSelectedUser(response.data);
            fetchUsers();
        } catch (error) {
            toast({
                title: 'Error',
                description: 'No se pudo asignar el rol.',
                status: 'error',
                duration: 5000,
                isClosable: true,
            });
        }
    };

    const handleRemoveRole = async (roleId: number) => {
        if (!selectedUser) return;
        if (selectedUser.username.toLowerCase() === 'master') {
            toast({
                title: 'Acción no permitida',
                description: 'No se puede remover roles del usuario master.',
                status: 'warning',
                duration: 5000,
                isClosable: true,
            });
            return;
        }
        try {
            const response = await axios.delete(
                `${endPoints.domain}/usuarios/${selectedUser.id}/roles/${roleId}`
            );
            toast({
                title: 'Rol removido',
                description: 'El rol ha sido removido exitosamente.',
                status: 'success',
                duration: 5000,
                isClosable: true,
            });
            setSelectedUser(response.data);
            fetchUsers();
        } catch (error) {
            toast({
                title: 'Error',
                description: 'No se pudo remover el rol.',
                status: 'error',
                duration: 5000,
                isClosable: true,
            });
        }
    };

    // Compute roles that can be assigned (those not already in the selected user's roles)
    const assignableRoles =
        selectedUser &&
        allRoles.filter(
            (role) => !selectedUser.roles.some((r) => r.name === role.name)
        );

    return (
        <Box p={4}>
            <Text fontSize="2xl" mb={4}>
                Creación de Usuarios y Asignación de Roles
            </Text>
            <Flex mb={4}>
                <Button colorScheme="blue" mr={4} onClick={() => setShowCreateDialog(true)}>
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
                                </Tr>
                            ))}
                        </Tbody>
                    </Table>
                </Box>
                <Spacer />
                <Box flex="1" borderWidth="1px" borderRadius="md" p={4}>
                    <Text fontSize="lg" mb={2}>
                        Roles asignados
                    </Text>
                    {selectedUser ? (
                        <Table variant="simple" size="sm">
                            <Thead>
                                <Tr>
                                    <Th>ID</Th>
                                    <Th>Nombre</Th>
                                </Tr>
                            </Thead>
                            <Tbody>
                                {selectedUser.roles.map((role) => (
                                    <Tr
                                        key={role.id}
                                        onClick={() => setSelectedRole(role)}
                                        _hover={{ bg: 'green.50', cursor: 'pointer' }}
                                        bg={selectedRole?.id === role.id ? 'green.100' : 'inherit'}
                                    >
                                        <Td>{role.id}</Td>
                                        <Td>{role.name}</Td>
                                    </Tr>
                                ))}
                            </Tbody>
                        </Table>
                    ) : (
                        <Text>No hay usuario seleccionado.</Text>
                    )}
                    <Flex mt={4}>
                        <Button
                            colorScheme="blue"
                            onClick={() => setShowRoleDialog(true)}
                            mr={2}
                            isDisabled={
                                !selectedUser || selectedUser.username.toLowerCase() === 'master'
                            }
                        >
                            Agregar Rol
                        </Button>
                        <Button
                            colorScheme="red"
                            onClick={() =>
                                selectedRole && handleRemoveRole(selectedRole.id)
                            }
                            isDisabled={
                                !selectedUser ||
                                !selectedRole ||
                                selectedUser.username.toLowerCase() === 'master'
                            }
                        >
                            Remover Rol
                        </Button>
                    </Flex>
                </Box>
            </Flex>
            {showCreateDialog && (
                <CreateUserDialog
                    isOpen={showCreateDialog}
                    onClose={() => setShowCreateDialog(false)}
                    onUserCreated={fetchUsers}
                />
            )}
            {showRoleDialog && selectedUser && assignableRoles && (
                <RoleSelectionDialog
                    isOpen={showRoleDialog}
                    onClose={() => setShowRoleDialog(false)}
                    availableRoles={assignableRoles}
                    onRoleSelect={(role) => {
                        handleAddRole(role.name);
                    }}
                />
            )}
        </Box>
    );
}
