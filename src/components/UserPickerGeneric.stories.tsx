// src/components/UserPickerGeneric.stories.tsx

import React, { useState } from 'react';
import UserGenericPicker from './UserPickerGeneric';
import { User } from '../pages/Usuarios/GestionUsuarios/types';
import { Button, Box, Text, VStack } from '@chakra-ui/react';

export const Default = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  const handleOpen = () => setIsOpen(true);
  const handleClose = () => setIsOpen(false);
  
  const handleSelectUser = (user: User) => {
    setSelectedUser(user);
    console.log('Selected user:', user);
  };

  return (
    <VStack spacing={4} align="start" p={5}>
      <Button colorScheme="blue" onClick={handleOpen}>
        Abrir Selector de Usuario
      </Button>
      
      {selectedUser && (
        <Box p={4} borderWidth="1px" borderRadius="md" bg="gray.50" width="100%">
          <Text fontWeight="bold">Usuario Seleccionado:</Text>
          <Text>ID: {selectedUser.id}</Text>
          <Text>Cédula: {selectedUser.cedula}</Text>
          <Text>Nombre: {selectedUser.nombreCompleto || selectedUser.username}</Text>
          <Text>Username: {selectedUser.username}</Text>
        </Box>
      )}
      
      <UserGenericPicker
        isOpen={isOpen}
        onClose={handleClose}
        onSelectUser={handleSelectUser}
      />
    </VStack>
  );
};

export default {
  title: 'Components/UserGenericPicker',
  component: UserGenericPicker,
};