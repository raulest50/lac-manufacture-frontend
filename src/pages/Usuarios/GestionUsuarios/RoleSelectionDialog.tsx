// src/components/RoleSelectionDialog.tsx
import React from 'react';
import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalCloseButton,
    ModalBody,
    List,
    ListItem,
    ListIcon,
} from '@chakra-ui/react';
import { CheckCircleIcon } from '@chakra-ui/icons';

export type RoleItem = {
    id: number;
    name: string;
};

interface RoleSelectionDialogProps {
    isOpen: boolean;
    onClose: () => void;
    availableRoles: RoleItem[];
    onRoleSelect: (role: RoleItem) => void;
}

const RoleSelectionDialog: React.FC<RoleSelectionDialogProps> = ({
                                                                     isOpen,
                                                                     onClose,
                                                                     availableRoles,
                                                                     onRoleSelect,
                                                                 }) => {
    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>Seleccionar Rol</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                    <List spacing={3}>
                        {availableRoles && availableRoles.length > 0 ? (
                            availableRoles.map((role) => (
                                <ListItem
                                    key={role.id}
                                    onClick={() => {
                                        onRoleSelect(role);
                                        onClose();
                                    }}
                                    _hover={{
                                        cursor: 'pointer',
                                        bg: 'gray.100',
                                    }}
                                    padding="2"
                                >
                                    <ListIcon as={CheckCircleIcon} color="green.500" />
                                    {role.name}
                                </ListItem>
                            ))
                        ) : (
                            <ListItem padding="2">
                                No hay roles disponibles para asignar
                            </ListItem>
                        )}
                    </List>
                </ModalBody>
            </ModalContent>
        </Modal>
    );
};

export default RoleSelectionDialog;
